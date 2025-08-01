import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe'
import {stripe} from '@/app/api/lib/stripe'
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest){
    const supabase = await createClient();

    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
        // handle Stripe Event
    
        switch(event.type){
            // when event is payment_intent.succeded
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent & {
                    charges: Stripe.ApiList<Stripe.Charge>;
                };
                const {id, amount, created, customer, charges, status, payment_method_types} = paymentIntent

                const {data: accountIdExistsInDb, error: accountError} = await supabase
                    .from('connected_accounts')
                    .select()
                    .eq('account_id', event.account)
                    .limit(1)
                    .single()

                if (accountError) {
                    return NextResponse.json({ error: 'Database error', details: accountError }, { status: 500 });
                }

                const {data: transactionExists, error: transactionDBError} = await supabase.from('transactions').select().eq('stripe_id', id).single()

                if (transactionExists) {
                    return NextResponse.json({message: 'Duplicate transaction', status: 200})
                }

                const chargesForPI = charges.data.filter((charge: Stripe.Charge) => charge.payment_intent == id)
                const {billing_details} = chargesForPI[0]

               const { error: transactionError } = await supabase
                .from('transactions')
                .insert({
                    stripe_id: id,
                    account_id: accountIdExistsInDb.account_id,
                    customer_id: customer,
                    status,
                    timestamp: new Date(created * 1000).toISOString(),
                    amount: (amount / 100).toFixed(2),
                    billing_email: billing_details?.email,
                    billing_name: billing_details?.name, 
                    billing_phone: billing_details?.phone,
                    billing_line1: billing_details?.address?.line1,
                    billing_city: billing_details?.address?.city,
                    billing_state: billing_details?.address?.state,
                    billing_postal_code: billing_details?.address?.postal_code,
                    payment_method: payment_method_types?.[0]
                })

                if (transactionError) {
                    console.error('Insert error:', transactionError);
                    return NextResponse.json({ error: 'Transaction insert failed' }, { status: 500 });
                }

                const {data: transactions, error: fetchTransactions} = await supabase.from('transactions').select().eq('customer_id', customer)

                if(fetchTransactions) {
                    return NextResponse.json({error: 'Error retrieving transactions from database', status: 500})
                }
                
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict-fraud`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',    
                    },
                    body: JSON.stringify(transactions)
                })

                const result = await data.json()
                //console.log(result)

                const {data: updateTransaction, error: updateTransactionError} = await supabase.from('transactions').update({
                    predicted_risk: result.predicted_risk, 
                    probabilities: result.probabilities,
                    ...result.derived_features
                })
                .eq('stripe_id', id)
                .order('timestamp', { ascending: false }) 
                .limit(1)
                .select()
                console.log('update transaction error', updateTransactionError)



                const indexTransaction = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/index-transaction`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateTransaction?.[0])
                })

                console.log(indexTransaction)
                
                break
    
            // adding more cases - need to think about other event cases
            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

    } catch (error){

        console.error("Webhook signature verification failed", error)

        return NextResponse.json({message:"Webhook error"},{
            status: 400 })

    }


    return NextResponse.json({received: true, message:"Success"})
}