import { createClient } from "@/utils/supabase/server";
import { stripe } from "../../lib/stripe";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log('hitting post request')
    try {

        const account = await stripe.accounts.create({
            type: 'standard'
        });

        const accountLink = await stripe.accountLinks.create({
            account: account.id, 
            refresh_url: 'http://localhost:3000/settings/integrations', 
            return_url: 'http://localhost:3000/settings/integrations',
            type: "account_onboarding"
        })

        console.log(accountLink)

        return NextResponse.json({
            accountLink
        })


    } catch(error) {
        return NextResponse.json({
            status: 400, 
            message: "Error occured when onboarding"
        })
    }
}