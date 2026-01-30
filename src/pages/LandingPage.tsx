import { useState } from "react";
import {
  LandingHeader,
  HeroSection,
  ProblemSection,
  HowItWorksSection,
  ProductSection,
  IntegrationsSection,
  BenefitsSection,
  UseCasesSection,
  MetricsSection,
  PricingSection,
  SocialProofSection,
  FAQSection,
  CTASection,
  LandingFooter,
  ContactModal,
} from "@/components/landing";

type ContactType = "demo" | "waitlist" | "diagnostic";

export default function LandingPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactType, setContactType] = useState<ContactType>("demo");

  const handleOpenContact = (type: ContactType) => {
    setContactType(type);
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onOpenContact={handleOpenContact} />
      
      <main>
        <HeroSection onOpenContact={handleOpenContact} />
        <ProblemSection />
        <HowItWorksSection />
        <ProductSection />
        <IntegrationsSection />
        <BenefitsSection />
        <UseCasesSection />
        <MetricsSection />
        <PricingSection onOpenContact={handleOpenContact} />
        <SocialProofSection onOpenContact={handleOpenContact} />
        <FAQSection />
        <CTASection onOpenContact={handleOpenContact} />
      </main>

      <LandingFooter />

      <ContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        type={contactType}
      />
    </div>
  );
}
