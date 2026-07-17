import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TerminalPreview } from "@/components/TerminalPreview";
import { Personality } from "@/components/Personality";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TerminalPreview />
        <Personality />
      </main>
      <Footer />
    </>
  );
}
