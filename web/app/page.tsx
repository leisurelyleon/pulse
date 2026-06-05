import { Navbar } from "@/components/nav/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Dashboard } from "@/components/sections/Dashboard";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";

/**
 * The entire site is one scroll: nav buttons smooth-scroll between these
 * sections, there is no client-side routing.
 */
export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Dashboard />
      <About />
      <Features />
      <Footer />
    </main>
  );
}
