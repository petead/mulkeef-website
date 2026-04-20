"use client";

import Image from "next/image";
import { Fragment, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Globe2, ShieldCheck, Zap } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { WHATSAPP_URL } from "@/lib/utils";
import type { HomePropertyCard } from "@/lib/properties-data";

const revealEase = [0.16, 1, 0.3, 1] as const;

function coverImageUrl(images: HomePropertyCard["images"]) {
  const cover = images.find((img) => img.is_cover === true);
  return cover?.url ?? images[0]?.url ?? null;
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: revealEase, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePageClient({
  featured,
  heroImage,
  heroImageAlt,
}: {
  featured: HomePropertyCard[];
  heroImage: string | null;
  heroImageAlt: string;
}) {
  const t = useTranslations();
  const tProperty = useTranslations("property");
  const tCommon = useTranslations("common");

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 800], [0, 110]);
  const heroImageScale = useTransform(scrollY, [0, 800], [1.06, 1.14]);
  const heroCover = useMemo(
    () => heroImage ?? coverImageUrl(featured[0]?.images ?? []),
    [heroImage, featured],
  );

  const heroTitleLines = t("hero.title").split("\n").filter((l) => l.trim().length > 0);
  const heroAccentLineIndex =
    heroTitleLines.length >= 3 ? 1 : heroTitleLines.length === 2 ? 1 : -1;

  return (
    <div className="bg-[#060D1B] pt-20">
      <section className="relative h-[100vh] min-h-[700px] overflow-hidden">
        {heroCover ? (
          <motion.div
            style={{ y: heroImageY, scale: heroImageScale }}
            className="absolute inset-0"
          >
            <Image
              src={heroCover}
              alt={featured[0]?.title || heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover brightness-[0.35] contrast-110"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(30,79,216,0.35),transparent_42%),linear-gradient(130deg,#060D1B_0%,#0A1628_45%,#0F1D35_100%)]" />
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(30,79,216,0.22),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,13,27,0.82)_0%,rgba(6,13,27,0.35)_45%,#060D1B_100%)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] flex-col justify-end px-5 pb-20 md:px-8">
          <Reveal>
            <div className="label-line label mb-8">
              <span className="w-12" />
              <span>{t("hero.label")}</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="title-xl max-w-[700px]">
              {heroTitleLines.map((line, i) => (
                <Fragment key={`${i}-${line}`}>
                  {i > 0 ? <br /> : null}
                  {i === heroAccentLineIndex ? (
                    <span className="title-italic">{line}</span>
                  ) : (
                    line
                  )}
                </Fragment>
              ))}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[480px] text-base font-light leading-relaxed text-slate">
              {t("hero.subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties" className="btn-gold">
                {t("hero.ctaPrimary")}
              </Link>
              <Link href="/contact" className="btn-outline">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </Reveal>

          <div className="absolute bottom-20 right-5 text-right md:right-8">
            {[
              { value: "500+", label: t("stats.properties") },
              { value: "1200+", label: t("stats.clients") },
              { value: "40+", label: t("stats.communities") },
            ].map((stat, i) => (
              <Reveal key={stat.value} delay={0.2 + i * 0.1}>
                <div className="mb-4">
                  <p className="font-mono text-2xl text-gold">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-[2px] text-slate-dark">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1">
          <motion.div
            className="h-12 w-px bg-gradient-to-b from-transparent via-pearl/60 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.2 }}
          />
          <span className="text-[9px] uppercase tracking-[3px] text-slate">
            {tCommon("scroll")}
          </span>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <Reveal className="mb-12 flex items-end justify-between gap-8">
            <div>
              <div className="label-line label mb-4">
                <span>{t("featured.label")}</span>
              </div>
              <h2 className="title-lg">
                {t.rich("featured.title", {
                  accent: (chunks) => (
                    <span className="title-italic">{chunks}</span>
                  ),
                })}
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[2px] text-gold"
            >
              {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {featured.length === 0 ? (
            <p className="text-sm text-slate">{t("featured.empty")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featured.slice(0, 4).map((prop, index) => {
                const coverUrl = coverImageUrl(prop.images);
                return (
                  <Reveal key={prop.id} delay={0.08 * index}>
                    <Link
                      href={`/properties/${prop.slug}`}
                      className="property-card block"
                      style={{
                        height: index < 2 ? "420px" : "320px",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-gold/10" />
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={prop.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B]/95 via-[#060D1B]/20 to-transparent" />

                      <div className="absolute left-4 top-4">
                        <span
                          className={
                            prop.listingType === "sale"
                              ? "bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#060D1B]"
                              : "border border-pearl/30 bg-pearl/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-pearl backdrop-blur-sm"
                          }
                        >
                          {prop.listingType === "sale"
                            ? tCommon("forSale")
                            : tCommon("forRent")}
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="mb-1 text-[10px] uppercase tracking-[3px] text-gold">
                          {prop.neighborhood}
                        </p>
                        <h3 className="title-md text-white">{prop.title}</h3>
                        <p className="mt-2 opacity-0 transition-opacity delay-75 duration-300 group-hover:opacity-100 text-xs text-slate">
                          {prop.bedrooms > 0
                            ? `${prop.bedrooms} ${
                                prop.bedrooms === 1
                                  ? tCommon("bed")
                                  : tCommon("beds")
                              } · `
                            : `${tCommon("studio")} · `}
                          {prop.bathrooms}{" "}
                          {prop.bathrooms === 1
                            ? tCommon("bath")
                            : tCommon("baths")}{" "}
                          · {prop.areaSqft.toLocaleString()} {tCommon("sqft")}
                        </p>
                        <p className="price mt-3">
                          {prop.priceLabel}
                          {prop.listingType === "rent" && prop.priceSuffix
                            ? ` · ${tCommon("yearly")}`
                            : null}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section-tight divider">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <Reveal className="mb-10">
            <div className="label-line label mb-4">
              <span>{t("services.label")}</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 divide-y divide-brand-blue/10 border-y border-brand-blue/10 md:grid-cols-4 md:divide-x md:divide-y-0">
            {(["buy", "rent", "offplan", "management"] as const).map((key, index) => (
              <Reveal key={key} delay={index * 0.08}>
                <article className="group min-h-[280px] bg-transparent px-6 py-8 transition-colors hover:bg-[#0F1D35]">
                  <p className="font-mono text-sm text-brand-blue">{`0${index + 1}`}</p>
                  <h3 className="mt-6 font-display text-[32px] leading-none text-pearl">
                    {t(`services.${key}.title`)}
                  </h3>
                  <p className="mt-5 text-[13px] leading-relaxed text-slate">
                    {t(`services.${key}.desc`)}
                  </p>
                  <p className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[2px] text-gold">
                    {tCommon("learnMore")}{" "}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(30,79,216,0.2),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-[980px] px-5 text-center md:px-8">
          <Reveal className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <span className="label">{t("why.label")}</span>
            <span className="h-px w-12 bg-gold" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="title-lg">{t("why.title")}</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: ShieldCheck, label: t("why.rera") },
              { icon: Globe2, label: t("why.languages") },
              { icon: Zap, label: t("why.speed") },
            ].map((item, idx) => (
              <Reveal key={item.label} delay={0.2 + idx * 0.08}>
                <div className="flex items-center justify-center gap-2 border border-brand-blue/10 px-4 py-4 text-[11px] uppercase tracking-[2px] text-pearl">
                  <item.icon className="h-4 w-4 text-gold" />
                  {item.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight divider">
        <div className="mx-auto max-w-[900px] px-5 text-center md:px-8">
          <Reveal>
            <h2 className="title-lg">
              {t.rich("cta.title", {
                accent: (chunks) => (
                  <span className="title-italic">{chunks}</span>
                ),
              })}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-[520px] text-sm leading-relaxed text-slate">
              {t("cta.subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-gold">
                {t("cta.btn")}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                {t("cta.whatsapp")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
