
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const Hero = () => {
  return (
    <section className="w-full min-h-[calc(100vh-4rem)] px-4 flex items-center justify-start text-center">
      <div className="bg-[#112d2b]/60 rounded-xl shadow-lg p-6 sm:p-8 md:p-12 lg:p-20 max-w-screen-2xl w-full mx-auto flex flex-col justify-center items-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight leading-tight">
          Detect fraud in real-time
          <br />
          Protect transactions with AI
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-200/90 max-w-3xl">
          Seamlessly detect fraud and approve legitimate transactions faster with AI-driven risk scoring — reducing fraud and enhancing security.
        </p>
        <Button className="h-12 md:h-14 px-8 text-lg rounded-full transition-all hover:scale-105" variant="outline">
          <Link href="/signup" className="flex items-center gap-2">
            Get Started <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default Hero