"use client";

import Image from "next/image";
import {
  CalendarClock,
  Check,
  ChevronRight,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** Kept in step with the footer and the contact page. */
const PHONE_DISPLAY = "+1 (833) 945-5567";
const PHONE_HREF = "tel:+18339455567";
const EMAIL = "support@rightclixs.com";
/** WhatsApp deep link — same number, digits only, as wa.me requires. */
const WHATSAPP_HREF = "https://wa.me/18339455567";

/**
 * The Real Assistant channel — the human side of the widget.
 *
 * Captures a lead and hands off to the channels Rightclixs actually staffs
 * (phone, email, WhatsApp). Like the site's ContactDialog, submission is
 * currently client-side only: it confirms to the visitor but does not persist
 * anywhere. Wire `onSubmit` to your CRM or an email endpoint before launch —
 * until then these enquiries are not delivered.
 */
export function RealAssistantTab() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Thanks — a strategist will reply shortly.");
    setSent(true);
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background px-4 py-5">
      {/* ----------------------------- availability ----------------------------- */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-neutral-soft px-4 py-3.5">
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white ring-1 ring-border">
          <Image
            src="/logo-mark.png"
            alt=""
            width={128}
            height={128}
            className="size-6 w-auto object-contain"
          />
          <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-neutral-soft bg-emerald-500" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-heading">The Rightclixs team is online</p>
          <p className="mt-0.5 text-xs leading-relaxed text-heading/55">
            A real strategist replies within one business day — usually much sooner.
          </p>
        </div>
      </div>

      {/* -------------------------------- form -------------------------------- */}
      {sent ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-indigo/20 bg-lavender/40 px-5 py-7 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-indigo text-white">
            <Check className="size-6" />
          </span>
          <p className="mt-4 text-base font-medium text-heading">Message received</p>
          <p className="mt-1.5 max-w-[270px] text-sm leading-relaxed text-heading/60">
            A strategist will pick this up and get back to you. Need an answer right
            now? Call us on {PHONE_DISPLAY}.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 cursor-pointer text-sm font-medium text-indigo transition-opacity hover:opacity-75"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3.5">
          <div className="grid gap-1.5">
            <Label htmlFor="ra-name" className="text-xs text-heading/70">
              Your name
            </Label>
            <Input id="ra-name" name="name" required placeholder="Jane Cooper" className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ra-email" className="text-xs text-heading/70">
              Email
            </Label>
            <Input
              id="ra-email"
              name="email"
              type="email"
              required
              placeholder="jane@company.com"
              className="h-10"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ra-message" className="text-xs text-heading/70">
              How can we help?
            </Label>
            <Textarea
              id="ra-message"
              name="message"
              rows={3}
              required
              placeholder="Tell us briefly what you're looking for."
              className="resize-none"
            />
          </div>

          <button
            type="submit"
            className={cn(
              "mt-1 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full",
              "bg-indigo text-sm font-medium text-white shadow-[0_12px_28px_-12px_rgba(98,96,255,0.9)]",
              "transition-colors hover:bg-indigo/90 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
          >
            <Send className="size-4" />
            Start the conversation
          </button>
        </form>
      )}

      {/* ------------------------------- channels ------------------------------- */}
      <div className="mt-6">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-medium tracking-wide text-heading/40 uppercase">
            Or reach us directly
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-3 grid gap-2">
          <ChannelRow
            icon={Phone}
            label="Call us"
            value={PHONE_DISPLAY}
            href={PHONE_HREF}
          />
          <ChannelRow icon={Mail} label="Email" value={EMAIL} href={`mailto:${EMAIL}`} />
          <ChannelRow
            icon={MessageCircle}
            label="WhatsApp"
            value="Chat on WhatsApp"
            href={WHATSAPP_HREF}
            external
          />
        </div>
      </div>

      {/* -------------------------------- assurances -------------------------------- */}
      <div className="mt-5 grid gap-2 rounded-2xl bg-neutral-soft px-4 py-3.5">
        <Assurance icon={CalendarClock} text="Free 30-minute consultation, no obligation." />
        <Assurance icon={ShieldCheck} text="Written scope and fixed quote before you commit." />
      </div>
    </div>
  );
}

function ChannelRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-border bg-background px-3.5 py-3",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo/35 hover:bg-lavender/35",
        "focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none motion-reduce:hover:translate-y-0",
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-lavender text-indigo transition-colors group-hover:bg-indigo group-hover:text-white">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] tracking-wide text-heading/45 uppercase">{label}</span>
        <span className="block truncate text-sm font-medium text-heading">{value}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-heading/25 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo motion-reduce:group-hover:translate-x-0" />
    </a>
  );
}

function Assurance({ icon: Icon, text }: { icon: typeof Phone; text: string }) {
  return (
    <p className="flex items-center gap-2.5 text-xs leading-relaxed text-heading/60">
      <Icon className="size-3.5 shrink-0 text-indigo" />
      {text}
    </p>
  );
}
