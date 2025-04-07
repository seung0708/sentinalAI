import { Button } from "@/components/ui/button"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="mt-2 w-full h-210 mx-auto flex items-center justify-center text-center">
        <div className="w-[1256px] h-[440px] bg-[#112d2b] bg-opacity-60 rounded-xl shadow-lg flex flex-col justify-center items-center">
            <h1 className="text-5xl font-semibold mb-6">Detect fraud in real-time.<br /> Protect transactions with AI.</h1>
            <p className="mb-6">Seamslessly detect fraud and approves legitimate transactions faster with AI-driven risk scoring reducing and enhancing security.</p>
            <Button className="w-[256px] h-[56px] rounded-4xl" variant='outline'>
              <Link href="/pricing">Get Started</Link>
              </Button>
        </div>     
    </section>
  )
}

export default Hero