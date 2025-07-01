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

    // connect to webhook
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
        // handle Stripe Event
    
        switch(event.type){
            // when event is payment_intent.succeded
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                const {id, amount, created, customer, charges, status, payment_method_types} = paymentIntent
                const chargesForPI = charges.data.filter(charge => charge.payment_intent == id)
                const {billing_details} = chargesForPI[0]

                const {data: history, error} = await supabase.from('transactions').select().eq('customer_id', customer)


                const formattedData = {
                    id: id,
                    customer_id: customer,
                    timestamp: (new Date(created * 1000)).toISOString(),
                    status,    
                    amount: (amount / 100).toFixed(2), 
                    billing_email: billing_details.email,
                    billiing_name: billing_details?.name, 
                    billing_phone: billing_details?.phone, 
                    billing_line1: billing_details?.address?.line1, 
                    billing_city: billing_details?.address?.city, 
                    billing_state: billing_details?.address.state, 
                    billing_postal_code: billing_details?.address.postal_code, 
                    payment_method: payment_method_types[0]
                }
                
                const data = await fetch('http://localhost:5000/predict-fraud', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',    
                    },
                    body: JSON.stringify(formattedData)
                })

                const result = await data.json()
                console.log(result)

                await supabase.from('transactions').insert({
                    stripe_id: formattedData.id, 
                    amount: formattedData.amount,
                    currency: 'usd', 
                    created: formattedData.timestamp, 
                    payment_method: formattedData.payment_method, 
                    customer_email: formattedData.billing_email, 
                    location: `${formattedData.billing_line1} ${formattedData.billing_city}, ${formattedData.billing_state}, ${formattedData.billing_postal_code}`,
                    name: formattedData.billiing_name, 
                    risk_level_low: result.probabilities.low, 
                    risk_level_med: result.probabilities.medium, 
                    risk_level_high: result.probabilities.high,
                    predicted_risk: result.predicted_risk, 
                    
                })
                
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