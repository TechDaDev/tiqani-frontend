import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustStrip } from "@/components/landing/trust-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CategorySection } from "@/components/landing/category-section";
import { WhyTiqani } from "@/components/landing/why-tiqani";
import { ContractProtection } from "@/components/landing/contract-protection";
import { TechnicianPreviewSection } from "@/components/landing/technician-preview-section";
import { AudienceCta } from "@/components/landing/audience-cta";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <HeroSection />
        <TrustStrip />
        <HowItWorks />
        <CategorySection />
        <WhyTiqani />
        <ContractProtection />
        <TechnicianPreviewSection />
        <AudienceCta />
      </main>
      <PublicFooter />
    </>
  );
}
