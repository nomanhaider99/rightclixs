import type { Metadata } from "next";

import { ContactContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Contact Rightclixs — Free Consultation & Custom Quotes",
  description:
    "Book a free, zero-obligation consultation with Rightclixs. Call +1 (833) 945-5567, email support@rightclixs.com or send us your project brief.",
  openGraph: {
    title: "Contact Rightclixs — Book a Free Consultation",
    description: "Tell us about your project and get a custom quote within one business day.",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
