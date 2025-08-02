import { createClient } from "@/utils/supabase/server";
import { getStripe } from "../../lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
    console.log('Getting request')
    const supabase = await createClient(); 
    const stripe = getStripe()
    const {data: {user}, error: userError} = await supabase.auth.getUser(); 
    console.log('user error api/stripe/status', userError)

    if (!user) {
        return NextResponse.json({
            error: 'Unauthorized', 
            status: 401
        })
    }

    const {data: account, error: accountError} = await supabase.from("connected_accounts").select("account_id").eq("user_id", user.id).single();

    if (accountError || !account?.account_id) {
        return NextResponse.json({ error: 'Stripe account not found' }, { status: 404 });
    }

    try {
        const stripeAccount = await stripe?.accounts.retrieve(account.account_id);

        if (stripeAccount?.charges_enabled && stripeAccount?.payouts_enabled) {
            return NextResponse.json({message: 'connected', status: 200})
        } else {
            return NextResponse.json({message: 'incomplete', status: 200})
        }
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to retrieve Stripe account' }, { status: 500 });
    }
    
}