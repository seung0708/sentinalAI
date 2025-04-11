
import About from "./components/About";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Solutions from "./components/Solutions";
import Analytics from "./components/Analytics";
import Footer from "./components/Footer";

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
