import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe'
import {stripe} from '@/app/api/lib/stripe'
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest){
    const supabase = await createClient();

    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
    }catch (error){
        console.error("Webhook signature verification failed", error)
        return NextResponse.json({message:"Webhook error"},{
            status: 400 })
    }

   

    // handle Stripe Event

    switch(event.type){
        
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent 

            const transactionData = {
                stripe_id : paymentIntent.id,
                amount : paymentIntent.amount,
                currency : paymentIntent.currency,
                created : new Date(paymentIntent.created * 1000).toString(),
                payment_method : paymentIntent.payment_method,
                customer_email: paymentIntent.receipt_email,
                location: paymentIntent.shipping?.address?.city,
                status: paymentIntent.status,
                name: paymentIntent.shipping?.name,
                metadata: paymentIntent.metadata
            }
            await supabase.from('transactions').insert([transactionData]);

            console.log('Payment Intent was succesful', paymentIntent)
            break

        // adding more cases - need to 
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({received: true, message:"Success"})
}