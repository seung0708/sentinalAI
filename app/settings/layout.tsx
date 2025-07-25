import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "../components/settings/sidebar-nav"

import Link from 'next/link'

const sidebarNavItems = [
  {
    title: "Account",
    href: "/settings",
  },
  {
    title: "Integrations", 
    href: "/settings/integrations"
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  {
    title: "Team Members", 
    href: "/settings/members"
  },
  {
    title: "Security",
    href: "/settings/security",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) { 
    return (
      <>
        <div className="space-y-6 p-10 pb-16 ">
          <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
            <Link href="/dashboard" className="text-sm text-muted-foreground ">Home</Link>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-5 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </>
    )
}