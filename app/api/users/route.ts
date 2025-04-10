import {supabase} from '@/app/api/lib/supabaseClient'
import {Database} from '@/app/api/types/supabase'

export async function GET(request: Request){
    const {data,error} = await supabase.from('users').select();
    
    return new Response(JSON.stringify(data),{
        status:200,
        headers: { "Content-Type": "application/json"}
    });
}