"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";

type ServiceSlug = "buy" | "rent" | "offplan" | "management";

const SERVICE_ROWS: { slug: ServiceSlug; no: string; href: string }[] = [
  { slug: "buy", no: "01", href: "/properties?type=sale" },
  { slug: "rent", no: "02", href: "/properties?type=rent" },
  { slug: "offplan", no: "03", href: "/off-plan" },
  { slug: "management", no: "04", href: "/contact" },
];

function readFeatures(messages: Record<string, unknown>, slug: ServiceSlug): string[] {
  const page = messages.servicesPage as Record<string, unknown> | undefined;
  if (!page) return [];
  const key = `${slug}Features`;
  const value = page[key];
  return Array.isArray(value) ? (value as string[]) : [];
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function ServicesPage() {
  const t = useTranslations();
  const ts = useTranslations("servicesPage");
  const messages = useMessages() as Record<string, unknown>;

  return (
    <div className="bg-[#060D1B] pt-28">
      <section className="section-tight">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <Reveal>
            <div className="label-line label mb-5">
              <span>{t("services.eyebrow")}</span>
            </div>
            <h1 className="title-xl max-w-[900px]">{t("services.title")}</h1>
            <p className="mt-6 max-w-[640px] text-base text-slate">{ts("heroSubtitle")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section divider">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="divide-y divide-brand-blue/10 border-y border-brand-blue/10">
            {SERVICE_ROWS.map((row, index) => {
              const introKey = `${row.slug}Intro` as const;
              const features = readFeatures(messages, row.slug);
              return (
                <Reveal key={row.slug} delay={index * 0.06}>
                  <article className="grid grid-cols-1 gap-8 px-0 py-10 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
                    <p className="font-mono text-sm text-brand-blue">{row.no}</p>
                    <div>
                      <h2 className="font-display text-5xl leading-none text-pearl">
                        {t(`services.${row.slug}.title` as "services.buy.title")}
                      </h2>
                      <p className="mt-4 max-w-[420px] text-sm text-slate">{ts(introKey)}</p>
                    </div>
                    <div>
                      <ul className="space-y-3">
                        {features.map((feature) => (
                          <li key={feature} className="text-sm text-slate">
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={row.href}
                        className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold"
                      >
                        {ts("learnMore")} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
