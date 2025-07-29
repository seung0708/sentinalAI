"use client";

import { useEffect, useState } from "react";

import { MultipleBarChart } from "@/app/components/users/dashboard/MultipleBarChart";
import { DataTable as Top5RiskyCustomersTable } from "@/app/components/users/dashboard/Top5RiskyCustomers";
import { SectionCards } from "@/app/components/users/dashboard/SectionCards";


export type ChartEntry = {
  low: number;
  med: number;
  high: number;
};

type GroupedResult = {
  [key: string]: ChartEntry;
};

export type Top5RiskyCustomers = {
    customer_id: string 
    amount: number
    billing_name: string
    billing_email: string 
    billing_phone: string
    billing_line1: string 
    billing_city: string 
    billing_state: string 
    billing_postal_code: string
    predicted_risk: string
}

export default function Dashboard() {
    const [summary, setSummary] = useState({})
    const [chartData, setChartData] = useState<ChartEntry[]>([])
    const [topRisky, setTopRisky] = useState<Top5RiskyCustomers[]>([])
    const [timeRange, setTimeRange] = useState('7d')
    
    useEffect(() => {
        const getSummaries = async () => {
            const response = await fetch(`/api/transactions?page=dashboard&range=${timeRange}`)
            const result = await response.json()
            const chartData = Object.entries(result.grouped as GroupedResult).map(([day, { low, med, high }]) => ({date: day, low, med, high })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setChartData(chartData)
            setSummary(result.summary)
            setTopRisky(result.top5RiskyCustomers)
        }

        getSummaries()
    }, [timeRange])    

    const handleRangeChange = (range: string) => {
        setTimeRange(range)
        console.log(timeRange)
    }

    return (
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards summary={summary} />
                <div className="px-4 lg:px-6">
                    <MultipleBarChart timeRange={timeRange} onRangeChange={handleRangeChange} chartData={chartData} />
                </div>
                <div className="px-4 lg:px-6">
                    <Top5RiskyCustomersTable data={topRisky} />
                </div>
            </div>
        </div>
      
    </div>
    )
}