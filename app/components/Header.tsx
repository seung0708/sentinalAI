
import { Navbar1 } from "./Navbar"


const Header = ({allAccess}) => {
  return (
    <header className="py-2 flex justify-between items-center">
      <Navbar1 allAccess={allAccess} />
    </header>
  )
}

export default Header