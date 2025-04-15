import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href='/'>
        <Image 
            className='rounded-xl'
            src="logo.svg"
            width={32}
            height={32}
            alt="logo"
        />
    </Link>     
  )
}
