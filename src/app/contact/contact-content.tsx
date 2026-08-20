"use client";

import { Mail, MapPin, MessagesSquare, Phone, Rocket, Send, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FaqSection } from "@/components/site/faq-section";
import { SiteFooter } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Em } from "@/components/site/section";
import { StatBand } from "@/components/site/stat-band";
import { TrustBand } from "@/components/site/trust-band";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { agencyStats, contactFaqs } from "@/data/agency";
import { serviceOptions } from "@/data/content";

const nextSteps = [
  {
    icon: MessagesSquare,
    title: "We reach out",
    desc: "A strategist replies within one business day to learn about your goals.",
  },
  {
    icon: Sparkles,
    title: "Free consultation",
    desc: "A 30-minute call ending with a written scope and a transparent quote.",
  },
  {
    icon: Rocket,
    title: "We get to work",
    desc: "Approve the scope and your dedicated team kicks off straight away.",
  },
];

export function ContactContent() {
  const [service, setService] = useState("");
  const [consent, setConsent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      toast.error("Please agree to be contacted so we can reply to you.");
      return;
    }
    toast.success("Thanks! Our team will get back to you within one business day.");
    e.currentTarget.reset();
    setService("");
    setConsent(false);
  }

  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Book your free consultation with <Em>experts now.</Em>
          </>
        }
        subtitle="100% free. Zero obligation. We would love to assist you."
      />

      <section className="px-5">
        <div className="mx-auto -mt-12 max-w-7xl">
          <StatBand stats={agencyStats.slice(0, 3)} />
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal from="left" className="space-y-4">
            {[
              { icon: Phone, label: "Call us", value: "+1 (833) 945-5567", href: "tel:+18339455567" },
              {
                icon: Mail,
                label: "Email",
                value: "support@rightclixs.com",
                href: "mailto:support@rightclixs.com",
              },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="flex items-start gap-4 rounded-2xl bg-neutral-soft p-6 transition-colors hover:bg-lavender"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-indigo">
                  <c.icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-heading/55">{c.label}</span>
                  <span className="block truncate font-medium text-heading">{c.value}</span>
                </span>
              </a>
            ))}
            <div className="flex items-start gap-4 rounded-2xl bg-neutral-soft p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-indigo">
                <MapPin className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-heading/55">Office</span>
                <span className="block font-medium text-heading">
                  539 W Commerce St #5348, Dallas, TX 75208, United States
                </span>
              </span>
            </div>
            <div className="rounded-2xl bg-ink p-6 text-white">
              <p className="text-sm text-white/60">Prefer to talk it through?</p>
              <p className="mt-2 text-lg font-medium">
                Consultations run 30 minutes and end with a written scope and quote.
              </p>
            </div>
          </Reveal>

          <Reveal from="right">
            <form onSubmit={onSubmit} className="rounded-3xl bg-neutral-soft p-7 sm:p-10">
              <h2 className="text-2xl font-medium text-heading">Request a quote</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required placeholder="Jane Cooper" className="bg-background" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="bg-background"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-background" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service" className="bg-background">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="message">Project details</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us about your goals, timeline and budget."
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent" className="text-xs leading-relaxed font-normal text-heading/60">
                  I agree to receive communications by text message regarding service updates,
                  promotions and customer support from Rightclixs. You may opt out by replying STOP.
                  Message frequency varies; message and data rates may apply.
                </Label>
              </div>

              <Button type="submit" variant="brand" size="pillLg" className="mt-7">
                <span className="grid size-8 place-items-center rounded-full bg-white/25">
                  <Send className="size-4" />
                </span>
                Send request
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-neutral-soft px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-2xl text-2xl font-medium text-heading sm:text-3xl">
            What happens <Em>next.</Em>
          </h2>
          <Reveal stagger={0.08} from="alternate" className="mt-10 grid gap-5 md:grid-cols-3">
            {nextSteps.map((s, i) => (
              <div key={s.title} className="rounded-3xl border border-border bg-background p-7">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-lavender text-indigo">
                    <s.icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-indigo">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-medium text-heading">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-heading/60">{s.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <TrustBand />

      <FaqSection
        faqs={contactFaqs}
        eyebrow="Before you send"
        heading={
          <>
            What to expect when you <Em>reach out.</Em>
          </>
        }
        subtext="No sales sequence, no drip campaign — just a person replying to your message."
      />

      <SiteFooter />
    </div>
  );
}
