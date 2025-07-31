import { createClient } from '@/utils/supabase/server';
import {Database} from '@/app/api/types/supabase'
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request){
    const supabase = await createClient();
    const { data: {user}} = await supabase.auth.getUser();
    if(!user) {
        return NextResponse.json({
            status: 400, 
            error: 'No user found'
        })
    }

    const {data: connectedAccount, error: fetchConnectAccError} = await supabase.from('connected_accounts').select('account_id').eq('user_id', user?.id).single()
    
    return NextResponse.json({
        user,
        connectedAccount,
        status: 200
    }); 
   
}