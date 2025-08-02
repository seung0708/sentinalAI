import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(){
    const supabase = await createClient();
    const { data: {user}} = await supabase.auth.getUser();
    if(!user) {
        return NextResponse.json({
            status: 400, 
            error: 'No user found'
        })
    }

    const {data: connectedAccount, error: fetchConnectAccError} = await supabase.from('connected_accounts').select('account_id').eq('user_id', user?.id).single()
    if(fetchConnectAccError?.code === 'PGRST116') {
        console.log('user isnt connected to stripe')
    } else {
        console.error(fetchConnectAccError)
    }

    console.log('connected account', connectedAccount)

    if (!connectedAccount) {
        return NextResponse.json({
            user,
            status: 200
        }); 
    } else {
        return NextResponse.json({
        user,
        connectedAccount,
        status: 200
    }); 
    }
}