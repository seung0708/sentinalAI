import {createClient} from '@/utils/supabase/server'
import {Database} from '@/app/api/types/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse){
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

        return NextResponse.json({
            status: 200
        })

    }catch(error){
        return NextResponse.json({error: "Server error"},{
            status:500
        })
    }

}