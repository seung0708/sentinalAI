"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Chart } from "@/app/components/users/Chart";
import { DataTable } from "@/app/components/users/DataTable";
import { SectionCards } from "@/app/components/users/SectionCards";
import { AppSidebar } from "@/app/components/users/Sidebar";
import { SiteHeader } from "@/app/components/users/site-header";


export default function Dashboard() {
    const [transactions, setTransactions] = useState([])
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch('/api/user')
            const result = await response.json()

            if(!result.user) {
                router.push('/login');
            }

            const response2 = await fetch('/api/transactions')
            const result2 = await response2.json()
            setTransactions(result2.transactions)
        }
        getUser()
    }, [])

    return (
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards transactions={transactions} />
                <div className="px-4 lg:px-6">
                    <Chart />
                </div>
                
            </div>
        </div>
    </div>
    )
}