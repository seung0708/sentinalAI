
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

type GroupedData = {
  [key: string]: {
    low: number;
    med: number;
    high: number;
  }
};

type RiskLevel = 'low' | 'medium' | 'high';

const getStartDateFromRange = (range: string) => {    
    return new Date(Date.now() - Number(range.replace('d','')) * 24 * 60 * 60 * 1000)
}

export async function GET(request: Request){
    const {searchParams} = new URL(request.url)
    const page = searchParams.get('page')
    const range = searchParams.get('range')
    const summary = searchParams.get('summary')
    
    const supabase = await createClient()
    const {data: {user}, error: fechUserError} = await supabase.auth.getUser()
    if(!user) redirect('/signin') 
    if (fechUserError) console.error(fechUserError)
    const {data: connectedAccount, error: fetchConnectAccError} = await supabase.from('connected_accounts').select('account_id').eq('user_id', user?.id).single()

    if (!connectedAccount && fetchConnectAccError) {
        if (fetchConnectAccError.code === 'PGRST116') console.log('no stripe account_id connected yet to this user so continuing with logic')
        else console.error(fetchConnectAccError)    
    }

    if (page === 'transactions') {
        try {
            const {data, error: fetchTransactionsError} = await supabase.from('transactions')
            .select(`
                id, stripe_id, customer_id, status, timestamp, amount, currency, billing_email, 
                billing_name, billing_phone, billing_line1, billing_city, billing_state, 
                billing_postal_code, payment_method, predicted_risk`
            )
            .eq('account_id', connectedAccount?.account_id)

            if (data?.length === 0 && !fetchTransactionsError) console.log('customer doesnt have transactions yet')
            else console.error(fetchTransactionsError)
         
            return NextResponse.json(data)
        } catch(error) {
            console.error('Error: ', error)
        }
    }

    if (page === 'dashboard') {
        const startDate = getStartDateFromRange(range as string)
        try {

            //Bar chart
            const {data: timestampRisks, error: fetchRisksError} = await supabase.from('transactions').select('timestamp, predicted_risk', {count: 'exact'}).eq('account_id', connectedAccount?.account_id).gte('timestamp', startDate.toISOString())
            
            if (fetchRisksError?.code === 'PGRST202') console.log('customer doesnt have a account_id yet')
            
            const grouped = timestampRisks?.reduce((acc: GroupedData, tx) => {
                const day = new Date(tx.timestamp).toISOString().slice(0, 10); // 'YYYY-MM-DD'
                if (!acc[day]) acc[day] = { low:0, med: 0 , high: 0};
                if (tx.predicted_risk === 'low') acc[day].low += 1;
                else if (tx.predicted_risk === 'medium') acc[day].med += 1;
                else if (tx.predicted_risk === 'high') acc[day].high += 1;
                return acc;
            }, {});

            //Summary cards
            const {data: risks, error: fetchTransactionsError} = await supabase.from('transactions').select('predicted_risk').eq('account_id', connectedAccount?.account_id)
            console.error('fetchTransactionsError', fetchTransactionsError)

            const total = risks?.length
            const riskCounts = risks?.reduce((acc: Record<RiskLevel, number>, tx) => {
                const risk = tx.predicted_risk as RiskLevel;
                acc[risk] += 1;
                return acc;
            }, { low: 0, medium: 0, high: 0 });
            
            const summary = {
                total, 
                low: riskCounts?.low, 
                med: riskCounts?.medium, 
                high: riskCounts?.high
            }

            //Customer
            const {data: top5RiskyCustomers, error: topRiskyCustomersError} = await supabase.rpc('get_top_5_risky_customers', {
                'p_account_id': connectedAccount?.account_id
            })

            if (topRiskyCustomersError) {
                console.error('Error fetching risky customers: ', topRiskyCustomersError)
            }

           
        
            return NextResponse.json({grouped, summary, top5RiskyCustomers})
        } catch (err) {
            console.error(err)
        }
    }

    if (summary === 'true') {
        try {
            return NextResponse.json(summary)
        } catch(error) {
            console.error('Error getting transactions', error)
        }

    }

    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })

}