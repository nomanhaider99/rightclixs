import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Service } from "@/data/services";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-3xl border border-border bg-neutral-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo/30 hover:bg-lavender hover:shadow-[0_24px_50px_-30px_rgba(98,96,255,0.6)]"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-white text-indigo transition-colors group-hover:bg-indigo group-hover:text-white">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-5 text-lg font-medium text-heading">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-heading/60">{service.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo">
        Learn more
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
