import { AppSidebar } from "@/app/components/users/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
    return (
        <SidebarProvider>
            <AppSidebar />
        </SidebarProvider>
    )
}