import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';





export async function GET(request: Request){
    const supabase = await createClient()
    const {data: {user}, error: fechUserError} = await supabase.auth.getUser()
    if(!user) redirect('/signin')
    //console.log('fetch user error: ', fechUserError) 
    const {data: connectedAccount, error: fetchConnectAccError} = await supabase.from('connected_accounts').select('account_id').eq('user_id', user?.id).single()

    try {
        const {data: timestampRisks, error: fetchRisksError} = await supabase.from('transactions').select('timestamp, predicted_risk', {count: 'exact'}).eq('account_id', connectedAccount?.account_id)

        return NextResponse.json(timestampRisks)

    } catch(error) {
        console.error(error)
    }

}