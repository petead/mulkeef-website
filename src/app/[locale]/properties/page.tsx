"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Bed,
  Bath,
  Maximize,
  ArrowRight,
  X,
  Heart,
  Building2,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/lib/i18n/routing";
import { cn, formatArea } from "@/lib/utils";
import {
  getProperties,
  getAreaGuideOptions,
  type PropertyWithDetails,
} from "@/lib/supabase";

const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "penthouse",
  "townhouse",
  "office",
  "duplex",
] as const;

const BEDROOM_OPTIONS = [0, 1, 2, 3, 4, 5];

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

const DEMO_RAW = [
  { id: "1", title: "Modern Apartment in JVC", neighborhood: "Jumeirah Village Circle", price: 1200000, bedrooms: 2, bathrooms: 2, area: 1150, listing_type: "sale" as const, property_type: "apartment", status: "available", slug: "modern-apartment-jvc", featured: true, reference_number: "MKF-1001" },
  { id: "2", title: "Luxury Villa Palm Jumeirah", neighborhood: "Palm Jumeirah", price: 8500000, bedrooms: 5, bathrooms: 6, area: 5200, listing_type: "sale" as const, property_type: "villa", status: "available", slug: "luxury-villa-palm", featured: true, reference_number: "MKF-1002" },
  { id: "3", title: "Studio Downtown Dubai", neighborhood: "Downtown Dubai", price: 75000, bedrooms: 0, bathrooms: 1, area: 450, listing_type: "rent" as const, property_type: "apartment", status: "available", slug: "studio-downtown", featured: false, reference_number: "MKF-2001" },
  { id: "4", title: "Penthouse Business Bay", neighborhood: "Business Bay", price: 12000000, bedrooms: 4, bathrooms: 5, area: 4800, listing_type: "sale" as const, property_type: "penthouse", status: "available", slug: "penthouse-business-bay", featured: true, reference_number: "MKF-1003" },
  { id: "5", title: "Family Townhouse Arabian Ranches", neighborhood: "Arabian Ranches", price: 3200000, bedrooms: 3, bathrooms: 4, area: 2800, listing_type: "sale" as const, property_type: "townhouse", status: "available", slug: "townhouse-arabian-ranches", featured: false, reference_number: "MKF-1004" },
  { id: "6", title: "Marina View Apartment", neighborhood: "Dubai Marina", price: 120000, bedrooms: 1, bathrooms: 1, area: 780, listing_type: "rent" as const, property_type: "apartment", status: "available", slug: "marina-view-apartment", featured: false, reference_number: "MKF-2002" },
  { id: "7", title: "Duplex JVC with Garden", neighborhood: "JVC", price: 2100000, bedrooms: 3, bathrooms: 3, area: 2200, listing_type: "sale" as const, property_type: "duplex", status: "available", slug: "duplex-jvc-garden", featured: false, reference_number: "MKF-1005" },
  { id: "8", title: "Office Space DIFC", neighborhood: "DIFC", price: 250000, bedrooms: 0, bathrooms: 2, area: 1500, listing_type: "rent" as const, property_type: "office", status: "available", slug: "office-difc", featured: false, reference_number: "MKF-2003" },
];

const DEMO: CardProperty[] = DEMO_RAW.map((p) => ({
  ...p,
  images: [],
}));

const SALE_PRESET_IDS = [
  "s_lt1m",
  "s_1m_3m",
  "s_3m_5m",
  "s_5m_10m",
  "s_gt10m",
] as const;
const RENT_PRESET_IDS = [
  "r_lt50k",
  "r_50_100k",
  "r_100_150k",
  "r_gt150k",
] as const;

const PRICE_RANGE_BY_ID: Record<
  string,
  { min: number; max?: number }
> = {
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

function mapServerProperty(p: PropertyWithDetails): CardProperty {
  return {
    id: p.id,
    title: p.translation.title,
    neighborhood: p.translation.neighborhood || "",
    slug: p.translation.slug_localized,
    price: Number(p.price),
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    area: Number(p.area_sqft) || 0,
    listing_type: p.listing_type,
    property_type: p.property_type,
    featured: p.featured,
    reference_number: p.reference_number || "",
    images: (p.images || []).map((im) => ({
      url: im.url,
      is_cover: im.is_cover,
      position: im.position,
    })),
  };
}

function compactPrice(price: number) {
  if (price >= 1_000_000)
    return (price / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (price >= 1_000) return (price / 1_000).toFixed(0) + "K";
  return price.toString();
}

function coverImageUrl(images: CardProperty["images"]) {
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const cover = sorted.find((i) => i.is_cover) ?? sorted[0];
  return cover?.url ?? null;
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function PropertiesPageInner() {
  const t = useTranslations();
  const tp = useTranslations("propertiesPage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [rows, setRows] = useState<CardProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [areaOptions, setAreaOptions] = useState<{ slug: string; name: string }[]>(
    []
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(() => sp.get("q") || "");
  const debouncedQ = useDebouncedValue(searchInput, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const listingType = sp.get("listing") === "rent" ? "rent" : "sale";
  const pr = sp.get("pr") || "";
  const areaSlug = sp.get("area") || "";
  const ptype = sp.get("ptype") || "";
  const bedsRaw = sp.get("beds");
  const bedrooms =
    bedsRaw === null || bedsRaw === ""
      ? null
      : Number.isFinite(Number(bedsRaw))
        ? Number(bedsRaw)
        : null;
  const viewMode = sp.get("view") === "list" ? "list" : "grid";

  const replaceQuery = useCallback(
    (updates: Record<string, string | undefined | null>) => {
      const p = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined || v === null || v === "") p.delete(k);
        else p.set(k, v);
      }
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, sp]
  );

  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      document.activeElement === searchInputRef.current
    ) {
      return;
    }
    setSearchInput(sp.get("q") || "");
  }, [sp.toString()]);

  useEffect(() => {
    const qUrl = sp.get("q") || "";
    if (debouncedQ.trim() === (qUrl || "").trim()) return;
    replaceQuery({ q: debouncedQ.trim() || undefined });
  }, [debouncedQ, replaceQuery, sp.toString()]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [data, areas] = await Promise.all([
          getProperties(locale),
          getAreaGuideOptions(locale),
        ]);
        if (cancelled) return;
        setAreaOptions(areas);
        const mapped = (data || []).map(mapServerProperty);
        setRows(mapped.length ? mapped : DEMO);
      } catch {
        if (!cancelled) setRows(DEMO);
      } finally {
        if (!cancelled) setLoading(false);
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
    let list = rows.filter((p) => p.listing_type === listingType);

    if (ptype) list = list.filter((p) => p.property_type === ptype);

    if (bedrooms !== null) {
      list = list.filter((p) => p.bedrooms === bedrooms);
    }

    const range =
      pr && (listingType === "sale" ? pr.startsWith("s_") : pr.startsWith("r_"))
        ? PRICE_RANGE_BY_ID[pr]
        : null;
    if (range) {
      list = list.filter((p) => {
        if (p.price < range.min) return false;
        if (range.max !== undefined && p.price > range.max) return false;
        return true;
      });
    }

    if (activeAreaName) {
      const n = activeAreaName.toLowerCase();
      list = list.filter((p) => {
        const h = p.neighborhood.toLowerCase();
        return h === n || h.includes(n) || n.includes(h);
      });
    }

    const q = (sp.get("q") || "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q)
      );
    }

    return list;
  }, [
    rows,
    listingType,
    ptype,
    bedrooms,
    pr,
    activeAreaName,
    sp,
  ]);

  const setListingType = (next: "sale" | "rent") => {
    replaceQuery({
      listing: next === "sale" ? undefined : "rent",
      pr: undefined,
    });
  };

  const togglePricePreset = (id: string) => {
    const valid =
      listingType === "sale"
        ? SALE_PRESET_IDS.includes(id as (typeof SALE_PRESET_IDS)[number])
        : RENT_PRESET_IDS.includes(id as (typeof RENT_PRESET_IDS)[number]);
    if (!valid) return;
    replaceQuery({ pr: pr === id ? undefined : id });
  };

  const clearFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  const clearPanelFilters = () => {
    replaceQuery({
      pr: undefined,
      area: undefined,
      ptype: undefined,
      beds: undefined,
    });
  };

  const salePresetLabels: Record<(typeof SALE_PRESET_IDS)[number], string> = {
    s_lt1m: tp("priceSale.lt1m"),
    s_1m_3m: tp("priceSale.m1m3m"),
    s_3m_5m: tp("priceSale.m3m5m"),
    s_5m_10m: tp("priceSale.m5m10m"),
    s_gt10m: tp("priceSale.gt10m"),
  };

  const rentPresetLabels: Record<(typeof RENT_PRESET_IDS)[number], string> = {
    r_lt50k: tp("priceRent.lt50k"),
    r_50_100k: tp("priceRent.k50k100k"),
    r_100_150k: tp("priceRent.k100k150k"),
    r_gt150k: tp("priceRent.gt150k"),
  };

  function renderFiltersContent() {
    return (
      <div className="space-y-6">
      <div className="flex items-center justify-between md:hidden">
        <h3 className="font-body text-sm font-bold text-pearl">
          {tp("filtersTitle")}
        </h3>
        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="rounded-lg p-2 text-slate hover:bg-brand-blue/10 hover:text-pearl"
          aria-label={tp("closeFilters")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="hidden items-center justify-between md:flex">
        <h3 className="font-body text-sm font-bold text-pearl">
          {tp("filtersTitle")}
        </h3>
        <button
          type="button"
          onClick={clearPanelFilters}
          className="text-xs font-semibold text-brand-blue-light hover:underline"
        >
          {tp("clearAll")}
        </button>
      </div>

      <div className="md:hidden">
        <button
          type="button"
          onClick={clearPanelFilters}
          className="text-xs font-semibold text-brand-blue-light hover:underline"
        >
          {tp("clearAll")}
        </button>
      </div>

      <div>
        <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
          {tp("priceLabel")}
        </p>
        <div className="flex flex-wrap gap-2">
          {(listingType === "sale" ? SALE_PRESET_IDS : RENT_PRESET_IDS).map(
            (id) => (
              <button
                key={id}
                type="button"
                onClick={() => togglePricePreset(id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                  pr === id
                    ? "border-brand-blue bg-brand-blue/15 text-brand-blue-light"
                    : "border-brand-blue/15 text-slate hover:border-brand-blue/30 hover:text-pearl"
                )}
              >
                {listingType === "sale"
                  ? salePresetLabels[id as (typeof SALE_PRESET_IDS)[number]]
                  : rentPresetLabels[id as (typeof RENT_PRESET_IDS)[number]]}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
          {tp("areaLabel")}
        </p>
        <select
          aria-label={tp("areaLabel")}
          value={areaSlug}
          onChange={(e) =>
            replaceQuery({ area: e.target.value || undefined })
          }
          className="input-field w-full max-w-md"
        >
          <option value="">{tp("areaAll")}</option>
          {areaOptions.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
          {tp("typeLabel")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                replaceQuery({ ptype: ptype === type ? undefined : type })
              }
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                ptype === type
                  ? "border-brand-blue bg-brand-blue/15 text-brand-blue-light"
                  : "border-brand-blue/15 text-slate hover:border-brand-blue/30 hover:text-pearl"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
          {t("property.bedrooms")}
        </p>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() =>
                replaceQuery({
                  beds:
                    bedrooms === num ? undefined : String(num),
                })
              }
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all",
                bedrooms === num
                  ? "border-brand-blue bg-brand-blue/15 text-brand-blue-light"
                  : "border-brand-blue/15 text-slate hover:border-brand-blue/30 hover:text-pearl"
              )}
            >
              {num === 0 ? "S" : num}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn-primary w-full md:hidden"
        onClick={() => setFiltersOpen(false)}
      >
        {tp("apply")}
      </button>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="section-title mb-2">
            {listingType === "sale"
              ? t("property.forSale")
              : t("property.forRent")}
          </h1>
          <p className="text-sm text-slate">
            {loading
              ? tp("loading")
              : tp("countFound", { count: filtered.length })}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="flex rounded-btn border border-brand-blue/10 bg-navy-light p-1">
            {(["sale", "rent"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setListingType(type)}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-semibold transition-all",
                  listingType === type
                    ? "bg-brand-blue text-white"
                    : "text-slate hover:text-pearl"
                )}
              >
                {type === "sale"
                  ? t("property.forSale")
                  : t("property.forRent")}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dark" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="input-field w-full pl-10"
            />
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={cn(
              "btn-outline flex !py-2 items-center justify-center gap-2",
              filtersOpen && "!border-brand-blue/40 !bg-brand-blue/10"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {tp("filters")}
          </button>

          <div className="hidden rounded-btn border border-brand-blue/10 bg-navy-light p-1 sm:flex">
            <button
              type="button"
              onClick={() => replaceQuery({ view: undefined })}
              className={cn(
                "rounded-lg p-2",
                viewMode === "grid"
                  ? "bg-brand-blue/15 text-brand-blue-light"
                  : "text-slate"
              )}
              aria-label={tp("viewGrid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => replaceQuery({ view: "list" })}
              className={cn(
                "rounded-lg p-2",
                viewMode === "list"
                  ? "bg-brand-blue/15 text-brand-blue-light"
                  : "text-slate"
              )}
              aria-label={tp("viewList")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {filtersOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-navy/70 backdrop-blur-sm md:hidden"
              aria-hidden
              onClick={() => setFiltersOpen(false)}
            />
            <div className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-2xl border border-brand-blue/15 border-b-0 bg-navy-light p-6 shadow-2xl shadow-brand-blue/10 md:hidden">
              {renderFiltersContent()}
            </div>
            <div className="card mb-8 hidden animate-fade-in p-6 md:block">
              {renderFiltersContent()}
            </div>
          </>
        )}

        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          )}
        >
          {filtered.map((prop) => {
            const cover = coverImageUrl(prop.images);
            return (
              <article
                key={prop.id}
                className={cn(
                  "card group relative cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/25 hover:shadow-lg",
                  viewMode === "list" && "flex flex-col sm:flex-row"
                )}
              >
                <div
                  className={cn(
                    "relative shrink-0 overflow-hidden bg-gradient-to-br from-brand-blue/15 to-gold/5",
                    viewMode === "grid"
                      ? "h-52"
                      : "h-52 w-full sm:h-auto sm:min-h-[220px] sm:w-56 md:w-64"
                  )}
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote Supabase / CDN URLs
                    <img
                      src={cover}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-gold/10 transition-opacity duration-500",
                      cover ? "opacity-40 group-hover:opacity-55" : "opacity-100"
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    {prop.featured && (
                      <span className="badge-featured">{t("property.featured")}</span>
                    )}
                  </div>
                  <span className="badge-available absolute top-3 right-3">
                    {t("property.available")}
                  </span>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/80 to-transparent pb-3 pl-4 pr-4 pt-12">
                    <span className="font-mono text-lg font-semibold text-gold drop-shadow-md">
                      {compactPrice(prop.price)} AED
                      {prop.listing_type === "rent"
                        ? t("property.perYear")
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <Link
                    href={`/properties/${prop.slug}`}
                    className="block min-w-0 flex-1"
                  >
                    <h3 className="mb-1 font-display text-lg font-bold text-pearl transition-colors group-hover:text-brand-blue-light">
                      {prop.title}
                    </h3>
                    <p className="mb-4 text-sm text-slate">{prop.neighborhood}</p>

                    <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate">
                      {prop.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" /> {prop.bedrooms}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" /> {prop.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="h-3.5 w-3.5" />{" "}
                        {formatArea(prop.area)}
                      </span>
                    </div>

                    <div className="mb-4 flex items-center justify-between text-brand-blue">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2">
                        {t("property.viewDetails")}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>

                  <div className="mt-auto flex items-center justify-between border-t border-brand-blue/10 pt-3">
                    <span className="font-mono text-xs text-slate-dark">
                      {t("property.ref")} {prop.reference_number || "—"}
                    </span>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-blue/20 text-pearl transition-colors hover:border-gold/40 hover:text-gold"
                      aria-label={tp("saveProperty")}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-blue/20 bg-brand-blue/10 text-brand-blue-light">
              <Building2 className="h-10 w-10 opacity-90" />
            </div>
            <h2 className="mb-2 font-display text-xl font-bold text-pearl md:text-2xl">
              {tp("emptyTitle")}
            </h2>
            <p className="mb-8 max-w-md text-sm text-slate">{tp("emptyHint")}</p>
            <button type="button" onClick={clearFilters} className="btn-primary">
              {tp("clearFilters")}
            </button>
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
        <div className="min-h-screen bg-navy pt-24 text-center text-slate">
          …
        </div>
      }
    >
      <PropertiesPageInner />
    </Suspense>
  );
}
