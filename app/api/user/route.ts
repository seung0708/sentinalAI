import { createClient } from '@/utils/supabase/server';
import {Database} from '@/app/api/types/supabase'
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: Request){
    const supabase = await createClient();
    const { data: {user}} = await supabase.auth.getUser();
    let response;

    if (user) {
        response = NextResponse.json({
            user,
            status: 200
        });
    } else {
        redirect('/')
    }
    
    if(!user) {
        response = NextResponse.json({
            status: 400, 
            error: 'No user found'
        })
    }

    return response; 
   
}