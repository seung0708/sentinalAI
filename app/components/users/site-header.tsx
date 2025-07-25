"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SiteUser } from "./site-user"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link";

export function SiteHeader() {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter(Boolean);
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex justify-between items-center h-12 shrink-0 gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-6" />
        <Breadcrumb>
          <BreadcrumbList>
            {pathnames.map((name, index) => {
              const routeTo = '/' + pathnames.slice(0, index + 1).join('/')
              const isLast = index === pathnames.length - 1
      
              return (
                <BreadcrumbItem key={name}>
                  
                  {isLast ? (
                    <span className="">
                      {decodeURIComponent(name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, ' ')}
                    </span>
                  ) : (
                    <>
                    <BreadcrumbSeparator />
                    <BreadcrumbLink asChild>
                      <Link href={routeTo}>
                        {decodeURIComponent(name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, ' ')}
                      </Link>
                    </BreadcrumbLink>
                    </>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <SiteUser />
    </header>
  )
}
