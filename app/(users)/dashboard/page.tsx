import { AppSidebar } from "@/app/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
    return (
        <SidebarProvider>
            <AppSidebar />
        </SidebarProvider>
    )
}