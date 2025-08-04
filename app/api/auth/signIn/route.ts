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
        if(dbError?.status === 400){
            if (dbError.code === 'email_not_confirmed') {
                const { error: userError} = await supabase.from('users').select().eq('email', email).single();
                if(userError){
                    return NextResponse.json({
                        error: "User account not found. Please sign up.",
                        status: 400
                    })
                } else {
                    return NextResponse.json({
                        error: "Email not confirmed. Please check your email for the confirmation link.",
                        status: 400
                    })
                }
            } else {
                return NextResponse.json({
                    error: "Incorrect email or password",
                    status: 400
                })
            }
            
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