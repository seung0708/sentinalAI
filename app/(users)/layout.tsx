import { AppSidebar } from "@/app/components/users/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { SiteHeader } from "@/app/components/users/site-header";

export default function UserLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="relative flex min-h-screen">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 overflow-hidden px-2">
                    <SiteHeader />
                    {children}
                </div>
            </SidebarProvider>
        </div>
    )
}