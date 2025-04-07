"use client";

import { useState } from "react";

import About from "./components/About";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Solutions from "./components/Solutions";
import Analytics from "./components/Analytics";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";

export default function Home() {
  const [showPricing, setShowPricing] = useState(false);
  return (
    <>
      <Header allAccess={() => setShowPricing(true)} />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      {showPricing ? (
          <Pricing />
        ) : (
          <>
          <Hero getStarted={() => setShowPricing(true)} />
          <About />
          <Solutions />
          <Analytics />
          </>
        )
      }
      </main>
      <Footer />
    </>
  );
}
