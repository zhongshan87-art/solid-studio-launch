import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { DataExporter } from "@/components/DataExporter";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProjectGrid />
      <About />
      <Contact />
      <Footer />
      <DataExporter />
    </main>
  );
};

export default Index;
