import Link from "next/link"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="py-2 flex justify-between items-center">
        <Logo />
        <nav>
            <ul className="flex gap-10">
                <li>
                  <Link href='#about'>About</Link>
                </li>
                <li>
                  <Link href='#solutions'>Solutions</Link>
                </li>
                <li>
                  <Link href='#analytics'>Analytics</Link>
                </li>
            </ul>
        </nav>
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