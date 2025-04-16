
import About from "./components/landing/About";
import Header from "./components/landing/Header";
import Hero from "./components/landing/Hero";
import Solutions from "./components/landing/Solutions";
import Analytics from "./components/landing/Analytics";
import Footer from "./components/landing/Footer";

export default function Home() {
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
