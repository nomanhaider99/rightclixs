export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  quote: string;
  avatar?: string;
  rating?: number;
};

/** Real client testimonials carried over from the existing site. Roles,
 *  avatars and ratings weren't collected, so they're intentionally omitted
 *  (the gallery falls back to an initials monogram). */
export const testimonials: Testimonial[] = [
  {
    id: "sally-b",
    name: "Sally B.",
    quote:
      "I found Rightclixs the perfect choice as far as digital and branding solutions are concerned. To raise brand awareness, they used their expertise to get the job done.",
  },
  {
    id: "tom-h",
    name: "Tom H.",
    quote:
      "They have helped our brand grow and have provided top-notch quality work all the time. Hence the reason why they are on top of my recommendation list.",
  },
  {
    id: "charlotte-h",
    name: "Charlotte H.",
    quote:
      "Their top-quality work is proof of their dedicated approach — they generated marvelous results for my website.",
  },
  {
    id: "paul-p",
    name: "Paul P.",
    quote:
      "There are various reasons I'm a fan: better support, reasonable rates and quicker delivery times than many other agencies.",
  },
  {
    id: "mark-b",
    name: "Mark B.",
    quote:
      "I loved the website design that Rightclixs delivered to me. I'm impressed with their timely as well as professional approach.",
  },
];

/** First letters of the first two words of a name → monogram. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}
