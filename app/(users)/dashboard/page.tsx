import { Chart } from "@/app/components/users/Chart";
import { DataTable } from "@/app/components/users/DataTable";
import { SectionCards } from "@/app/components/users/SectionCards";
import { AppSidebar } from "@/app/components/users/Sidebar";
import {SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from './data.json'
import { SiteHeader } from "@/app/components/users/site-header";

export default function Dashboard() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards />
                            <div className="px-4 lg:px-6">
                                <Chart />
                            </div>
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}