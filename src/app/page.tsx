import Hero from "@/components/Hero";
import MarqueeBar from "@/components/MarqueeBar";
import HowItWorks from "@/components/HowItWorks";
import ServicesSection from "@/components/ServicesSection";
import IndustriesSection from "@/components/IndustriesSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeBar />
      <ServicesSection />
      <HowItWorks />
      <IndustriesSection />
      <CTASection />
    </>
  );
}
