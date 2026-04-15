"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, Grid3X3, List, Bed, Bath, Maximize, ArrowRight, X } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

const PROPERTY_TYPES = ["apartment", "villa", "penthouse", "townhouse", "office", "duplex"];
const BEDROOM_OPTIONS = [0, 1, 2, 3, 4, 5];
const PRICE_RANGES_SALE = [
  { label: "Any", min: 0, max: 0 },
  { label: "< 1M", min: 0, max: 1000000 },
  { label: "1M - 3M", min: 1000000, max: 3000000 },
  { label: "3M - 5M", min: 3000000, max: 5000000 },
  { label: "5M - 10M", min: 5000000, max: 10000000 },
  { label: "10M+", min: 10000000, max: 0 },
];

// Demo data — will be replaced by Supabase fetch
const DEMO = [
  { id: "1", title: "Modern Apartment in JVC", neighborhood: "Jumeirah Village Circle", price: 1200000, bedrooms: 2, bathrooms: 2, area: 1150, listing_type: "sale", property_type: "apartment", status: "available", slug: "modern-apartment-jvc", featured: true },
  { id: "2", title: "Luxury Villa Palm Jumeirah", neighborhood: "Palm Jumeirah", price: 8500000, bedrooms: 5, bathrooms: 6, area: 5200, listing_type: "sale", property_type: "villa", status: "available", slug: "luxury-villa-palm", featured: true },
  { id: "3", title: "Studio Downtown Dubai", neighborhood: "Downtown Dubai", price: 75000, bedrooms: 0, bathrooms: 1, area: 450, listing_type: "rent", property_type: "apartment", status: "available", slug: "studio-downtown", featured: false },
  { id: "4", title: "Penthouse Business Bay", neighborhood: "Business Bay", price: 12000000, bedrooms: 4, bathrooms: 5, area: 4800, listing_type: "sale", property_type: "penthouse", status: "available", slug: "penthouse-business-bay", featured: true },
  { id: "5", title: "Family Townhouse Arabian Ranches", neighborhood: "Arabian Ranches", price: 3200000, bedrooms: 3, bathrooms: 4, area: 2800, listing_type: "sale", property_type: "townhouse", status: "available", slug: "townhouse-arabian-ranches", featured: false },
  { id: "6", title: "Marina View Apartment", neighborhood: "Dubai Marina", price: 120000, bedrooms: 1, bathrooms: 1, area: 780, listing_type: "rent", property_type: "apartment", status: "available", slug: "marina-view-apartment", featured: false },
  { id: "7", title: "Duplex JVC with Garden", neighborhood: "JVC", price: 2100000, bedrooms: 3, bathrooms: 3, area: 2200, listing_type: "sale", property_type: "duplex", status: "available", slug: "duplex-jvc-garden", featured: false },
  { id: "8", title: "Office Space DIFC", neighborhood: "DIFC", price: 250000, bedrooms: 0, bathrooms: 2, area: 1500, listing_type: "rent", property_type: "office", status: "available", slug: "office-difc", featured: false },
];

function fmtPrice(price: number) {
  if (price >= 1000000) return (price / 1000000).toFixed(1).replace(".0", "") + "M";
  if (price >= 1000) return (price / 1000).toFixed(0) + "K";
  return price.toString();
}

export default function PropertiesPage() {
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = DEMO.filter((p) => {
    if (p.listing_type !== listingType) return false;
    if (propertyType && p.property_type !== propertyType) return false;
    if (bedrooms !== null && p.bedrooms !== bedrooms) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.neighborhood.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">
            {listingType === "sale" ? t("property.forSale") : t("property.forRent")}
          </h1>
          <p className="text-slate text-sm">{filtered.length} properties found</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Sale / Rent toggle */}
          <div className="flex bg-navy-light rounded-btn p-1 border border-brand-blue/10">
            {(["sale", "rent"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setListingType(type)}
                className={cn(
                  "px-5 py-2 text-sm font-semibold rounded-lg transition-all",
                  listingType === type
                    ? "bg-brand-blue text-white"
                    : "text-slate hover:text-pearl"
                )}
              >
                {type === "sale" ? t("property.forSale") : t("property.forRent")}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-dark" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "btn-outline !py-2 flex items-center gap-2",
              filtersOpen && "!bg-brand-blue/10 !border-brand-blue/40"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* View toggle */}
          <div className="hidden sm:flex bg-navy-light rounded-btn p-1 border border-brand-blue/10">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-lg", viewMode === "grid" ? "bg-brand-blue/15 text-brand-blue" : "text-slate")}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-lg", viewMode === "list" ? "bg-brand-blue/15 text-brand-blue" : "text-slate")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="card p-6 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-body font-bold text-sm text-pearl">Filters</h3>
              <button onClick={() => { setPropertyType(""); setBedrooms(null); }} className="text-xs text-brand-blue hover:underline">
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Property Type */}
              <div>
                <label className="text-xs text-slate font-semibold uppercase tracking-wider mb-2 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setPropertyType(propertyType === type ? "" : type)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all capitalize",
                        propertyType === type
                          ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                          : "border-brand-blue/15 text-slate hover:text-pearl hover:border-brand-blue/30"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-xs text-slate font-semibold uppercase tracking-wider mb-2 block">{t("property.bedrooms")}</label>
                <div className="flex gap-2">
                  {BEDROOM_OPTIONS.map((num) => (
                    <button
                      key={num}
                      onClick={() => setBedrooms(bedrooms === num ? null : num)}
                      className={cn(
                        "w-10 h-10 rounded-lg border text-sm font-semibold transition-all",
                        bedrooms === num
                          ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                          : "border-brand-blue/15 text-slate hover:text-pearl hover:border-brand-blue/30"
                      )}
                    >
                      {num === 0 ? "S" : num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <div className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        )}>
          {filtered.map((prop) => (
            <article
              key={prop.id}
              className={cn(
                "card group cursor-pointer",
                viewMode === "list" && "flex flex-row"
              )}
            >
              {/* Image */}
              <div className={cn(
                "relative bg-gradient-to-br from-brand-blue/15 to-gold/5 overflow-hidden",
                viewMode === "grid" ? "h-52" : "w-48 h-auto flex-shrink-0"
              )}>
                <div className="absolute top-3 left-3 flex gap-2">
                  {prop.featured && <span className="badge-featured">Featured</span>}
                </div>
                <span className="badge-available absolute top-3 right-3">{t("property.available")}</span>
              </div>

              {/* Content */}
              <div className="p-5 flex-1">
                <h3 className="font-display font-bold text-lg text-pearl mb-1 group-hover:text-brand-blue-light transition-colors">
                  {prop.title}
                </h3>
                <p className="text-sm text-slate mb-4">{prop.neighborhood}</p>

                <div className="flex items-center gap-4 text-xs text-slate mb-4">
                  {prop.bedrooms > 0 && (
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {prop.bedrooms}</span>
                  )}
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {prop.bathrooms}</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {prop.area.toLocaleString()} sqft</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-semibold text-gold">
                    {fmtPrice(prop.price)} AED
                    {prop.listing_type === "rent" && <span className="text-xs text-slate font-normal"> /yr</span>}
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

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate text-lg mb-2">No properties found</p>
            <p className="text-slate-dark text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
