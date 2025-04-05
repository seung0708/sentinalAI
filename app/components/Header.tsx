import { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

import Link from "next/link";

const Header = () => {
  return (
    <header className="py-2 flex justify-between items-center">
      <Logo />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href='#about'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='#solutions'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Solutions
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='#analytics'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Analytics
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex gap-2">
        <Button variant="outline">
          <Link href='/login'>Login</Link>
        </Button>
        <Button variant="outline">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </header>
  )
}

export default Header