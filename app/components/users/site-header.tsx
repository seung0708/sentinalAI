import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SiteUser } from "./site-user"

export function SiteHeader() {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full justify-between items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-6" />
        <SiteUser />
      </div>
    </header>
  )
}
