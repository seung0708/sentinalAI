import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="p-2 flex justify-between items-center">
        <Logo />
        <nav>
            <ul className="flex gap-10">
                <li>About</li>
                <li>Solutions</li>
                <li>Analytics</li>
            </ul>
        </nav>
        <div>
            <Button className="" variant="outline">Login</Button>

            <Button variant="outline">Sign Up</Button>
        </div>
    </header>
  )
}

export default Header