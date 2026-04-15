"use client";

import Image from "next/image";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Heart, Search, SearchX } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { getSupabase } from "@/lib/supabase";

type CardProperty = {
  id: string;
  title: string;
  neighborhood: string;
  slug: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  listing_type: "sale" | "rent";
  property_type: string;
  featured: boolean;
  reference_number: string;
  images: { url: string; is_cover: boolean; position: number }[];
};

const DEMO: CardProperty[] = [
  { id: "1", title: "Modern Apartment in JVC", neighborhood: "Jumeirah Village Circle", price: 1200000, bedrooms: 2, bathrooms: 2, area: 1150, listing_type: "sale", property_type: "apartment", featured: true, reference_number: "MKF-1001", slug: "modern-apartment-jvc", images: [] },
  { id: "2", title: "Luxury Villa Palm Jumeirah", neighborhood: "Palm Jumeirah", price: 8500000, bedrooms: 5, bathrooms: 6, area: 5200, listing_type: "sale", property_type: "villa", featured: true, reference_number: "MKF-1002", slug: "luxury-villa-palm", images: [] },
  { id: "3", title: "Studio Downtown Dubai", neighborhood: "Downtown Dubai", price: 75000, bedrooms: 0, bathrooms: 1, area: 450, listing_type: "rent", property_type: "apartment", featured: false, reference_number: "MKF-2001", slug: "studio-downtown", images: [] },
  { id: "4", title: "Office Space DIFC", neighborhood: "DIFC", price: 250000, bedrooms: 0, bathrooms: 2, area: 1500, listing_type: "rent", property_type: "office", featured: false, reference_number: "MKF-2003", slug: "office-difc", images: [] },
];

const TYPE_OPTIONS = [
  { id: "", label: "All" },
  { id: "apartment", label: "Apartment" },
  { id: "villa", label: "Villa" },
  { id: "townhouse", label: "Townhouse" },
  { id: "studio", label: "Studio" },
  { id: "office", label: "Office" },
] as const;

const BEDROOM_OPTIONS = [
  { id: "", label: "All" },
  { id: "studio", label: "Studio" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4plus", label: "4+" },
] as const;

const PRICE_RANGE_BY_ID: Record<string, { min: number; max?: number }> = {
  s_lt1m: { min: 0, max: 999_999 },
  s_1m_3m: { min: 1_000_000, max: 3_000_000 },
  s_3m_5m: { min: 3_000_000, max: 5_000_000 },
  s_5m_10m: { min: 5_000_000, max: 10_000_000 },
  s_gt10m: { min: 10_000_000 },
  r_lt50k: { min: 0, max: 49_999 },
  r_50_100k: { min: 50_000, max: 100_000 },
  r_100_150k: { min: 100_000, max: 150_000 },
  r_gt150k: { min: 150_000 },
};

function mapSupabaseRow(p: Record<string, unknown>): CardProperty {
  const trRaw = p.translation;
  const tr = Array.isArray(trRaw)
    ? (trRaw[0] as Record<string, string> | undefined)
    : (trRaw as Record<string, string> | undefined);
  const imgsRaw = (p.images as { url: string; is_cover: boolean; position: number }[]) || [];
  const images = [...imgsRaw].sort((a, b) => a.position - b.position);

  return {
    id: String(p.id),
    title: tr?.title || String(p.slug),
    neighborhood: tr?.neighborhood || "",
    slug: tr?.slug_localized || String(p.slug),
    price: Number(p.price),
    bedrooms: Number(p.bedrooms) || 0,
    bathrooms: Number(p.bathrooms) || 0,
    area: Number(p.area_sqft) || 0,
    listing_type: p.listing_type as "sale" | "rent",
    property_type: String(p.property_type),
    featured: Boolean(p.featured),
    reference_number: String(p.reference_number || ""),
    images,
  };
}

function coverImageUrl(images: CardProperty["images"]) {
  const cover = images.find((img) => img.is_cover === true);
  return cover?.url ?? null;
}

function compactPrice(price: number) {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (price >= 1_000) return `${Math.round(price / 1_000)}K`;
  return `${price}`;
}

function filterRowButton(active: boolean) {
  return active
    ? "text-gold border-b border-gold"
    : "text-slate border-b border-transparent hover:text-pearl";
}

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

function PropertiesPageInner() {
  const t = useTranslations();
  const tp = useTranslations("propertiesPage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<CardProperty[]>(DEMO);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const listingType = searchParams.get("listing") === "rent" ? "rent" : "sale";
  const priceKey = searchParams.get("pr") || "";
  const ptype = searchParams.get("ptype") || "";
  const bedsKey = searchParams.get("beds") || "";

  const replaceQuery = useCallback(
    (updates: Record<string, string | undefined>) => {
      const p = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (!v) p.delete(k);
        else p.set(k, v);
      }
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (document.activeElement !== searchInputRef.current) {
      setSearchInput(searchParams.get("q") || "");
    }
  }, [searchParams]);

  useEffect(() => {
    const id = setTimeout(() => {
      replaceQuery({ q: searchInput.trim() || undefined });
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput, replaceQuery]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProperties() {
      setLoading(true);
      try {
        const supabase = getSupabase();
        const base = () =>
          supabase
            .from("properties")
            .select(
              "*, translation:property_translations!inner(*), images:property_images(*)"
            )
            .eq("status", "available")
            .not("published_at", "is", null)
            .order("featured", { ascending: false });

        let { data, error } = await base().eq("property_translations.locale", locale);
        if (error) throw error;

        if ((!data || data.length === 0) && locale !== "en") {
          const fallback = await base().eq("property_translations.locale", "en");
          if (fallback.error) throw fallback.error;
          data = fallback.data;
        }

        if (!cancelled && data && data.length > 0) {
          setProperties(
            data.map((row) => mapSupabaseRow(row as Record<string, unknown>))
          );
        } else if (!cancelled) {
          setProperties(DEMO);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setProperties(DEMO);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProperties();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => p.listing_type === listingType);

    if (ptype) {
      if (ptype === "studio") {
        list = list.filter((p) => p.bedrooms === 0 || p.property_type === "studio");
      } else {
        list = list.filter((p) => p.property_type === ptype);
      }
    }

    if (bedsKey) {
      if (bedsKey === "studio") {
        list = list.filter((p) => p.bedrooms === 0);
      } else if (bedsKey === "4plus") {
        list = list.filter((p) => p.bedrooms >= 4);
      } else {
        const n = Number(bedsKey);
        if (Number.isFinite(n)) list = list.filter((p) => p.bedrooms === n);
      }
    }

    const range = PRICE_RANGE_BY_ID[priceKey];
    if (range) {
      list = list.filter((p) => {
        if (p.price < range.min) return false;
        if (range.max !== undefined && p.price > range.max) return false;
        return true;
      });
    }

    const q = (searchParams.get("q") || "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q)
      );
    }

    return list;
  }, [properties, listingType, ptype, bedsKey, priceKey, searchParams]);

  const salePrices = [
    { id: "", label: "Any" },
    { id: "s_lt1m", label: "< 1M" },
    { id: "s_1m_3m", label: "1-3M" },
    { id: "s_3m_5m", label: "3-5M" },
    { id: "s_5m_10m", label: "5-10M" },
    { id: "s_gt10m", label: "10M+" },
  ];
  const rentPrices = [
    { id: "", label: "Any" },
    { id: "r_lt50k", label: "< 50K" },
    { id: "r_50_100k", label: "50-100K" },
    { id: "r_100_150k", label: "100-150K" },
    { id: "r_gt150k", label: "150K+" },
  ];
  const priceItems = listingType === "sale" ? salePrices : rentPrices;

  const hasActiveFilters = Boolean(
    searchInput.trim() || ptype || bedsKey || priceKey || listingType === "rent"
  );

  return (
    <div className="bg-[#060D1B] pt-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-20 md:px-8">
        <Reveal>
          <div className="label-line label mb-4">
            <span>{tp("filtersTitle")}</span>
          </div>
          <h1 className="title-lg mb-3">
            Curated <span className="title-italic">Properties</span>
          </h1>
          <p className="text-sm text-slate">
            {loading ? tp("loading") : tp("countFound", { count: filtered.length })}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <section className="mt-10 space-y-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => replaceQuery({ listing: undefined, pr: undefined })}
                className={`pb-1 text-[14px] uppercase tracking-[2px] transition-all ${filterRowButton(
                  listingType === "sale"
                )}`}
              >
                {t("property.forSale")}
              </button>
              <span className="h-4 w-px bg-gold/60" />
              <button
                type="button"
                onClick={() => replaceQuery({ listing: "rent", pr: undefined })}
                className={`pb-1 text-[14px] uppercase tracking-[2px] transition-all ${filterRowButton(
                  listingType === "rent"
                )}`}
              >
                {t("property.forRent")}
              </button>
            </div>

            <div className="relative w-full border-b border-slate/40">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
              <input
                ref={searchInputRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="w-full border-0 bg-transparent py-3 pl-7 text-sm text-pearl placeholder:text-slate-dark focus:outline-none"
                style={{ borderBottom: "1px solid transparent" }}
                onFocus={(e) => {
                  e.currentTarget.parentElement!.style.borderBottomColor = "#C9A84C";
                }}
                onBlur={(e) => {
                  e.currentTarget.parentElement!.style.borderBottomColor =
                    "rgba(122,139,167,0.4)";
                }}
              />
            </div>

            <div className="overflow-x-auto whitespace-nowrap">
              <div className="inline-flex min-w-full items-center gap-0">
                {TYPE_OPTIONS.map((opt, i) => (
                  <div key={opt.id || "all"} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => replaceQuery({ ptype: opt.id || undefined })}
                      className={`pb-1 text-xs uppercase tracking-[1px] transition-all ${filterRowButton(
                        ptype === opt.id || (!ptype && !opt.id)
                      )}`}
                    >
                      {opt.label}
                    </button>
                    {i < TYPE_OPTIONS.length - 1 ? (
                      <span className="mx-4 h-3 w-px bg-slate/20" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto whitespace-nowrap">
              <div className="inline-flex min-w-full items-center gap-0">
                {BEDROOM_OPTIONS.map((opt, i) => (
                  <div key={opt.id || "all"} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => replaceQuery({ beds: opt.id || undefined })}
                      className={`pb-1 text-xs uppercase tracking-[1px] transition-all ${filterRowButton(
                        bedsKey === opt.id || (!bedsKey && !opt.id)
                      )}`}
                    >
                      {opt.label}
                    </button>
                    {i < BEDROOM_OPTIONS.length - 1 ? (
                      <span className="mx-4 h-3 w-px bg-slate/20" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[1px]">
              {priceItems.map((opt, i) => (
                <span key={opt.id || "any"} className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => replaceQuery({ pr: opt.id || undefined })}
                    className={`pb-1 transition-all ${filterRowButton(
                      priceKey === opt.id || (!priceKey && !opt.id)
                    )}`}
                  >
                    {opt.label}
                  </button>
                  {i < priceItems.length - 1 ? (
                    <span className="mx-2 text-slate/50">·</span>
                  ) : null}
                </span>
              ))}

              {hasActiveFilters ? (
                <button
                  type="button"
                  className="ml-auto text-xs uppercase tracking-[1px] text-slate hover:text-pearl"
                  onClick={() => {
                    setSearchInput("");
                    router.replace(pathname, { scroll: false });
                  }}
                >
                  Clear
                </button>
              ) : null}
            </div>
          </section>
        </Reveal>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse border border-brand-blue/10 bg-[#0F1D35]/50"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <SearchX className="mx-auto mb-4 h-14 w-14 text-slate-dark" />
            <h2 className="font-display text-4xl text-pearl">{tp("emptyTitle")}</h2>
            <p className="mt-3 text-sm text-slate">{tp("emptyHint")}</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((prop, i) => {
              const cover = coverImageUrl(prop.images);
              const height = i % 2 === 0 ? 380 : 320;
              return (
                <Reveal key={prop.id} delay={(i % 2) * 0.06}>
                  <article className="property-card group" style={{ height }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/18 to-gold/10" />
                    {cover ? (
                      <Image
                        src={cover}
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
                          prop.listing_type === "sale"
                            ? "bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#060D1B]"
                            : "border border-pearl/30 bg-pearl/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-pearl"
                        }
                      >
                        {prop.listing_type === "sale" ? "FOR SALE" : "FOR RENT"}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="mb-1 text-[10px] uppercase tracking-[3px] text-gold">
                        {prop.neighborhood}
                      </p>
                      <h3 className="font-display text-[30px] leading-none text-pearl">
                        {prop.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                        {prop.bedrooms > 0 ? <span>{prop.bedrooms} Bed</span> : <span>Studio</span>}
                        <span>·</span>
                        <span>{prop.bathrooms} Bath</span>
                        <span>·</span>
                        <span>{prop.area.toLocaleString()} sqft</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="price">
                          {compactPrice(prop.price)} AED
                          {prop.listing_type === "rent" ? " /yr" : ""}
                        </p>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/properties/${prop.slug}`}
                            className="inline-flex items-center gap-1 text-xs uppercase tracking-[2px] text-gold opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                          >
                            {t("property.viewDetails")}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center border border-brand-blue/15 transition-colors hover:bg-brand-blue/10"
                            aria-label={t("property.favorite")}
                          >
                            <Heart className="h-4 w-4 text-pearl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060D1B] pt-24 text-center text-slate">
          …
        </div>
      }
    >
      <PropertiesPageInner />
    </Suspense>
  );
}
