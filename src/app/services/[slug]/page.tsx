import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, Tag } from "lucide-react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { CtaPanel } from "@/components/site/cta-panel";
import { DeliverablesGrid } from "@/components/site/deliverables-grid";
import { FaqSection } from "@/components/site/faq-section";
import { SiteFooter } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ProcessSection } from "@/components/site/process-section";
import { Reveal } from "@/components/site/reveal";
import { CtaBand, Em } from "@/components/site/section";
import { ServiceCard } from "@/components/site/service-card";
import { StatBand } from "@/components/site/stat-band";
import { WhoFor } from "@/components/site/who-for";
import { Button } from "@/components/ui/button";
import { getService, services } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) return { title: "Service — Rightclixs" };
  return {
    title: `${svc.name} — Rightclixs`,
    description: svc.description,
    openGraph: { title: `${svc.name} — Rightclixs`, description: svc.description },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) notFound();

  const others = services.filter((s) => s.slug !== svc.slug).slice(0, 3);

  return (
    <div className="bg-background">
      <PageHero
        eyebrow={
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-lavender transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            All services
          </Link>
        }
        title={svc.name}
        subtitle={svc.description}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ContactCtaButton preset={{ service: svc.name }} variant="onDark">
            Get started
          </ContactCtaButton>
          {svc.pricingCategory && (
            <Button asChild variant="outlineDark" size="pillLg">
              <Link href="/pricing">
                <span className="grid size-8 place-items-center rounded-full bg-white/10">
                  <ArrowRight className="size-4" />
                </span>
                See packages
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85">
            <Tag className="size-4" />
            From {svc.startingAt}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85">
            <Clock className="size-4" />
            {svc.timeline}
          </span>
        </div>
      </PageHero>

      {/* Proof stats, lifted to straddle the hero edge */}
      <section className="px-5">
        <div className="mx-auto -mt-12 max-w-7xl">
          <StatBand stats={svc.outcomes} />
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal from="left">
            <div>
              <p className="section-label">Overview</p>
              <h2 className="mt-3 text-3xl leading-[1.15] font-medium text-heading sm:text-4xl">
                What you get with <Em>{svc.name}</Em>
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-heading/70">
                {svc.longDescription}
              </p>
              <div className="mt-8">
                <ContactCtaButton preset={{ service: svc.name }}>Get started</ContactCtaButton>
              </div>
            </div>
          </Reveal>

          <Reveal from="right">
            <div className="rounded-3xl border border-border bg-neutral-soft p-7">
              <h3 className="text-sm font-semibold tracking-wide text-heading/70">
                What&apos;s included
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-heading/75">
                {svc.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-indigo" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs text-heading/50">Starting from</p>
                <p className="mt-1 text-2xl font-semibold text-indigo">{svc.startingAt}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-background px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="section-label">Deliverables</p>
              <h2 className="mt-3 text-3xl leading-[1.15] font-medium text-heading sm:text-4xl">
                Exactly what lands in <Em>your hands.</Em>
              </h2>
              <p className="mt-4 text-heading/60">
                No vague retainers. Here&apos;s the actual work you receive.
              </p>
            </div>
          </Reveal>
          <div className="mt-12">
            <DeliverablesGrid items={svc.deliverables} />
          </div>
        </div>
      </section>

      <WhoFor
        points={svc.whoFor}
        serviceName={svc.name}
        notFor="Not the right fit if you need it live next week on a fixed template — we'd rather point you elsewhere than rush something we can't stand behind."
      />

      <div className="border-t border-border">
        <ProcessSection />
      </div>

      <CtaPanel
        title={
          <>
            Let&apos;s scope your <Em>{svc.name}</Em> project.
          </>
        }
        body="A 30-minute call ends with a written scope and a transparent quote. 100% free, zero obligation."
        presetService={svc.name}
        secondary={{ label: "See all services", href: "/services" }}
      />

      <FaqSection
        faqs={svc.faqs}
        eyebrow="FAQ"
        subtext={`The questions clients actually ask before starting a ${svc.name.toLowerCase()} project.`}
        presetService={svc.name}
      />

      <section className="bg-neutral-soft px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-2xl font-medium text-heading sm:text-3xl">
              Explore more <Em>services</Em>
            </h2>
          </Reveal>
          <Reveal
            stagger={0.06}
            from="alternate"
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {others.map((o) => (
              <ServiceCard key={o.slug} service={o} />
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand />
      <SiteFooter />
    </div>
  );
}
