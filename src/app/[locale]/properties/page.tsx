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
import { getAreaGuideOptions, getSupabase } from "@/lib/supabase";

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
  { id: "4", title: "Penthouse Business Bay", neighborhood: "Business Bay", price: 12000000, bedrooms: 4, bathrooms: 5, area: 4800, listing_type: "sale", property_type: "penthouse", featured: true, reference_number: "MKF-1003", slug: "penthouse-business-bay", images: [] },
];

const PROPERTY_TYPES = ["apartment", "villa", "penthouse", "townhouse", "office", "duplex"] as const;
const BEDROOM_OPTIONS = [0, 1, 2, 3, 4, 5];

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

function PropertiesPageInner() {
  const t = useTranslations();
  const tp = useTranslations("propertiesPage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<CardProperty[]>(DEMO);
  const [loading, setLoading] = useState(true);
  const [areaOptions, setAreaOptions] = useState<{ slug: string; name: string }[]>([]);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const listingType = searchParams.get("listing") === "rent" ? "rent" : "sale";
  const priceKey = searchParams.get("pr") || "";
  const areaSlug = searchParams.get("area") || "";
  const ptype = searchParams.get("ptype") || "";
  const bedsRaw = searchParams.get("beds");
  const bedrooms = bedsRaw ? Number(bedsRaw) : null;

  const replaceQuery = useCallback(
    (updates: Record<string, string | undefined>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (!v) p.delete(k);
        else p.set(k, v);
      });
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
    }, 280);
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
            .select("*, translation:property_translations!inner(*), images:property_images(*)")
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
          setProperties(data.map((row) => mapSupabaseRow(row as Record<string, unknown>)));
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const areas = await getAreaGuideOptions(locale);
        if (!cancelled) setAreaOptions(areas);
      } catch {
        if (!cancelled) setAreaOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const activeAreaName = useMemo(() => {
    if (!areaSlug) return "";
    return areaOptions.find((a) => a.slug === areaSlug)?.name || "";
  }, [areaSlug, areaOptions]);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => p.listing_type === listingType);
    if (ptype) list = list.filter((p) => p.property_type === ptype);
    if (bedrooms !== null && Number.isFinite(bedrooms)) {
      list = list.filter((p) => p.bedrooms === bedrooms);
    }
    const range = PRICE_RANGE_BY_ID[priceKey];
    if (range) {
      list = list.filter((p) => {
        if (p.price < range.min) return false;
        if (range.max !== undefined && p.price > range.max) return false;
        return true;
      });
    }
    if (activeAreaName) {
      const n = activeAreaName.toLowerCase();
      list = list.filter((p) => p.neighborhood.toLowerCase().includes(n));
    }
    const q = (searchParams.get("q") || "").toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q)
      );
    }
    return list;
  }, [properties, listingType, ptype, bedrooms, priceKey, activeAreaName, searchParams]);

  const pricePresets =
    listingType === "sale"
      ? [
          { id: "", label: tp("priceAny") },
          { id: "s_lt1m", label: tp("priceSale.lt1m") },
          { id: "s_1m_3m", label: tp("priceSale.m1m3m") },
          { id: "s_3m_5m", label: tp("priceSale.m3m5m") },
          { id: "s_5m_10m", label: tp("priceSale.m5m10m") },
          { id: "s_gt10m", label: tp("priceSale.gt10m") },
        ]
      : [
          { id: "", label: tp("priceAny") },
          { id: "r_lt50k", label: tp("priceRent.lt50k") },
          { id: "r_50_100k", label: tp("priceRent.k50k100k") },
          { id: "r_100_150k", label: tp("priceRent.k100k150k") },
          { id: "r_gt150k", label: tp("priceRent.gt150k") },
        ];

  return (
    <div className="bg-[#060D1B] pt-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-20 md:px-8">
        <Reveal>
          <div className="label-line label mb-4">
            <span>COLLECTION</span>
          </div>
          <h1 className="title-lg mb-4">
            Curated <span className="title-italic">Properties</span>
          </h1>
          <p className="text-sm text-slate">
            {loading ? tp("loading") : tp("countFound", { count: filtered.length })}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 border-y border-brand-blue/10 py-6">
            <div className="mb-5 flex flex-wrap items-end gap-8">
              <button
                type="button"
                onClick={() => replaceQuery({ listing: undefined, pr: undefined })}
                className={`text-sm uppercase tracking-[2px] ${
                  listingType === "sale"
                    ? "text-gold underline decoration-gold underline-offset-[10px]"
                    : "text-slate"
                }`}
              >
                {t("property.forSale")}
              </button>
              <button
                type="button"
                onClick={() => replaceQuery({ listing: "rent", pr: undefined })}
                className={`text-sm uppercase tracking-[2px] ${
                  listingType === "rent"
                    ? "text-gold underline decoration-gold underline-offset-[10px]"
                    : "text-slate"
                }`}
              >
                {t("property.forRent")}
              </button>
            </div>

            <div className="mb-5">
              <div className="relative max-w-md">
                <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dark" />
                <input
                  ref={searchInputRef}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("hero.searchPlaceholder")}
                  className="input-line pl-7"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[2px]">
              {pricePresets.map((preset) => (
                <button
                  key={preset.id || "any"}
                  type="button"
                  onClick={() => replaceQuery({ pr: preset.id || undefined })}
                  className={preset.id === priceKey || (!preset.id && !priceKey) ? "text-gold" : "text-slate"}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[2px]">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    replaceQuery({ ptype: ptype === type ? undefined : type })
                  }
                  className={ptype === type ? "text-gold" : "text-slate"}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs uppercase tracking-[2px]">
              {BEDROOM_OPTIONS.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() =>
                    replaceQuery({
                      beds: bedrooms === num ? undefined : String(num),
                    })
                  }
                  className={bedrooms === num ? "text-gold" : "text-slate"}
                >
                  {num === 0 ? "Studio" : `${num} BR`}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <select
                className="input-line max-w-[260px] pr-6"
                value={areaSlug}
                onChange={(e) => replaceQuery({ area: e.target.value || undefined })}
              >
                <option value="">{tp("areaAll")}</option>
                {areaOptions.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="text-xs uppercase tracking-[2px] text-slate hover:text-pearl"
                onClick={() => {
                  setSearchInput("");
                  router.replace(pathname, { scroll: false });
                }}
              >
                {tp("emptyClearAll")}
              </button>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse border border-brand-blue/10 bg-[#0F1D35]/60"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <SearchX className="mx-auto mb-4 h-12 w-12 text-slate-dark" />
            <h2 className="font-display text-3xl text-pearl">{tp("emptyTitle")}</h2>
            <p className="mt-2 text-sm text-slate">{tp("emptyHint")}</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((prop, i) => {
              const cover = coverImageUrl(prop.images);
              return (
                <Reveal key={prop.id} delay={(i % 2) * 0.06}>
                  <article
                    className="property-card group"
                    style={{ height: i % 3 === 0 ? "520px" : "430px" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-gold/10" />
                    {cover ? (
                      <Image
                        src={cover}
                        alt={prop.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B]/95 via-[#060D1B]/25 to-transparent" />

                    <div className="absolute left-5 top-5">
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
                      <h3 className="font-display text-3xl leading-none text-pearl">
                        {prop.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate">
                        {prop.bedrooms > 0 ? `${prop.bedrooms} Bed · ` : ""}
                        {prop.bathrooms} Bath · {prop.area.toLocaleString()} sqft
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="price">
                          {compactPrice(prop.price)} AED
                          {prop.listing_type === "rent" ? " /yr" : ""}
                        </p>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/properties/${prop.slug}`}
                            className="inline-flex items-center gap-1 text-xs uppercase tracking-[2px] text-gold"
                          >
                            {t("property.viewDetails")}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center border border-brand-blue/15"
                            aria-label={t("property.favorite")}
                          >
                            <Heart className="h-4 w-4 text-pearl" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 font-mono text-[11px] text-slate-dark">
                        {t("property.ref")} {prop.reference_number || "—"}
                      </p>
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
