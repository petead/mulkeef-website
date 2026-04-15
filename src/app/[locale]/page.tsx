"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Globe2, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { getSupabase } from "@/lib/supabase";
import { WHATSAPP_URL } from "@/lib/utils";

type HomeFeaturedProperty = {
  id: string;
  title: string;
  neighborhood: string;
  slug: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: "sale" | "rent";
  status: string;
  images: { url: string; is_cover: boolean; position: number }[];
};

const DEMO_PROPERTIES: HomeFeaturedProperty[] = [
  { id: "1", title: "Modern Apartment in JVC", neighborhood: "Jumeirah Village Circle", price: 1200000, bedrooms: 2, bathrooms: 2, area: 1150, type: "sale", status: "available", slug: "modern-apartment-jvc", images: [] },
  { id: "2", title: "Luxury Villa Palm Jumeirah", neighborhood: "Palm Jumeirah", price: 8500000, bedrooms: 5, bathrooms: 6, area: 5200, type: "sale", status: "available", slug: "luxury-villa-palm", images: [] },
  { id: "3", title: "Studio Downtown Dubai", neighborhood: "Downtown Dubai", price: 75000, bedrooms: 0, bathrooms: 1, area: 450, type: "rent", status: "available", slug: "studio-downtown", images: [] },
  { id: "4", title: "Penthouse Business Bay", neighborhood: "Business Bay", price: 12000000, bedrooms: 4, bathrooms: 5, area: 4800, type: "sale", status: "available", slug: "penthouse-business-bay", images: [] },
  { id: "5", title: "Family Townhouse Arabian Ranches", neighborhood: "Arabian Ranches", price: 3200000, bedrooms: 3, bathrooms: 4, area: 2800, type: "sale", status: "available", slug: "townhouse-arabian-ranches", images: [] },
  { id: "6", title: "Marina View Apartment", neighborhood: "Dubai Marina", price: 120000, bedrooms: 1, bathrooms: 1, area: 780, type: "rent", status: "available", slug: "marina-view-apartment", images: [] },
];

const revealEase = [0.16, 1, 0.3, 1] as const;

function mapFeaturedProperty(row: Record<string, unknown>): HomeFeaturedProperty {
  const translation = Array.isArray(row.translation)
    ? (row.translation[0] as Record<string, string> | undefined)
    : (row.translation as Record<string, string> | undefined);
  const images = (
    (row.images as { url: string; is_cover: boolean; position: number }[]) || []
  )
    .slice()
    .sort((a, b) => a.position - b.position);

  return {
    id: String(row.id),
    title: translation?.title || String(row.slug),
    neighborhood: translation?.neighborhood || "",
    slug: translation?.slug_localized || String(row.slug),
    price: Number(row.price),
    bedrooms: Number(row.bedrooms) || 0,
    bathrooms: Number(row.bathrooms) || 0,
    area: Number(row.area_sqft) || 0,
    type: row.listing_type as "sale" | "rent",
    status: String(row.status || "available"),
    images,
  };
}

function coverImageUrl(images: { url: string; is_cover: boolean; position: number }[]) {
  const cover = images.find((img) => img.is_cover === true);
  return cover?.url ?? null;
}

function formatPrice(price: number) {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1).replace(".0", "")}M`;
  if (price >= 1000) return `${Math.round(price / 1000)}K`;
  return `${price}`;
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

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [featuredProperties, setFeaturedProperties] =
    useState<HomeFeaturedProperty[]>(DEMO_PROPERTIES);

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 800], [0, 110]);
  const heroImageScale = useTransform(scrollY, [0, 800], [1.06, 1.14]);
  const heroCover = useMemo(
    () => coverImageUrl(featuredProperties[0]?.images ?? []),
    [featuredProperties]
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchFeaturedProperties() {
      try {
        const supabase = getSupabase();
        const baseQuery = () =>
          supabase
            .from("properties")
            .select(
              "*, translation:property_translations!inner(*), images:property_images(*)"
            )
            .eq("status", "available")
            .not("published_at", "is", null)
            .order("featured", { ascending: false })
            .limit(6);

        let { data, error } = await baseQuery().eq(
          "property_translations.locale",
          locale
        );
        if (error) throw error;

        if ((!data || data.length === 0) && locale !== "en") {
          const fallback = await baseQuery().eq("property_translations.locale", "en");
          if (fallback.error) throw fallback.error;
          data = fallback.data;
        }

        if (!cancelled && data && data.length > 0) {
          setFeaturedProperties(
            data.map((row) => mapFeaturedProperty(row as Record<string, unknown>))
          );
        } else if (!cancelled) {
          setFeaturedProperties(DEMO_PROPERTIES);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setFeaturedProperties(DEMO_PROPERTIES);
      }
    }

    fetchFeaturedProperties();
    return () => {
      cancelled = true;
    };
  }, [locale]);

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
              alt={featuredProperties[0]?.title || "Dubai Property"}
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
              <span>LUXURY REAL ESTATE</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="title-xl max-w-[700px]">
              Discover
              <br />
              <span className="title-italic">Exceptional</span>
              <br />
              Living in Dubai
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
                VIEW PROPERTIES
              </Link>
              <Link href="/contact" className="btn-outline">
                BOOK CONSULTATION
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
            Scroll
          </span>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <Reveal className="mb-12 flex items-end justify-between gap-8">
            <div>
              <div className="label-line label mb-4">
                <span>FEATURED</span>
              </div>
              <h2 className="title-lg">
                Handpicked <span className="title-italic">Properties</span>
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[2px] text-gold"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredProperties.slice(0, 4).map((prop, index) => {
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
                          prop.type === "sale"
                            ? "bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#060D1B]"
                            : "border border-pearl/30 bg-pearl/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-pearl backdrop-blur-sm"
                        }
                      >
                        {prop.type === "sale" ? "FOR SALE" : "FOR RENT"}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="mb-1 text-[10px] uppercase tracking-[3px] text-gold">
                        {prop.neighborhood}
                      </p>
                      <h3 className="title-md text-white">{prop.title}</h3>
                      <p className="mt-2 opacity-0 transition-opacity delay-75 duration-300 group-hover:opacity-100 text-xs text-slate">
                        {prop.bedrooms > 0 ? `${prop.bedrooms} Bed · ` : ""}
                        {prop.bathrooms} Bath · {prop.area.toLocaleString()} sqft
                      </p>
                      <p className="price mt-3">
                        {formatPrice(prop.price)} AED
                        {prop.type === "rent" ? " /yr" : ""}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-tight divider">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <Reveal className="mb-10">
            <div className="label-line label mb-4">
              <span>SERVICES</span>
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
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
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
            <span className="label">WHY MULKEEF</span>
            <span className="h-px w-12 bg-gold" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="title-lg">
              Your trusted partner for
              <br />
              <span className="title-italic">real estate in Dubai</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: ShieldCheck, label: "RERA LICENSED" },
              { icon: Globe2, label: "10+ LANGUAGES" },
              { icon: Zap, label: "FAST EXECUTION" },
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
        <div className="mx-auto w-full max-w-[900px] px-5 text-center md:px-8">
          <Reveal>
            <h2 className="title-lg">
              Begin your <span className="title-italic">property journey</span>
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

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#060D1B] shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] transition-transform duration-300 hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
