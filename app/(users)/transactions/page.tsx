'use client'
import {useState, useEffect} from 'react'
import { DataTable } from "@/app/components/users/datatable/DataTable";


export default function Transactions() {
    const [transactions, setTransactions] = useState([]) 
    useEffect(() => {
        const fetchTransactions = async () => {
            const res = await fetch('http://localhost:3000/api/transactions', {
                cache: 'no-store',
                credentials: 'include'
            });
            const data = await res.json();
            setTransactions(data.transactions)
        }
        fetchTransactions()
    },[])
    return <DataTable data={transactions} />
}