import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe'
import {getStripe} from '@/app/api/lib/stripe'
//import { createClient } from "@/utils/supabase/server";
import { buffer } from 'micro';
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // use a service key if needed, or anon key if no auth needed
  );
}

export const config = {
    api: {
      bodyParser: false,
    },
  }
 
export default async function handler (req: NextApiRequest, res: NextApiResponse){

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabase = await createClient();
    const stripe = getStripe()
    const rawBody = (await buffer(req)).toString()
    const sig = req.headers['stripe-signature'] as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

    console.log('rawBody', rawBody)
    console.log('sig', sig)
    console.log('endpointSecret', endpointSecret)

    if (!stripe) {
        return res.status(500).json({ error: "Stripe not initialized" });
    }

    let event: Stripe.Event

    try {
        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
            console.log('Received event type:', event, event.type);
            console.log('Connected account id:', event.account);
        } catch (err) {
            console.error('Signature verification failed:', err)
            return res.status(400).send(`Webhook Error: ${err}`)
        }
        // handle Stripe Event
    
        switch(event.type){
            // when event is payment_intent.succeded
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent & {
                    charges: Stripe.ApiList<Stripe.Charge>;
                };
                console.log('paymentIntent', paymentIntent)
                const {id, amount, created, customer, charges, status, payment_method_types} = paymentIntent

                const {data: accountIdExistsInDb, error: accountError} = await supabase
                    .from('connected_accounts')
                    .select()
                    .eq('account_id', event.account)
                    .limit(1)
                    .single()
                
                if (accountError) {
                    console.log('account Error webhook', accountError)
                    return res.status(500).json({ error: 'Database error', details: accountError });
                }

                const {data: transactionExists, error: transactionDBError} = await supabase.from('transactions').select().eq('stripe_id', id).single()
                console.log('transactionDBError', transactionDBError)

                if (transactionExists) {
                    return res.status(200).json({message: 'Duplicate transaction'})
                }
                console.log('charges data', charges?.data)
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
                    return res.status(500).json({ error: 'Transaction insert failed' });
                }

                const {data: transactions, error: fetchTransactionsError} = await supabase.from('transactions').select().eq('customer_id', customer)
                console.log('fetchTransactionsError', fetchTransactionsError)
                if(fetchTransactionsError) {
                    return res.status(500).json({error: 'Error retrieving transactions from database'})
                }
                
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict-fraud`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',    
                    },
                    body: JSON.stringify(transactions)
                })

                const result = await data.json()
                console.log('result', result)

                const {data: updateTransaction, error: updateTransactionError} = await supabase.from('transactions').update({
                    predicted_risk: result.predicted_risk, 
                    probabilities: result.probabilities,
                    ...result.derived_features
                })
                .eq('stripe_id', id)
                .order('timestamp', { ascending: false }) 
                .limit(1)
                .select()

                console.log('updateTransactionError', updateTransactionError)

                const indexTransaction = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/index-transaction`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateTransaction?.[0])
                })

                console.log('updateTransactionError', indexTransaction)
                
                break
    
            // adding more cases - need to think about other event cases
            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

    } catch (error){

        console.error("Webhook signature verification failed", error)

        return res.status(400).json({message:"Webhook error"})

    }


    return res.status(200).json({received: true, message:"Success"})
}