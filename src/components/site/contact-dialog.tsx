"use client";

import { Send } from "lucide-react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";
import { CtaButton } from "@/components/site/cta-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { services } from "@/data/services";

/** Optional context passed when opening the dialog (e.g. from a service wheel
 *  or a pricing card) so the form can pre-select / reference it. */
export type ContactPreset = {
  /** Pre-selects the service dropdown, matched against a service name. */
  service?: string;
  /** A chosen pricing package name — shown as context above the form. */
  packageName?: string;
};

type ContactDialogContextValue = {
  open: (preset?: ContactPreset) => void;
  close: () => void;
};

const ContactDialogContext = createContext<ContactDialogContextValue | null>(null);

export function useContactDialog(): ContactDialogContextValue {
  const ctx = useContext(ContactDialogContext);
  if (!ctx) {
    throw new Error("useContactDialog must be used within <ContactDialogProvider>");
  }
  return ctx;
}

/** Animated CTA button that opens the shared ContactDialog. Reused by every
 *  section CTA and by the individual service pages. */
export function ContactCtaButton({
  children = "Get started",
  preset,
  variant,
  size,
  className,
}: {
  children?: ReactNode;
  preset?: ContactPreset;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const { open } = useContactDialog();
  return (
    <CtaButton onClick={() => open(preset)} variant={variant} size={size} className={className}>
      {children}
    </CtaButton>
  );
}

export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState<ContactPreset>({});

  const value = useMemo<ContactDialogContextValue>(
    () => ({
      open: (next) => {
        setPreset(next ?? {});
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }),
    [],
  );

  return (
    <ContactDialogContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-heading">
              Get started with Rightclixs
            </DialogTitle>
            <DialogDescription>
              Tell us about your project and we&apos;ll get back to you within one business day.
            </DialogDescription>
          </DialogHeader>
          <QuoteForm preset={preset} onDone={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </ContactDialogContext.Provider>
  );
}

function QuoteForm({ preset, onDone }: { preset: ContactPreset; onDone: () => void }) {
  const [service, setService] = useState(preset.service ?? "");
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
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {preset.packageName && (
        <p className="rounded-xl bg-lavender/60 px-4 py-3 text-sm text-heading">
          Selected package: <span className="font-semibold">{preset.packageName}</span>
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cd-name">Full name</Label>
          <Input id="cd-name" name="name" required placeholder="Jane Cooper" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cd-email">Email</Label>
          <Input
            id="cd-email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cd-phone">Phone</Label>
          <Input id="cd-phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cd-service">Service</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger id="cd-service">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.slug} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="cd-message">Project details</Label>
          <Textarea
            id="cd-message"
            name="message"
            rows={4}
            placeholder="Tell us about your goals, timeline and budget."
          />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="cd-consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor="cd-consent" className="text-xs leading-relaxed font-normal text-heading/60">
          I agree to receive communications by text message regarding service updates, promotions
          and customer support from Rightclixs. You may opt out by replying STOP. Message frequency
          varies; message and data rates may apply.
        </Label>
      </div>

      <Button type="submit" variant="brand" size="pillLg">
        <span className="grid size-8 place-items-center rounded-full bg-white/25">
          <Send className="size-4" />
        </span>
        Send request
      </Button>
    </form>
  );
}
