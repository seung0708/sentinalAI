import { createClient } from '@/utils/supabase/server';
import {Database} from '@/app/api/types/supabase'
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request){
    const supabase = await createClient()
    const {data: {user}, error: fechUserError} = await supabase.auth.getUser()
    if(!user) redirect('/signin')
    console.log('user', user)
    console.log('fetch user error: ', fechUserError) 
    const {data: connectedAccount, error: fetchConnectAccError} = await supabase.from('connected_accounts').select('account_id').eq('user_id', user?.id).single()
    console.log('connected account: ', connectedAccount)
    console.log('connected_account')
    const {data: transactions, error: fetchTransactionsError} = await supabase.from('transactions').select('id, stripe_id, customer_id, status, timestamp, amount, currency, billing_email, billing_name, billing_phone, billing_line1, billing_city, billing_state, billing_postal_code, payment_method, predicted_risk').eq('account_id', connectedAccount?.account_id)

    console.log('transactions: ', transactions )
    console.log('fetch transactions error: ', fetchTransactionsError)

    if (fetchTransactionsError) console.error(fechUserError) 
    
    return NextResponse.json({transactions})
}