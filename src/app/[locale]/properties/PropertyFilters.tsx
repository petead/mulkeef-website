"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

export type PropertyFilterState = {
  type?: string;
  beds?: string;
  propType?: string;
  q?: string;
  area?: string;
};

function buildQuery(parts: PropertyFilterState) {
  const p = new URLSearchParams();
  if (parts.type) p.set("type", parts.type);
  if (parts.beds) p.set("beds", parts.beds);
  if (parts.propType) p.set("propType", parts.propType);
  if (parts.q) p.set("q", parts.q);
  if (parts.area) p.set("area", parts.area);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function rowActive(active: boolean) {
  return active
    ? "pb-1 text-xs uppercase tracking-[1px] text-gold border-b border-gold"
    : "pb-1 text-xs uppercase tracking-[1px] text-slate border-b border-transparent hover:text-pearl";
}

function saleRentActive(active: boolean) {
  return active
    ? "pb-1 text-[14px] uppercase tracking-[2px] text-gold border-b border-gold"
    : "pb-1 text-[14px] uppercase tracking-[2px] text-slate border-b border-transparent hover:text-pearl";
}

const PROP_TYPE_IDS = ["", "apartment", "villa", "townhouse", "studio", "office"] as const;

const BED_IDS = ["", "studio", "1", "2", "3", "4plus"] as const;

export default function PropertyFilters({ active }: { active: PropertyFilterState }) {
  const tp = useTranslations("propertiesPage");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();

  const propTypes = PROP_TYPE_IDS.map((id) => ({
    id,
    label:
      id === ""
        ? tp("all")
        : id === "apartment"
          ? tp("typeApartment")
          : id === "villa"
            ? tp("typeVilla")
            : id === "townhouse"
              ? tp("typeTownhouse")
              : id === "studio"
                ? tp("typeStudio")
                : tp("typeOffice"),
  }));

  const bedOpts = BED_IDS.map((id) => ({
    id,
    label: id === "" ? tp("all") : id === "studio" ? tc("studio") : id,
  }));
  const qLive = searchParams.get("q")?.trim() || active.q;
  const base: PropertyFilterState = {
    type: active.type,
    beds: active.beds,
    propType: active.propType,
    q: qLive || undefined,
    area: active.area,
  };

  const withoutType = {
    beds: base.beds,
    propType: base.propType,
    q: base.q,
    area: base.area,
  };
  const saleHref = `/properties${buildQuery({ ...withoutType, type: "sale" })}`;
  const rentHref = `/properties${buildQuery({ ...withoutType, type: "rent" })}`;
  const allTypesHref = `/properties${buildQuery(withoutType)}`;

  return (
    <section className="mt-10 space-y-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label={tp("listing")}>
        <Link href={allTypesHref} className={saleRentActive(!base.type)}>
          {tp("all")}
        </Link>
        <span className="hidden h-4 w-px bg-gold/50 sm:block" aria-hidden />
        <Link href={saleHref} className={saleRentActive(base.type === "sale")}>
          {tp("forSaleTab")}
        </Link>
        <span className="h-4 w-px bg-gold/50" aria-hidden />
        <Link href={rentHref} className={saleRentActive(base.type === "rent")}>
          {tp("forRentTab")}
        </Link>
      </div>

      <div className="overflow-x-auto whitespace-nowrap" aria-label={tp("type")}>
        <div className="inline-flex min-w-full items-center gap-0">
          {propTypes.map((opt, i) => {
            const href = `/properties${buildQuery({
              type: base.type,
              beds: base.beds,
              q: base.q,
              area: base.area,
              propType: opt.id || undefined,
            })}`;
            const isActive = opt.id ? base.propType === opt.id : !base.propType;
            return (
              <div key={opt.id || "all"} className="inline-flex items-center">
                <Link href={href} className={rowActive(isActive)}>
                  {opt.label}
                </Link>
                {i < propTypes.length - 1 ? (
                  <span className="mx-4 h-3 w-px bg-slate/20" aria-hidden />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto whitespace-nowrap" aria-label={tp("bedrooms")}>
        <div className="inline-flex min-w-full items-center gap-0">
          {bedOpts.map((opt, i) => {
            const href = `/properties${buildQuery({
              type: base.type,
              propType: base.propType,
              q: base.q,
              area: base.area,
              beds: opt.id || undefined,
            })}`;
            const isActive = opt.id ? base.beds === opt.id : !base.beds;
            return (
              <div key={opt.id || "all-beds"} className="inline-flex items-center">
                <Link href={href} className={rowActive(isActive)}>
                  {opt.label}
                </Link>
                {i < bedOpts.length - 1 ? (
                  <span className="mx-4 h-3 w-px bg-slate/20" aria-hidden />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
