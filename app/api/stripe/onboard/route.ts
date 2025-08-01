import { createClient } from "@/utils/supabase/server";
import { stripe } from "../../lib/stripe";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    let accountId;
    const supabase = await createClient();
    const {data: {user}, error} = await supabase.auth.getUser();

    const {data: connectedAccount, error: accountIdError} = await supabase.from("connected_accounts").select("*").eq("user_id", user?.id).single();
    accountId = connectedAccount?.account_id; 

    try {
        

        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'standard'
            });
            accountId = account.id

            const {error} = await supabase.from("connected_accounts").insert({
                user_id: user?.id, 
                provider: "stripe", 
                account_id: accountId
            })

        }

        console.log('accountId', accountId)

        const accountLink = await stripe.accountLinks.create({
            account: accountId, 
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations`, 
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations`,
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