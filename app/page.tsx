'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import About from "./components/landing/About";
import Header from "./components/landing/Header";
import Hero from "./components/landing/Hero";
import Solutions from "./components/landing/Solutions";
import Analytics from "./components/landing/Analytics";
import Footer from "./components/landing/Footer";

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user')
        const result = await response.json()
        if(result.user) {
          router.push('/dashboard');
        }               
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) return null

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
