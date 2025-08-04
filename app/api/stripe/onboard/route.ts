import { createClient } from "@/utils/supabase/server";
import { getStripe } from "../../lib/stripe";

import { NextResponse } from "next/server";

export async function POST() {
    let accountId;
    const supabase = await createClient();
    const stripe = getStripe()
    const {data: {user}, error} = await supabase.auth.getUser();

    if (error) console.error(error)

    const {data: connectedAccount, error: accountIdError} = await supabase.from("connected_accounts").select("*").eq("user_id", user?.id).single();
    accountId = connectedAccount?.account_id; 

    if (accountIdError) console.error(accountIdError)

    try {
        

        if (!accountId) {
            const account = await stripe?.accounts.create({
                type: 'standard'
            });
            accountId = account?.id

            const {error} = await supabase.from("connected_accounts").insert({
                user_id: user?.id, 
                provider: "stripe", 
                account_id: accountId
            })

            if (error) console.error(error)

        }

        const accountLink = await stripe?.accountLinks.create({
            account: accountId, 
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations`, 
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations`,
            type: "account_onboarding"
        })

        return NextResponse.json({
            accountLink
        })


    } catch(error) {
        console.error(error)
        return NextResponse.json({
            status: 400, 
            message: "Error occured when onboarding"
        })
    }
}