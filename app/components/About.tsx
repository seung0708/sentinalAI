import Image from "next/image"

const About = () => {
  return (
    <section id="about" className="flex justify-around items-center">
        <div className="hidden md:block">
            <Image 
             src="/fake.png"
             width={630}
             height={800}
             alt="picture of fake"
            />
        </div>
        <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-8">About Us</h2>
            <p className="max-w-3xl text-base sm:text-lg md:text-xl">
                Our AI-powered fraud detection platform helps fintech companies identify and prevent fraudulent transactions in real time. 
                <br />
                Using advanced machine learning, real-time analytics, and behavioral risk scoring, we empower businesses to minimize losses, reduce chargebacks, and enhance transaction security—all while maintaining a seamless user experience.
            </p>   
        </div>
    </section>
  )
}

export default About