"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Search,
  Home,
  Key,
  Building2,
  Settings,
  ArrowRight,
  MessageCircle,
  Bed,
  Bath,
  Maximize,
  Heart,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { WHATSAPP_URL } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

// Placeholder data until Supabase is connected
const DEMO_PROPERTIES = [
  { id: "1", title: "Modern Apartment in JVC", neighborhood: "Jumeirah Village Circle", price: 1200000, bedrooms: 2, bathrooms: 2, area: 1150, type: "sale" as const, status: "available", slug: "modern-apartment-jvc" },
  { id: "2", title: "Luxury Villa Palm Jumeirah", neighborhood: "Palm Jumeirah", price: 8500000, bedrooms: 5, bathrooms: 6, area: 5200, type: "sale" as const, status: "available", slug: "luxury-villa-palm" },
  { id: "3", title: "Studio Downtown Dubai", neighborhood: "Downtown Dubai", price: 75000, bedrooms: 0, bathrooms: 1, area: 450, type: "rent" as const, status: "available", slug: "studio-downtown" },
  { id: "4", title: "Penthouse Business Bay", neighborhood: "Business Bay", price: 12000000, bedrooms: 4, bathrooms: 5, area: 4800, type: "sale" as const, status: "available", slug: "penthouse-business-bay" },
  { id: "5", title: "Family Townhouse Arabian Ranches", neighborhood: "Arabian Ranches", price: 3200000, bedrooms: 3, bathrooms: 4, area: 2800, type: "sale" as const, status: "available", slug: "townhouse-arabian-ranches" },
  { id: "6", title: "Marina View Apartment", neighborhood: "Dubai Marina", price: 120000, bedrooms: 1, bathrooms: 1, area: 780, type: "rent" as const, status: "available", slug: "marina-view-apartment" },
];

function formatPrice(price: number) {
  if (price >= 1000000) return (price / 1000000).toFixed(1).replace(".0", "") + "M";
  if (price >= 1000) return (price / 1000).toFixed(0) + "K";
  return price.toString();
}

const SERVICE_STYLES: Record<
  "buy" | "rent" | "offplan" | "management",
  { box: string; icon: string; borderHover: string }
> = {
  buy: {
    box: "bg-brand-blue/10",
    icon: "text-brand-blue",
    borderHover: "group-hover:border-brand-blue/35",
  },
  rent: {
    box: "bg-gold/10",
    icon: "text-gold",
    borderHover: "group-hover:border-gold/35",
  },
  offplan: {
    box: "bg-emerald/10",
    icon: "text-emerald",
    borderHover: "group-hover:border-emerald/35",
  },
  management: {
    box: "bg-coral/10",
    icon: "text-coral",
    borderHover: "group-hover:border-coral/35",
  },
};

const STATS = [
  { num: 500, labelKey: "stats.properties" as const },
  { num: 1200, labelKey: "stats.clients" as const },
  { num: 8, labelKey: "stats.experience" as const },
  { num: 40, labelKey: "stats.communities" as const },
];

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-navy-gradient" />

        {/* Animated radial gradients */}
        <motion.div
          className="pointer-events-none absolute -left-1/4 top-0 h-[70vh] w-[70vh] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(30,79,216,0.28) 0%, rgba(22,64,176,0.12) 35%, transparent 65%)",
          }}
          animate={{ x: [0, 48, 0], y: [0, 32, 0], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-1/4 bottom-0 h-[65vh] w-[65vh] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(22,64,176,0.22) 0%, rgba(10,22,40,0.2) 40%, transparent 68%)",
          }}
          animate={{ x: [0, -40, 0], y: [0, -28, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/3 top-1/3 h-[50vh] w-[50vh] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 60%)",
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(248 250 252) 1px, transparent 1px), linear-gradient(to bottom, rgb(248 250 252) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(30,79,216,0.1),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,83,0.05),_transparent_50%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
          <motion.div
            className="mb-6 flex items-center justify-center gap-3"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: 0 }}
          >
            <span className="h-[1.5px] w-6 shrink-0 bg-gold" aria-hidden />
            <div className="text-gold font-body font-bold text-xs tracking-[3px] uppercase">
              {t("hero.label")}
            </div>
            <span className="h-[1.5px] w-6 shrink-0 bg-gold" aria-hidden />
          </motion.div>

          <motion.h1
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-pearl leading-[1.1] mb-6"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
          >
            {t("hero.titleBefore")}
            <span className="bg-gradient-to-r from-brand-blue to-gold bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            className="font-body text-slate text-lg sm:text-xl max-w-2xl mx-auto mb-10"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: 0.45 }}
          >
            <div className="flex flex-col sm:flex-row max-w-xl mx-auto gap-3 sm:gap-0 sm:bg-navy-light sm:border sm:border-brand-blue/15 sm:rounded-[14px] sm:p-1.5">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-dark" />
                <input
                  type="text"
                  placeholder={t("hero.searchPlaceholder")}
                  className="w-full pl-11 pr-4 py-3.5 bg-navy-light sm:bg-transparent border border-brand-blue/15 sm:border-none rounded-btn sm:rounded-none text-sm text-pearl placeholder:text-slate-dark focus:outline-none"
                />
              </div>
              <button type="button" className="btn-primary sm:!rounded-[10px] flex items-center justify-center gap-2">
                {t("hero.searchBtn")}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: 0.6 }}
          >
            {["Apartment", "Villa", "Penthouse", "Townhouse", "Off-Plan"].map((type) => (
              <button
                key={type}
                type="button"
                className="rounded-full border border-brand-blue/15 px-4 py-2 text-xs font-semibold text-slate transition-all hover:border-brand-blue/30 hover:bg-brand-blue/5 hover:text-pearl"
              >
                {type}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-brand-blue/30 pt-2">
            <div className="h-2.5 w-1 rounded-full bg-brand-blue/50" />
          </div>
        </div>
      </section>

      {/* ========== FEATURED PROPERTIES ========== */}
      <section className="bg-navy py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <div className="mb-3 text-gold font-body font-bold text-xs tracking-[3px] uppercase">
              {t("featured.label")}
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-pearl leading-tight">
              {t("featured.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_PROPERTIES.map((prop, i) => (
              <article
                key={prop.id}
                className="card group relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/25 hover:shadow-lg"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-brand-blue/15 to-gold/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-brand-blue/10 opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-navy-gradient opacity-25 transition-opacity duration-500 group-hover:opacity-50" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={
                        prop.type === "sale" ? "badge-featured" : "badge bg-brand-blue/20 text-brand-blue"
                      }
                    >
                      {prop.type === "sale" ? t("property.forSale") : t("property.forRent")}
                    </span>
                  </div>
                  <span className="badge-available absolute top-3 right-3">{t("property.available")}</span>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/70 to-transparent pb-3 pl-4 pr-14 pt-16">
                    <span className="font-mono text-lg font-semibold text-gold drop-shadow-md">
                      {formatPrice(prop.price)} AED
                      {prop.type === "rent" ? "/yr" : ""}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-pearl/20 bg-navy/40 text-pearl backdrop-blur-sm transition-colors hover:border-gold/40 hover:bg-navy/60 hover:text-gold"
                    aria-label="Favorite"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="mb-1 font-display text-lg font-bold text-pearl transition-colors group-hover:text-brand-blue-light">
                    {prop.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate">{prop.neighborhood}</p>

                  <div className="mb-4 flex items-center gap-4 text-xs text-slate">
                    {prop.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" /> {prop.bedrooms}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" /> {prop.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="h-3.5 w-3.5" /> {prop.area.toLocaleString()} sqft
                    </span>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue transition-all group-hover:gap-2">
                      {t("property.viewDetails")}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/properties" className="btn-outline inline-flex items-center gap-2">
              {t("featured.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="bg-navy-light py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <div className="mb-3 text-gold font-body font-bold text-xs tracking-[3px] uppercase">
              {t("services.label")}
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-pearl leading-tight">
              {t("services.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {(
              [
                { icon: Home, key: "buy" as const },
                { icon: Key, key: "rent" as const },
                { icon: Building2, key: "offplan" as const },
                { icon: Settings, key: "management" as const },
              ] as const
            ).map((svc) => {
              const st = SERVICE_STYLES[svc.key];
              return (
                <div
                  key={svc.key}
                  className={`card group border p-8 transition-colors duration-300 hover:bg-navy-medium ${st.borderHover}`}
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-transparent transition-all duration-300 group-hover:scale-110 ${st.box} ${st.borderHover}`}
                  >
                    <svc.icon className={`h-6 w-6 ${st.icon}`} />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-pearl">
                    {t(`services.${svc.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate">{t(`services.${svc.key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="border-y border-brand-blue/10 bg-navy py-20 lg:py-28">
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

      {/* ========== CTA ========== */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(30,79,216,0.08),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-5 font-display text-3xl font-bold text-pearl sm:text-4xl">{t("cta.title")}</h2>
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

      {/* ========== WHATSAPP FLOATING BUTTON ========== */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald shadow-lg shadow-emerald/25 transition-transform hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 text-navy" />
      </a>
    </>
  );
}
