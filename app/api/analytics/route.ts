import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(){
    const supabase = await createClient()
    const {data: {user}, error: fechUserError} = await supabase.auth.getUser()
    if(!user) redirect('/signin')

    if(fechUserError) {
        console.error(fechUserError)
    }
        
    const {data: connectedAccount, error: fetchConnectAccError} = await supabase.from('connected_accounts').select('account_id').eq('user_id', user?.id).single()

    if(fetchConnectAccError) {
        console.error(fetchConnectAccError)
    }

    try {
        const {data: timestampRisks, error: fetchRisksError} = await supabase.from('transactions').select('timestamp, predicted_risk', {count: 'exact'}).eq('account_id', connectedAccount?.account_id)

        if(fetchRisksError) {
            console.error(fetchRisksError)
        }

        return NextResponse.json(timestampRisks)

    } catch(error) {
        console.error(error)
    }

}