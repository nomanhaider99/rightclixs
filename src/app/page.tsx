import type { Metadata } from "next";

import { AboutSection } from "@/components/site/about-section";
import { CtaPanel } from "@/components/site/cta-panel";
import { FaqSection } from "@/components/site/faq-section";
import { SiteFooter } from "@/components/site/footer";
import { HeroSection } from "@/components/site/hero-section";
import { PortfolioSection } from "@/components/site/portfolio-section";
import { PricingSection } from "@/components/site/pricing-section";
import { ProcessSection } from "@/components/site/process-section";
import { CtaBand, Em } from "@/components/site/section";
import { ServicesSection } from "@/components/site/services-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { TrustBand } from "@/components/site/trust-band";
import { agencyFaqs } from "@/data/agency";

export const metadata: Metadata = {
  title: "Rightclixs — Website Design & Development Agency in Dallas",
  description:
    "Rightclixs builds custom websites, e-commerce stores, portals and marketing programmes that drive measurable business growth. Packages start at $149.",
  openGraph: {
    title: "Rightclixs — Built For Serious Business Growth",
    description:
      "Custom web design, development, SEO, branding and social marketing for ambitious brands.",
  },
};

export default function Home() {
  return (
    <div className="bg-background">
      <HeroSection />
      <AboutSection />

      {/* SERVICES — Option Wheel */}
      <div id="services" className="scroll-mt-24">
        <ServicesSection />
      </div>

      {/* PORTFOLIO — Tabs + Masonry */}
      <div id="work" className="scroll-mt-24">
        <PortfolioSection />
      </div>

      {/* Mid-page CTA — catches visitors convinced by the work above */}
      <CtaPanel
        title={
          <>
            Like what you see? Let&apos;s build <Em>yours next.</Em>
          </>
        }
        body="Tell us what you're trying to achieve. A 30-minute call ends with a written scope and a transparent quote — 100% free, zero obligation."
        secondary={{ label: "View pricing", href: "/pricing" }}
      />

      {/* PROCESS — Animated Cycle */}
      <div id="process" className="scroll-mt-24">
        <ProcessSection />
      </div>

      {/* PRICING — Tabs + Border-Glow Cards */}
      <div id="pricing" className="scroll-mt-24">
        <PricingSection />
      </div>

      {/* Guarantees — reassurance between price and proof */}
      <TrustBand />

      {/* TESTIMONIALS — Circular Gallery */}
      <div id="testimonials" className="scroll-mt-24">
        <TestimonialsSection />
      </div>

      <FaqSection
        faqs={agencyFaqs}
        eyebrow="FAQ"
        heading={
          <>
            Everything you&apos;re probably <Em>wondering.</Em>
          </>
        }
        subtext="The questions we get asked most before a project starts."
      />

      <CtaBand />
      <SiteFooter />
    </div>
  );
}
