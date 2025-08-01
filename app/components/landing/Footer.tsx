import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const sections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

const Footer = () => {
    return (
      <footer className="mt-24 bg-[#112d2b]/60 rounded-t-xl">
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col items-center justify-between gap-8 sm:gap-12 lg:gap-16 lg:flex-row lg:items-center lg:justify-between">
            <div className="sm:w-auto flex flex-col items-center gap-6 sm:gap-8">
              <Link href="/" className="inline-block">
                <Image
                  src='/logo.svg'
                  alt='SentinelAI logo'
                  className="h-8 w-auto"
                  width={100}
                  height={100}
                  priority
                />
              </Link>
              <ul className="flex items-center space-x-6">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="size-5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="size-5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="size-5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="size-5" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 w-full max-w-xs xs:max-w-none lg:mr-10">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="text-center lg:text-left">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">{section.title}</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href={link.href}
                          className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm sm:text-base text-gray-400 text-center sm:text-left">2025 SentinelAI. All rights reserved.</p>
            <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    )
}

export default Footer;