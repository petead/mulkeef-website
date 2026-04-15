import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import { Search, Home, Key, Building2, Settings, ArrowRight, MessageCircle, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { WHATSAPP_URL } from "@/lib/utils";

// Placeholder data until Supabase is connected
const DEMO_PROPERTIES = [
  { id: "1", title: "Modern Apartment in JVC", neighborhood: "Jumeirah Village Circle", price: 1200000, bedrooms: 2, bathrooms: 2, area: 1150, type: "sale", status: "available", slug: "modern-apartment-jvc" },
  { id: "2", title: "Luxury Villa Palm Jumeirah", neighborhood: "Palm Jumeirah", price: 8500000, bedrooms: 5, bathrooms: 6, area: 5200, type: "sale", status: "available", slug: "luxury-villa-palm" },
  { id: "3", title: "Studio Downtown Dubai", neighborhood: "Downtown Dubai", price: 75000, bedrooms: 0, bathrooms: 1, area: 450, type: "rent", status: "available", slug: "studio-downtown" },
  { id: "4", title: "Penthouse Business Bay", neighborhood: "Business Bay", price: 12000000, bedrooms: 4, bathrooms: 5, area: 4800, type: "sale", status: "available", slug: "penthouse-business-bay" },
  { id: "5", title: "Family Townhouse Arabian Ranches", neighborhood: "Arabian Ranches", price: 3200000, bedrooms: 3, bathrooms: 4, area: 2800, type: "sale", status: "available", slug: "townhouse-arabian-ranches" },
  { id: "6", title: "Marina View Apartment", neighborhood: "Dubai Marina", price: 120000, bedrooms: 1, bathrooms: 1, area: 780, type: "rent", status: "available", slug: "marina-view-apartment" },
];

function formatPrice(price: number) {
  if (price >= 1000000) return (price / 1000000).toFixed(1).replace(".0", "") + "M";
  if (price >= 1000) return (price / 1000).toFixed(0) + "K";
  return price.toString();
}

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-navy-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(30,79,216,0.12),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,168,83,0.06),_transparent_50%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
          <div className="section-label mb-6 animate-fade-in">{t("hero.label")}</div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-pearl leading-[1.1] mb-6 animate-fade-up">
            {t("hero.title")}
          </h1>

          <p className="font-body text-slate text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            {t("hero.subtitle")}
          </p>

          {/* Search Bar */}
          <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-col sm:flex-row max-w-xl mx-auto gap-3 sm:gap-0 sm:bg-navy-light sm:border sm:border-brand-blue/15 sm:rounded-[14px] sm:p-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-dark" />
                <input
                  type="text"
                  placeholder={t("hero.searchPlaceholder")}
                  className="w-full pl-11 pr-4 py-3.5 bg-navy-light sm:bg-transparent border border-brand-blue/15 sm:border-none rounded-btn sm:rounded-none text-sm text-pearl placeholder:text-slate-dark focus:outline-none"
                />
              </div>
              <button className="btn-primary sm:!rounded-[10px] flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                {t("hero.searchBtn")}
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-up" style={{ animationDelay: "0.45s" }}>
            {["Apartment", "Villa", "Penthouse", "Townhouse", "Off-Plan"].map((type) => (
              <button
                key={type}
                className="px-4 py-2 text-xs font-semibold text-slate border border-brand-blue/15 rounded-full hover:text-pearl hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-brand-blue/30 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-brand-blue/50" />
          </div>
        </div>
      </section>

      {/* ========== FEATURED PROPERTIES ========== */}
      <section className="py-20 lg:py-28 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-label mb-3">{t("featured.label")}</div>
            <h2 className="section-title">{t("featured.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_PROPERTIES.map((prop, i) => (
              <article
                key={prop.id}
                className="card group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Image placeholder */}
                <div className="relative h-52 bg-gradient-to-br from-brand-blue/15 to-gold/5 overflow-hidden">
                  <div className="absolute inset-0 bg-navy-gradient opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={prop.type === "sale" ? "badge-featured" : "badge bg-brand-blue/20 text-brand-blue"}>
                      {prop.type === "sale" ? t("property.forSale") : t("property.forRent")}
                    </span>
                  </div>
                  <span className="badge-available absolute top-3 right-3">
                    {t("property.available")}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-pearl mb-1 group-hover:text-brand-blue-light transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-slate mb-4">{prop.neighborhood}</p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-xs text-slate mb-4">
                    {prop.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" /> {prop.bedrooms}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" /> {prop.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5" /> {prop.area.toLocaleString()} sqft
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-semibold text-gold">
                      {formatPrice(prop.price)} AED
                    </span>
                    <span className="text-brand-blue text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t("property.viewDetails")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View All */}
          <div className="text-center mt-12">
            <Link href="/properties" className="btn-outline inline-flex items-center gap-2">
              {t("featured.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="py-20 lg:py-28 bg-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-label mb-3">{t("services.label")}</div>
            <h2 className="section-title">{t("services.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Home, key: "buy", color: "brand-blue" },
              { icon: Key, key: "rent", color: "gold" },
              { icon: Building2, key: "offplan", color: "emerald" },
              { icon: Settings, key: "management", color: "coral" },
            ].map((svc) => (
              <div
                key={svc.key}
                className="card p-8 group hover:bg-navy-medium transition-colors duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-${svc.color}/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <svc.icon className={`w-6 h-6 text-${svc.color}`} />
                </div>
                <h3 className="font-display font-bold text-xl text-pearl mb-3">
                  {t(`services.${svc.key}.title`)}
                </h3>
                <p className="text-sm text-slate leading-relaxed">
                  {t(`services.${svc.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="py-16 bg-navy border-y border-brand-blue/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: t("stats.properties") },
              { value: "1,200+", label: t("stats.clients") },
              { value: "8+", label: t("stats.experience") },
              { value: "40+", label: t("stats.communities") },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-mono text-3xl lg:text-4xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,79,216,0.08),_transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-pearl mb-5">
            {t("cta.title")}
          </h2>
          <p className="text-slate text-lg mb-10 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gold inline-flex items-center justify-center gap-2">
              {t("cta.btn")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              className="btn-outline inline-flex items-center justify-center gap-2 !border-emerald/30 hover:!bg-emerald/5"
            >
              <MessageCircle className="w-4 h-4 text-emerald" />
              {t("cta.whatsapp")}
            </a>
          </div>
        </div>
      </section>

      {/* ========== WHATSAPP FLOATING BUTTON ========== */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald rounded-full flex items-center justify-center shadow-lg shadow-emerald/25 hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-navy" />
      </a>
    </>
  );
}
