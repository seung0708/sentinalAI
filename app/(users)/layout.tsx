import { AppSidebar } from "@/app/components/users/Sidebar";
import {SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { SiteHeader } from "@/app/components/users/site-header";

export default function UserLayout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <main>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SiteHeader />
                    {children}
                </SidebarInset>
            </SidebarProvider>
            </main>
        </div>
    )
}