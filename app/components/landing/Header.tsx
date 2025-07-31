
import { Navbar } from "./Navbar"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 py-2 w-full backdrop-blur-sm bg-background/80 border-b border-border/40">
      <Navbar />
    </header>
  )
}

export default Header