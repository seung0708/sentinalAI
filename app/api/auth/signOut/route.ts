import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server'

export async  function POST(){
    const supabase = await createClient();
    try{

        const {error} = await supabase.auth.signOut();

        if(error){
            return NextResponse.json({error: "Could not sign out"}, {
                status: 400,
                headers: {'Content-Type': 'application/json'}
            })
        }

        return NextResponse.json({message: "Signed Out succesfully"},{
                status: 200,
                headers: {'Content-Type': 'application/json'}
            }
        )

    } catch(error){
        console.error(error)
        return NextResponse.json({err: "Server error"}, {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }
}