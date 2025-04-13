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

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
}

const Footer = () => {
    return (
        <footer className="mt-10">
            <div className="flex flex-col items-start justify-between px-10 gap-10 text-center lg:flex-row lg:text-left">
              <div className="p-10 flex shrink flex-col items-center justify-between gap-6 ">
                <div className="flex items-center gap-2 justify-center">
                  <Link href="/">
                    <img
                      src='/logo.svg'
                      alt='logo icon'
                      className="h-8"
                    />
                  </Link>
                </div>
                <ul className="flex items-center space-x-6 text-muted-foreground">
                  <li className="font-medium hover:text-primary">
                    <a href="#">
                      <Instagram className="size-6" />
                    </a>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <a href="#">
                      <Facebook className="size-6" />
                    </a>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <a href="#">
                      <Twitter className="size-6" />
                    </a>
                  </li>
                  <li className="font-medium hover:text-primary">
                    <a href="#">
                      <Linkedin className="size-6" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-6 lg:gap-20">
                {sections.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    <h3 className="mb-6 font-bold">{section.title}</h3>
                    <ul className="space-y-4 text-sm text-muted-foreground">
                      {section.links.map((link, linkIdx) => (
                        <li
                          key={linkIdx}
                          className="font-medium hover:text-primary"
                        >
                          <a href={link.href}>{link.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
              <p>©2025 All rights reserved.</p>
              <ul className="flex justify-center gap-4 lg:justify-start">
                <li className="hover:text-primary">
                  <a href="#"> Terms and Conditions</a>
                </li>
                <li className="hover:text-primary">
                  <a href="#"> Privacy Policy</a>
                </li>
              </ul>
            </div>
        </footer>
    )
}

export default Footer;