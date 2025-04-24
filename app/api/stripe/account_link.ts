import { stripe } from "../lib/stripe";

import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest, res: NextResponse) {
    try {
        const {account} = req.body;

        const accountLink = await stripe.accounts
    }
}