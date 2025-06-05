import { createClient } from "@/utils/supabase/server";
import { stripe } from "../../lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
    console.log('Getting request')
    const supabase = await createClient(); 
    const {data: {user}, error: userError} = await supabase.auth.getUser(); 

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
        const stripeAccount = await stripe.accounts.retrieve(account.account_id);
        
        return NextResponse.json({
            currently_due: stripeAccount.requirements?.currently_due, 
            past_due: stripeAccount.requirements?.past_due,
            disabled_reason: stripeAccount.requirements?.disabled_reason,
            charges_enabled: stripeAccount.charges_enabled,
            payouts_enabled: stripeAccount.payouts_enabled
        });

    } catch (err) {
        return NextResponse.json({ error: 'Failed to retrieve Stripe account' }, { status: 500 });
    }
}