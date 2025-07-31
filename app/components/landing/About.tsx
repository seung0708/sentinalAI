import Image from "next/image"

const About = () => {
  return (
    <section id="about" className="mt-12 w-full scroll-mt-24">
      <h2 className="mb-8 lg:mb-4 text-3xl md:text-4xl lg:text-5xl text-center font-semibold tracking-tight">
        About Us
      </h2>
      <div className="container mx-auto lg:py-4">
        <div className="px-4 flex flex-col xl:flex-row justify-center items-center ">
          <div className="">
            <div className="relative aspect-[4/5] md:aspect-[5/4] lg:aspect-[3/2] w-full min-h-[500px]">
              <Image 
                src="/fake.png"
                fill
                className="object-contain object-top"
                alt="about us image"
                priority
              />
            </div>
          </div>
          <div className="w-full -mt-48 md:mt-0 space-y-6">
            <div className="space-y-4 text-gray-200/90">
              <p className="text-center text-base md:text-xl lg:text-2xl">
                Our AI-powered fraud detection platform helps fintech companies identify and prevent fraudulent transactions in real time.
              </p>
              <p className="text-center text-base md:text-xl lg:text-2xl">
                Using advanced machine learning, real-time analytics, and behavioral risk scoring, we empower businesses to minimize losses, reduce chargebacks, and enhance transaction security—all while maintaining a seamless user experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About