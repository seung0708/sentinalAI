import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe'
import {stripe} from '@/app/api/lib/stripe'

export async function POST(req: NextRequest){

    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature') as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
    }catch (error){
        console.error("Webhook signature verification failed", error)
        return NextResponse.json({message:"Webhook error"},{
            status: 400,
            headers: {'Content-Type':'application/json'}
        })
    }

    // handle Stripe Event

    switch(event.type){
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object
            console.log('Payment Intent was succesful', paymentIntent)
            break

        // adding more cases - need to 
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({received: true, message:"Success"})
}