"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex flex-wrap lg:flex-col lg:space-x-16 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href ? "text-black bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline", "justify-start"
            )
        }
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}