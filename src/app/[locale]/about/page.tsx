"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

const STATS = [
  { num: "500+", key: "stats.properties" as const },
  { num: "1200+", key: "stats.clients" as const },
  { num: "8+", key: "stats.experience" as const },
  { num: "40+", key: "stats.communities" as const },
];

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const t = useTranslations();
  const ta = useTranslations("aboutPage");

  return (
    <div className="bg-[#060D1B] pt-28">
      <section className="section-tight">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <Reveal>
            <div className="label-line label mb-5">
              <span>{ta("heroLabel")}</span>
            </div>
            <h1 className="title-xl max-w-[860px]">{ta("heroTitle")}</h1>
            <p className="mt-6 max-w-[620px] text-base text-slate">{ta("heroSubtitle")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section divider">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="label mb-4">{ta("storyLabel")}</div>
            <h2 className="title-lg mb-5">{ta("storyTitle")}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate">
              <p>{ta("storyP1")}</p>
              <p>{ta("storyP2")}</p>
              <p>{ta("storyP3")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-[480px] border border-brand-blue/10 bg-[radial-gradient(circle_at_30%_20%,rgba(30,79,216,0.35),transparent_45%),radial-gradient(circle_at_75%_80%,rgba(201,168,76,0.22),transparent_40%),linear-gradient(140deg,#0A1628,#0F1D35)]">
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.06)_50%,transparent_65%)]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-tight divider">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <Reveal>
            <div className="mb-10">
              <div className="label mb-3">{ta("valuesLabel")}</div>
              <h2 className="title-lg">{ta("valuesTitle")}</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 border-y border-brand-blue/10 md:grid-cols-2">
            {[
              { key: "valueTrustTitle", desc: "valueTrustDesc", no: "01" },
              { key: "valueClientTitle", desc: "valueClientDesc", no: "02" },
              { key: "valueExpertTitle", desc: "valueExpertDesc", no: "03" },
              { key: "valueInnovTitle", desc: "valueInnovDesc", no: "04" },
            ].map((value, i) => (
              <Reveal key={value.key} delay={i * 0.06}>
                <article className="min-h-[250px] border-b border-r border-brand-blue/10 px-6 py-8 md:p-10">
                  <p className="font-mono text-sm text-brand-blue">{value.no}</p>
                  <h3 className="mt-5 font-display text-4xl leading-none text-pearl">
                    {ta(value.key)}
                  </h3>
                  <p className="mt-4 text-sm text-slate">{ta(value.desc)}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="grid grid-cols-2 gap-6 border-y border-brand-blue/10 py-10 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.key} delay={i * 0.08}>
                <div>
                  <p className="font-mono text-3xl text-gold">{stat.num}</p>
                  <p className="mt-2 text-xs uppercase tracking-[2px] text-slate-dark">
                    {t(stat.key)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight divider">
        <div className="mx-auto max-w-[760px] px-5 text-center md:px-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 border border-gold/30 px-5 py-3 text-xs uppercase tracking-[3px] text-gold">
              <span className="h-2 w-2 rounded-full bg-gold" />
              <ShieldCheck className="h-4 w-4" />
              {ta("reraBannerKicker")}
            </div>
            <h2 className="title-lg mt-6">{ta("reraBannerTitle")}</h2>
            <p className="mt-4 text-sm text-slate">{ta("reraBannerBody")}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
