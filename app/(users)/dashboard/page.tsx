"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Chart } from "@/app/components/users/Chart";
import { DataTable } from "@/app/components/users/DataTable";
import { SectionCards } from "@/app/components/users/SectionCards";
import { AppSidebar } from "@/app/components/users/Sidebar";
import { SiteHeader } from "@/app/components/users/site-header";
import BottomNav from "@/app/components/users/BottomChatBanner";
import ChatBotContainer from "@/app/components/users/ChatBotContainer";


export default function Dashboard() {
    const router = useRouter()

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

    const handleClick = () => {
        setIsChatOpen(!isChatOpen)
    }

    return (
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                    <Chart />
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