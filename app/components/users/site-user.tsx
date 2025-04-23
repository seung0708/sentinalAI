"use client"

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"



export function SiteUser() {
    const { isMobile } = useSidebar()
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/signOut', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            })

            router.push('/')

        } catch (error) {
            console.error(error)
        }
    }

  return (
    <DropdownMenu>
          <DropdownMenuTrigger asChild >
            <Button
              variant="link"
              className="w-0 h-0 no-underline hover:no-underline cursor-pointer"
            >
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src='' alt='' />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "right" : "bottom"}
            align="end"
            sideOffset={13}
          >
            <DropdownMenuGroup>
              <Link href='/settings'>
                <DropdownMenuItem>
                  <UserCircleIcon />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )
}
