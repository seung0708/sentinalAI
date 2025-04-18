import {createClient} from '@/utils/supabase/server'
import {Database} from '@/app/api/types/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest){
    console.log('Signing in post')
    const supabase = await createClient();
    try{
        const body = await req.json();
        const {email, password} = body;

        const {data: authData, error: dbError} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        console.log(authData, dbError)
        if(dbError){
            return NextResponse.json({dbError: "Incorrect email or password"},{
                status: 400,
                headers: {'Content-Type':'application/json'}
            })
        }

        return NextResponse.json({message: "Signed In Succesfully"},{
            status: 200,
            headers: {'Content-type':'application/json'}
        })

    }catch(error){
        return NextResponse.json({error: "Server error"},{
            status:500
        })
    }

}