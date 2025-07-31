import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe'
import {stripe} from '@/app/api/lib/stripe'
import { createClient } from "@/utils/supabase/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest){
    const supabase = await createClient();

    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
        // handle Stripe Event
    
        switch(event.type){
            // when event is payment_intent.succeded
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                console.log(paymentIntent)
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