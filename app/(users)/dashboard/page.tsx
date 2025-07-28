"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Chart } from "@/app/components/users/Chart";
import { SectionCards } from "@/app/components/users/SectionCards";
import ChatBotContainer from "@/app/components/users/ChatBotContainer";

type ChartEntry = {
  count: number;
  totalRisk: number;
};

type GroupedResult = {
  [key: string]: ChartEntry;
};

export default function Dashboard() {
    const [summary, setSummary] = useState([])
    const [chartData, setChartData] = useState<ChartEntry[]>([])
    const [timeRange, setTimeRange] = useState('30d')
    const router = useRouter()

    console.log(summary)
    console.log(chartData)

    const[ isChatOpen, setIsChatOpen ] =  useState(false);

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch('/api/user')
            const result = await response.json()

            if(!result.user) {
                router.push('/login');
            }

            
        }
        getUser()
    }, [])

    useEffect(() => {
        const getTransactions = async () => {
            const response = await fetch(`/api/transactions?page=dashboard&range=${timeRange}`)
            const result: GroupedResult = await response.json()
            const chartData = Object.entries(result as GroupedResult).map(([day, { count, totalRisk }]) => ({date: day, count, totalRisk })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setChartData(chartData)
        }

        getTransactions()
    }, [timeRange])

     useEffect(() => {
        const getSummary = async () => {
            const res = await fetch('/api/transactions?summary=true');
            const result = await res.json();
            setSummary(result);
        }

        getSummary()
    }, [])

    

    const handleRangeChange = (range: string) => {
        setTimeRange(range)
        console.log(timeRange)
    }

    const handleClick = () => {
        setIsChatOpen(!isChatOpen)
    }

    return (
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards summary={summary} />
                <div className="px-4 lg:px-6">
                    <Chart timeRange={timeRange} onRangeChange={handleRangeChange} chartData={chartData} />
                </div>
                
            </div>
        </div>
        <ChatBotContainer 
            isChatOpen={isChatOpen} 
            onChatClick={handleClick}>
        </ChatBotContainer>
    </div>
    )
}