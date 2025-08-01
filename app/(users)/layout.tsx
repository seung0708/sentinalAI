"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/app/components/users/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/app/components/users/site-header";
import ChatBotContainer from "@/app/components/users/ChatBotContainer";

export default function UserLayout({children}: {children: React.ReactNode}) {
    const router = useRouter()
    const[ isChatOpen, setIsChatOpen ] =  useState(false);
    const [connectedAccount, setConnectedAccount] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch('/api/user')
            const result = await response.json()
            if(!result.user) {
                router.replace('/login');
            }               
            setConnectedAccount(result.connectedAccount.account_id)
        }
        getUser()
    }, [router])

    const handleClick = () => {
        setIsChatOpen(!isChatOpen)
    }

    return (
        <div className="relative flex min-h-screen">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 overflow-hidden px-2">
                    <SiteHeader />
                    {children}
                </div>
            </SidebarProvider>
            <ChatBotContainer 
                isChatOpen={isChatOpen}
                connectedAccount={connectedAccount}
                onChatClick={handleClick}>
            </ChatBotContainer>
        </div>
    )
}