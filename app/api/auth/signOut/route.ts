import { createClient } from '@/utils/supabase/server';
import {Database} from '@/app/api/types/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async  function POST(req: NextRequest){
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

        return NextResponse.json({error: "Server error"}, {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }
}