'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import About from "./components/landing/About";
import Header from "./components/landing/Header";
import Hero from "./components/landing/Hero";
import Solutions from "./components/landing/Solutions";
import Analytics from "./components/landing/Analytics";
import Footer from "./components/landing/Footer";

export default function Home() {
    const router = useRouter()
    useEffect(() => {
        const checkAuth = async () => {
            const response = await fetch('/api/user')
            const result = await response.json()
            if(result.user) {
                router.push('/dashboard');
            }               
        }
        checkAuth()
    }, [router])
  return (
    <>
      <Header />
      <main>
        <Hero  />
        <About />
        <Solutions />
        <Analytics />
      </main>
      <Footer />
    </>
  );
}
