"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Search, SearchX } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import type { ListingPropertyCard } from "@/lib/properties-data";
import PropertyFilters, { type PropertyFilterState } from "./PropertyFilters";

function coverImageUrl(images: ListingPropertyCard["images"]) {
  const cover = images.find((img) => img.is_cover === true);
  return cover?.url ?? images[0]?.url ?? null;
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

function PropertiesGrid({
  properties,
}: {
  properties: ListingPropertyCard[];
}) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q),
    );
  }, [properties, q]);

  if (filtered.length === 0) {
    return (
      <div className="py-24 text-center">
        <SearchX className="mx-auto mb-4 h-14 w-14 text-slate-dark" />
        <h2 className="font-display text-4xl text-pearl">
          {t("propertiesPage.emptyTitle")}
        </h2>
        <p className="mt-3 text-sm text-slate">{t("propertiesPage.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
      {filtered.map((prop, i) => {
        const cover = coverImageUrl(prop.images);
        const height = i % 2 === 0 ? 380 : 320;
        return (
          <Reveal key={prop.id} delay={(i % 2) * 0.06}>
            <Link
              href={`/properties/${prop.slug}`}
              className="property-card group block"
              style={{ height }}
            >
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
                    prop.listingType === "sale"
                      ? "bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#060D1B]"
                      : "border border-pearl/30 bg-pearl/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[2px] text-pearl"
                  }
                >
                  {prop.listingType === "sale" ? "FOR SALE" : "FOR RENT"}
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
                  {prop.bedrooms > 0 ? (
                    <span>{prop.bedrooms} Bed</span>
                  ) : (
                    <span>Studio</span>
                  )}
                  <span>·</span>
                  <span>{prop.bathrooms} Bath</span>
                  <span>·</span>
                  <span>{prop.areaSqft.toLocaleString()} sqft</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="price">
                    {prop.priceLabel}
                    {prop.priceSuffix}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[2px] text-gold opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                    {t("property.viewDetails")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

function SearchBar() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    [pathname, router, searchParams],
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

  return (
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
  );
}

export default function PropertiesPageClient({
  properties,
  filterActive,
}: {
  properties: ListingPropertyCard[];
  filterActive: PropertyFilterState;
}) {
  const t = useTranslations();
  const tp = useTranslations("propertiesPage");
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const visibleCount = useMemo(() => {
    if (!q) return properties.length;
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q),
    ).length;
  }, [properties, q]);

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
            {tp("countFound", { count: visibleCount })}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <PropertyFilters active={filterActive} />
          <SearchBar />
        </Reveal>

        <PropertiesGrid properties={properties} />
      </div>
    </div>
  );
}
