import { createClient } from "@/utils/supabase/server";
import { getStripe } from "../../lib/stripe";

import { NextResponse } from "next/server";

export async function POST() {
    let accountId;
    const supabase = await createClient();
    const stripe = getStripe()
    const {data: {user}, error} = await supabase.auth.getUser();

    console.log('user error', error)

    const {data: connectedAccount, error: accountIdError} = await supabase.from("connected_accounts").select("*").eq("user_id", user?.id).single();
    accountId = connectedAccount?.account_id; 

    console.log('accountIdError', accountIdError)

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

            console.log('insert error', error)

        }

        console.log('accountId', accountId)

        const accountLink = await stripe?.accountLinks.create({
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
        console.error(error)
        return NextResponse.json({
            status: 400, 
            message: "Error occured when onboarding"
        })
    }
}