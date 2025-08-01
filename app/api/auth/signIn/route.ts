import {createClient} from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
    const supabase = await createClient();
    try{
        const body = await req.json();
        const {email, password} = body;

        const {data: authData, error: dbError} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if(dbError){
            return NextResponse.json({
                dbError: "Incorrect email or password",
                status: 400
            })
        }

        if(authData){
            return NextResponse.json({
                status: 200
            })
        }

    }catch(error){
        console.error(error)
        return NextResponse.json({err: "Server error"},{
            status:500
        })
    }

}