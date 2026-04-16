"use client";

import { useSearchParams } from "next/navigation";
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

const PROP_TYPES: { id: string; label: string }[] = [
  { id: "", label: "All" },
  { id: "apartment", label: "Apartment" },
  { id: "villa", label: "Villa" },
  { id: "townhouse", label: "Townhouse" },
  { id: "studio", label: "Studio" },
  { id: "office", label: "Office" },
];

const BED_OPTS: { id: string; label: string }[] = [
  { id: "", label: "All" },
  { id: "studio", label: "Studio" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4plus", label: "4+" },
];

export default function PropertyFilters({ active }: { active: PropertyFilterState }) {
  const searchParams = useSearchParams();
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link href={allTypesHref} className={saleRentActive(!base.type)}>
          All
        </Link>
        <span className="hidden h-4 w-px bg-gold/50 sm:block" aria-hidden />
        <Link href={saleHref} className={saleRentActive(base.type === "sale")}>
          For sale
        </Link>
        <span className="h-4 w-px bg-gold/50" aria-hidden />
        <Link href={rentHref} className={saleRentActive(base.type === "rent")}>
          For rent
        </Link>
      </div>

      <div className="overflow-x-auto whitespace-nowrap">
        <div className="inline-flex min-w-full items-center gap-0">
          {PROP_TYPES.map((opt, i) => {
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
                {i < PROP_TYPES.length - 1 ? (
                  <span className="mx-4 h-3 w-px bg-slate/20" aria-hidden />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto whitespace-nowrap">
        <div className="inline-flex min-w-full items-center gap-0">
          {BED_OPTS.map((opt, i) => {
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
                {i < BED_OPTS.length - 1 ? (
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
