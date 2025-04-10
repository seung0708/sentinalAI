import { Button } from "@/components/ui/button"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="mt-2 w-full h-210 mx-auto flex items-center justify-center text-center">
        <div className="w-[1256px] h-[440px] bg-[#112d2b] bg-opacity-60 rounded-xl shadow-lg flex flex-col justify-center items-center sm:px-18 md:px-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">Detect fraud in real-time.<br /> Protect transactions with AI.</h1>
            <p className="mb-6 sm:text-18 md:text-20 lg:text-24">Seamslessly detect fraud and approves legitimate transactions faster with AI-driven risk scoring reducing and enhancing security.</p>
            <Button className="sm:w-[144px] sm:h-[44px] md:w-[256px] md:h-[56px] rounded-4xl" variant='outline'>
              <Link href="/signup">Get Started</Link>
              </Button>
        </div>     
    </section>
  )
}

export default Hero