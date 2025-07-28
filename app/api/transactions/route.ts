
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

type GroupedData = {
  [key: string]: {
    count: number;
    totalRisk: number;
  }
};

const getStartDateFromRange = (range: string) => {
    const now = Date.now()
    
    return new Date(Number(range.replace('d','')) * 24 * 60 * 60 * 1000)

}

export async function GET(request: Request){
    const {searchParams} = new URL(request.url)
    const page = searchParams.get('page')
    const range = searchParams.get('range')
    const summary = searchParams.get('summary')
    
    const supabase = await createClient()
    const {data: {user}, error: fechUserError} = await supabase.auth.getUser()
    if(!user) redirect('/signin')
    //console.log('fetch user error: ', fechUserError) 
    const {data: connectedAccount, error: fetchConnectAccError} = await supabase.from('connected_accounts').select('account_id').eq('user_id', user?.id).single()

    if (page === 'transactions') {
        try {
            const {data, error: fetchTransactionsError} = await supabase.from('transactions')
            .select(`
                id, stripe_id, customer_id, status, timestamp, amount, currency, billing_email, 
                billing_name, billing_phone, billing_line1, billing_city, billing_state, 
                billing_postal_code, payment_method, predicted_risk`
            )
            .eq('account_id', connectedAccount?.account_id)
        
            if (fetchTransactionsError) {
                console.error(fechUserError) 
                return NextResponse.json({error: fetchTransactionsError})
            }
            
            return NextResponse.json(data)
        } catch(error) {
            console.error('Error: ', error)
        }
    }

    if (page === 'dashboard') {
        const startDate = getStartDateFromRange(range as string)
        try {
            const {data, error: fetchTransactionsError} = await supabase.from('transactions').select('timestamp, predicted_risk', {count: 'exact'}).eq('predicted_risk', 'high').eq('account_id', connectedAccount?.account_id).gte('timestamp', startDate.toISOString())
            
            const grouped = data?.reduce((acc: GroupedData, tx) => {
                const day = new Date(tx.timestamp).toISOString().slice(0, 10); // 'YYYY-MM-DD'
                if (!acc[day]) acc[day] = { count: 0, totalRisk: 0 };
                acc[day].count += 1;
                acc[day].totalRisk += 1
                return acc;
            }, {});
            return NextResponse.json(grouped)
        } catch (err) {
            console.error(err)
        }
    }

    if (summary === 'true') {
        try {
            const {data, error: fetchTransactionsError} = await supabase.from('transactions').select('*').eq('account_id', connectedAccount?.account_id)
            
            if (fetchTransactionsError) {
                console.error(fechUserError) 
                return NextResponse.json({error: fetchTransactionsError})
            }
            return NextResponse.json(data)
        } catch(error) {
            console.error('Error getting transactions', error)
        }

    }

    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })

}