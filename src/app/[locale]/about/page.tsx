"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Users,
  Award,
  TrendingUp,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { WHATSAPP_URL } from "@/lib/utils";

const STATS = [
  { num: 500, labelKey: "stats.properties" as const },
  { num: 1200, labelKey: "stats.clients" as const },
  { num: 8, labelKey: "stats.experience" as const },
  { num: 40, labelKey: "stats.communities" as const },
];

const VALUE_ROWS = [
  {
    key: "trust",
    icon: Shield,
    titleKey: "valueTrustTitle" as const,
    descKey: "valueTrustDesc" as const,
    box: "bg-brand-blue/10",
    iconColor: "text-brand-blue",
    borderHover: "group-hover:border-brand-blue/35",
  },
  {
    key: "client",
    icon: Users,
    titleKey: "valueClientTitle" as const,
    descKey: "valueClientDesc" as const,
    box: "bg-gold/10",
    iconColor: "text-gold",
    borderHover: "group-hover:border-gold/35",
  },
  {
    key: "expert",
    icon: Award,
    titleKey: "valueExpertTitle" as const,
    descKey: "valueExpertDesc" as const,
    box: "bg-emerald/10",
    iconColor: "text-emerald",
    borderHover: "group-hover:border-emerald/35",
  },
  {
    key: "innov",
    icon: TrendingUp,
    titleKey: "valueInnovTitle" as const,
    descKey: "valueInnovDesc" as const,
    box: "bg-coral/10",
    iconColor: "text-coral",
    borderHover: "group-hover:border-coral/35",
  },
] as const;

const AGENT_KEYS = ["agent1", "agent2", "agent3", "agent4"] as const;

export default function AboutPage() {
  const t = useTranslations();
  const ta = useTranslations("aboutPage");
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div className="min-h-screen bg-navy pt-20 lg:pt-24">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex min-h-[56vh] items-center justify-center overflow-hidden py-20 lg:py-28"
      >
        <div className="absolute inset-0 bg-navy-gradient" />

        <motion.div
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{ y: bgY }}
        >
          <motion.div
            className="pointer-events-none absolute -left-1/4 top-0 h-[65vh] w-[65vh] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(30,79,216,0.26) 0%, rgba(22,64,176,0.12) 38%, transparent 68%)",
            }}
            animate={{ x: [0, 36, 0], y: [0, 24, 0], opacity: [0.5, 0.82, 0.5] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-1/4 bottom-0 h-[58vh] w-[58vh] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(22,64,176,0.2) 0%, rgba(10,22,40,0.18) 42%, transparent 70%)",
            }}
            animate={{ x: [0, -32, 0], y: [0, -22, 0], opacity: [0.38, 0.68, 0.38] }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/4 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,168,83,0.09) 0%, transparent 62%)",
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.32, 0.52, 0.32] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

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
          <div className="section-label mb-4">{ta("heroLabel")}</div>
          <h1 className="section-title mb-6">{ta("heroTitle")}</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate">
            {ta("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="border-t border-brand-blue/10 bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center lg:mb-16 lg:text-left">
            <div className="section-label mb-3 lg:text-left">{ta("storyLabel")}</div>
            <h2 className="section-title lg:mx-0">{ta("storyTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-5 text-slate lg:order-1">
              <p className="leading-relaxed">{ta("storyP1")}</p>
              <p className="leading-relaxed">{ta("storyP2")}</p>
              <p className="leading-relaxed">{ta("storyP3")}</p>
            </div>
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-brand-blue/15 bg-gradient-to-br from-brand-blue/20 via-navy-light to-gold/10 shadow-[0_0_48px_-16px_rgba(30,79,216,0.25)] lg:order-2"
              role="img"
              aria-label={ta("storyPhotoAlt")}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,79,216,0.25),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,168,83,0.12),transparent_45%)]" />
              <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(105deg, transparent 40%, rgba(248,250,252,0.04) 50%, transparent 60%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-brand-blue/10 bg-navy-light py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={i}>
                <div className="mb-2 font-mono text-3xl font-bold text-gold lg:text-4xl">
                  {stat.num.toLocaleString("en-US")}+
                </div>
                <div className="text-sm text-slate">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <div className="section-label mb-3">{ta("valuesLabel")}</div>
            <h2 className="section-title">{ta("valuesTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {VALUE_ROWS.map((row) => (
              <div
                key={row.key}
                className={`card group border p-8 transition-colors duration-300 hover:bg-navy-medium ${row.borderHover}`}
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-transparent transition-all duration-300 group-hover:scale-110 ${row.box} ${row.borderHover}`}
                >
                  <row.icon className={`h-6 w-6 ${row.iconColor}`} />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-pearl">
                  {ta(row.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-slate">{ta(row.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-brand-blue/10 bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <div className="section-label mb-3">{ta("teamLabel")}</div>
            <h2 className="section-title">{ta("teamTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AGENT_KEYS.map((agentKey) => (
              <article
                key={agentKey}
                className="card border border-brand-blue/10 p-6 text-center transition-shadow duration-300 hover:border-brand-blue/25 hover:shadow-lg"
              >
                <div
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-brand-blue/20 bg-gradient-to-br from-brand-blue/20 to-gold/10"
                  aria-hidden
                />
                <h3 className="font-display text-lg font-bold text-pearl">
                  {ta(`${agentKey}.name`)}
                </h3>
                <p className="mb-3 text-sm text-brand-blue-light">{ta(`${agentKey}.title`)}</p>
                <p className="font-mono text-xs text-slate-dark">
                  {ta("teamRera")}: {ta(`${agentKey}.rera`)}
                </p>
                <p className="mt-2 text-xs text-slate">
                  <span className="font-semibold text-gold/90">{ta("teamLanguages")}: </span>
                  {ta(`${agentKey}.languages`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RERA banner */}
      <section className="bg-navy-light py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-card border border-gold/25 bg-gradient-to-br from-navy via-navy-medium to-navy-light p-8 shadow-[0_0_0_1px_rgba(212,168,83,0.12),0_24px_60px_-24px_rgba(30,79,216,0.35)] sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-brand-blue/15 blur-2xl" />

            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
              <div className="mb-6 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold sm:mb-0">
                <Shield className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[3px] text-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  {ta("reraBannerKicker")}
                </div>
                <h2 className="mb-4 font-display text-2xl font-bold text-pearl sm:text-3xl">
                  {ta("reraBannerTitle")}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate sm:text-base">
                  {ta("reraBannerBody")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — aligné avec la home */}
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
