'use client'
import {useState, useEffect} from 'react'
import { DataTable } from "@/app/components/users/transactions/datatable/DataTable";


export default function Transactions() {
    const [transactions, setTransactions] = useState([]) 
    useEffect(() => {
        const fetchTransactions = async () => {
            const res = await fetch('http://localhost:3000/api/transactions?page=transactions', {
                cache: 'no-store',
                credentials: 'include'
            });
            const data = await res.json();
            setTransactions(data)
        }
        fetchTransactions()
    },[])
    return (
        <div className='h-full'>
            <DataTable data={transactions} />
        </div>
    )
}