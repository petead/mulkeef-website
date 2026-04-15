"use client";

import { useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Key,
  Building2,
  Settings,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  Shield,
  Globe,
  Zap,
  MessageCircle,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { WHATSAPP_URL } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ServiceSlug =
  | "buy"
  | "rent"
  | "offplan"
  | "management"
  | "valuation"
  | "advisory";

const SERVICE_ROWS: {
  slug: ServiceSlug;
  icon: typeof Home;
  iconBox: string;
  iconColor: string;
  borderHover: string;
}[] = [
  {
    slug: "buy",
    icon: Home,
    iconBox: "bg-brand-blue/10",
    iconColor: "text-brand-blue",
    borderHover: "hover:border-brand-blue/40",
  },
  {
    slug: "rent",
    icon: Key,
    iconBox: "bg-gold/10",
    iconColor: "text-gold",
    borderHover: "hover:border-gold/40",
  },
  {
    slug: "offplan",
    icon: Building2,
    iconBox: "bg-emerald/10",
    iconColor: "text-emerald",
    borderHover: "hover:border-emerald/40",
  },
  {
    slug: "management",
    icon: Settings,
    iconBox: "bg-coral/10",
    iconColor: "text-coral",
    borderHover: "hover:border-coral/40",
  },
  {
    slug: "valuation",
    icon: ClipboardCheck,
    iconBox: "bg-ice/15",
    iconColor: "text-ice",
    borderHover: "hover:border-ice/35",
  },
  {
    slug: "advisory",
    icon: TrendingUp,
    iconBox: "bg-brand-blue-dark/20",
    iconColor: "text-brand-blue-light",
    borderHover: "hover:border-brand-blue-light/40",
  },
];

const FAQ_KEYS = [1, 2, 3, 4, 5, 6] as const;

function readFeatures(
  messages: Record<string, unknown>,
  slug: ServiceSlug
): string[] {
  const page = messages.servicesPage as Record<string, unknown> | undefined;
  if (!page) return [];
  const key = `${slug}Features`;
  const v = page[key];
  return Array.isArray(v) ? (v as string[]) : [];
}

export default function ServicesPage() {
  const t = useTranslations();
  const ts = useTranslations("servicesPage");
  const locale = useLocale();
  const messages = useMessages() as Record<string, unknown>;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: FAQ_KEYS.map((i) => ({
      "@type": "Question",
      name: ts(`faq${i}Q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: ts(`faq${i}A`),
      },
    })),
  };

  return (
    <div className="min-h-screen bg-navy pt-20 lg:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-navy-gradient" />
        <motion.div
          className="pointer-events-none absolute -left-1/4 top-0 h-[55vh] w-[55vh] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(30,79,216,0.24) 0%, transparent 65%)",
          }}
          animate={{ x: [0, 28, 0], y: [0, 18, 0], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-1/4 bottom-0 h-[50vh] w-[50vh] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 62%)",
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(248 250 252) 1px, transparent 1px), linear-gradient(to bottom, rgb(248 250 252) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,79,216,0.1),_transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="section-label mb-4">{t("services.label")}</div>
          <h1 className="section-title mb-6">{t("services.title")}</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate">
            {ts("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="border-t border-brand-blue/10 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
          {SERVICE_ROWS.map((row) => {
            const features = readFeatures(messages, row.slug);
            const introKey = `${row.slug}Intro` as const;
            return (
              <article
                key={row.slug}
                className={cn(
                  "card overflow-hidden border border-brand-blue/10 p-8 transition-colors duration-300 lg:p-10",
                  row.borderHover
                )}
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                  <div className="lg:col-span-1">
                    <div
                      className={cn(
                        "mb-5 flex h-14 w-14 items-center justify-center rounded-xl",
                        row.iconBox
                      )}
                    >
                      <row.icon className={cn("h-7 w-7", row.iconColor)} />
                    </div>
                    <h2 className="mb-3 font-display text-2xl font-bold text-pearl">
                      {t(`services.${row.slug}.title` as "services.buy.title")}
                    </h2>
                    <p className="text-sm leading-relaxed text-slate">
                      {ts(introKey)}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-gold">
                      {ts("featuresHeading")}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-start gap-3 text-sm text-slate"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-blue"
                            aria-hidden
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 border-t border-brand-blue/10 pt-6">
                      <Link
                        href="/contact"
                        className={cn(
                          "inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                          row.slug === "buy" && "text-brand-blue hover:text-brand-blue-light",
                          row.slug === "rent" && "text-gold hover:text-gold-light",
                          row.slug === "offplan" && "text-emerald hover:text-emerald/90",
                          row.slug === "management" && "text-coral hover:text-coral/90",
                          row.slug === "valuation" && "text-ice hover:text-pearl",
                          row.slug === "advisory" &&
                            "text-brand-blue-light hover:text-brand-blue"
                        )}
                      >
                        {ts("learnMore")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Why choose MULKEEF */}
      <section className="border-t border-brand-blue/10 bg-navy-light py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <div className="section-label mb-3">{ts("whyLabel")}</div>
            <h2 className="section-title">{ts("whyTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: ts("whyReraTitle"),
                desc: ts("whyReraDesc"),
              },
              {
                icon: Globe,
                title: ts("whyLangTitle"),
                desc: ts("whyLangDesc"),
              },
              {
                icon: Zap,
                title: ts("whyFastTitle"),
                desc: ts("whyFastDesc"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-card border border-brand-blue/10 bg-navy p-8 text-center transition-shadow duration-300 hover:border-brand-blue/20 hover:shadow-lg"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-blue/10">
                  <item.icon className="h-7 w-7 text-brand-blue" />
                </div>
                <h3 className="mb-3 font-display text-lg font-bold text-pearl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-brand-blue/10 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <div className="section-label mb-3">{ts("faqLabel")}</div>
            <h2 className="section-title mb-3">{ts("faqTitle")}</h2>
            <p className="text-slate">{ts("faqSubtitle")}</p>
          </div>
          <div className="space-y-3">
            {FAQ_KEYS.map((i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-card border border-brand-blue/10 bg-navy-light"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-blue/5"
                    aria-expanded={open}
                  >
                    <span className="font-display text-base font-semibold text-pearl sm:text-lg">
                      {ts(`faq${i}Q`)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 flex-shrink-0 text-brand-blue transition-transform duration-300",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-brand-blue/10 px-5 pb-5 pt-2 text-sm leading-relaxed text-slate">
                          {ts(`faq${i}A`)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(30,79,216,0.08),transparent_55%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-5 font-display text-3xl font-bold text-pearl sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-slate">{t("cta.subtitle")}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="btn-gold inline-flex items-center justify-center gap-2 !font-display !font-bold"
            >
              {t("cta.btn")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-btn border border-emerald/30 px-6 py-3 font-body font-semibold text-emerald transition-colors duration-200 hover:bg-emerald/10"
            >
              <MessageCircle className="h-4 w-4 text-emerald" />
              {t("cta.whatsapp")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
