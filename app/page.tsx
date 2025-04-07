import About from "./components/About";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Solutions from "./components/Solutions";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Hero />
        <About />
        <Solutions />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </>
  );
}
