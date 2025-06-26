import { createPaymentIntent } from "./test-transactions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse){
    try {
        const body = await req.json()
        const {accountId} = body;

        if(!accountId){
            return NextResponse.json({ error: "Missing parameters"}, {status: 400})
        }

        const paymentIntent = await createPaymentIntent(accountId)
        return NextResponse.json({ success: true, id: paymentIntent?.id });
    } catch (err){
        console.error("Failed to generate test transactions:", err)
        return NextResponse.json({error: 'Internal Error'}, {status: 500})
    }
}