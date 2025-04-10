import {supabase} from '@/app/api/lib/supabaseClient'
import {Database} from '@/app/api/types/supabase'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
    
    try{
        const body = await req.json();
    
        const {name, email, password} = body;
    
        const {data: authData, error: dbError} = await supabase.auth.signUp({
            email: email,
            password: password
        });
    
        type Newuser = Database['public']['Tables']['users']["Insert"] & {auth_id: string}
    
        const newUser: Newuser = {
            name:name,
            email:email,
            auth_id: authData.user?.id ?? '' // optional chaining - checks if authData.user.id is not null if valid then acces it. if invalid then set empty string
        }
    
        const {data, error } = await supabase.from('users').insert(newUser);
    
        if(error){
            return NextResponse.json({error: "Could not sign up user"}, {
                status:500,
                headers: {'Content-Type': 'application/json'}
            });
        }
        
        return NextResponse.json({message: "Sing Up Succesful"})

    } catch(error){
        return NextResponse.json({error: "Server error"}, {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }
}