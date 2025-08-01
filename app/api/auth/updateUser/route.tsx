import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const supabase = await createClient();

    try {

        const body = await req.json();

        const {email, password } = body;

        const { data: updateUserData, error: updateUserError } = await supabase.auth.updateUser({
            email: email,
            password: password
        })

        console.log("Update user data:", updateUserData)

        if(updateUserError){
            return NextResponse.json({
                error: updateUserError.code,
                message: updateUserError.message,
                status: 400
            })
        }

        return NextResponse.json({message: "Account Updated", status: 200})

    } catch (error) {

        console.error(error)
        return NextResponse.json({err: "Server error", message: "Failed to update user"},
            {
                status: 500,
                headers: {'Content-type': 'application/json'}
            }
        )
    }
}