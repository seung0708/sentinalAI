import { createClient } from '@/utils/supabase/server';
import {Database} from '@/app/api/types/supabase'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){

    try{
        const supabase = await createClient();

        const body = await req.json();
    
        const {company, email, password} = body;

        console.log(company, email, password);
    
        const {data: authData, error: dbError} = await supabase.auth.signUp({
            email: email,
            password: password
        });
        if (dbError){
            return NextResponse.json(
                {error: "Auth sign up failed", details: dbError.message},
                {status: 400}
            )
        }
    
        type Newuser = Database['public']['Tables']['users']["Insert"] & {auth_id: string}
    
        const newUser: Newuser = {
            company: company,
            email:email,
            auth_id: authData.user?.id ?? '' // optional chaining - checks if authData.user.id is not null if valid then acces it. if invalid then set empty string
        }
    
        const {error } = await supabase.from('users').insert(newUser);
    
        if(error){
            console.error(error)
            return NextResponse.json({err: "Could not sign up user"}, {
                status:500,
                headers: {'Content-Type': 'application/json'}
            });
        }
        
        return NextResponse.json({message: "Sign Up Succesful", status: 200})

    } catch(error){
        console.error(error)
        return NextResponse.json({err: "Server error", message:"Failed to reach server"}, {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }
}