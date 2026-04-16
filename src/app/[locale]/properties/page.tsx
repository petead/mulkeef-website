import { Suspense } from "react";
import { resolveAreaIdFromSlug } from "@/lib/area-queries";
import {
  fetchPropertiesForCards,
  rowToListingCard,
} from "@/lib/properties-data";
import PropertiesPageClient from "./PropertiesPageClient";

function pick(
  sp: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  if (!sp) return undefined;
  const v = sp[key];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { locale } = await params;
  const type = pick(searchParams, "type");
  const beds = pick(searchParams, "beds");
  const propType = pick(searchParams, "propType");
  const q = pick(searchParams, "q");
  const areaSlug = pick(searchParams, "area");
  const areaId = areaSlug
    ? await resolveAreaIdFromSlug(locale, areaSlug)
    : undefined;

  const rows = await fetchPropertiesForCards(locale, {
    listingType: type,
    beds,
    propType,
    areaId: areaId || undefined,
  });
  const cards = rows.map(rowToListingCard);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060D1B] pt-24 text-center text-slate">
          …
        </div>
      }
    >
      <PropertiesPageClient
        properties={cards}
        filterActive={{ type, beds, propType, q, area: areaSlug }}
      />
    </Suspense>
  );
}
