import { stripe } from "../lib/stripe";
import { generatePaymentIntents } from "../lib/test-transactions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse){
    try {
        const body = await req.json()
        const {accountId, num} = body;

        if(!accountId || !num){
            return NextResponse.json({ error: "Missing parameters"}, {status: 400})
        }

        const paymentIntents = await generatePaymentIntents(accountId, num)

        return NextResponse.json({ paymentIntents })
    } catch (err){
        console.error("Failed to generate test transactions:", err)
        return NextResponse.json({error: 'Internal Error'}, {status: 500})
    }
}