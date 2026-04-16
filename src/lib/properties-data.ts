import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

export const PROPERTY_CARD_SELECT = `
  *,
  translations:property_translations!inner(title, slug_localized, description, short_description, neighborhood),
  images:property_images(url, position, is_cover)
`;

export type PropertyImageRow = {
  url: string;
  position: number;
  is_cover: boolean;
};

export type PropertyTranslationRow = {
  title: string;
  slug_localized: string;
  description?: string | null;
  short_description?: string | null;
  neighborhood?: string | null;
};

export type PropertyRowFromDb = {
  id: string;
  slug: string;
  price: number;
  display_price?: string | null;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  listing_type: "sale" | "rent";
  property_type: string;
  featured?: boolean;
  status: string;
  reference_number?: string | null;
  published_at?: string | null;
  translations: PropertyTranslationRow[] | PropertyTranslationRow;
  images: PropertyImageRow[] | null;
};

export function normalizeTranslation(
  row: PropertyRowFromDb,
): PropertyTranslationRow | null {
  const t = row.translations;
  if (Array.isArray(t)) return t[0] ?? null;
  return t ?? null;
}

export function orderedImages(row: PropertyRowFromDb): PropertyImageRow[] {
  const imgs = [...(row.images || [])];
  return imgs.sort((a, b) => a.position - b.position);
}

export function coverImageFromProperty(row: PropertyRowFromDb): string | null {
  const imgs = orderedImages(row);
  const cover = imgs.find((i) => i.is_cover);
  return cover?.url ?? imgs[0]?.url ?? null;
}

export function formatListingPrice(
  row: Pick<PropertyRowFromDb, "price" | "display_price" | "listing_type">,
): string {
  if (row.display_price && String(row.display_price).trim()) {
    return String(row.display_price).trim();
  }
  const n = Number(row.price) || 0;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);
}

export type ListingFilters = {
  listingType?: string;
  beds?: string;
  propType?: string;
  /** Filter by `area_guides.id` when known */
  areaId?: string;
};

function buildPropertiesQuery(
  supabase: SupabaseClient,
  locale: string,
  filters: ListingFilters,
) {
  let q = supabase
    .from("properties")
    .select(PROPERTY_CARD_SELECT)
    .eq("property_translations.locale", locale)
    .eq("status", "available")
    .not("published_at", "is", null);

  if (filters.listingType === "sale" || filters.listingType === "rent") {
    q = q.eq("listing_type", filters.listingType);
  }
  if (filters.propType) {
    q = q.eq("property_type", filters.propType);
  }
  if (filters.beds) {
    if (filters.beds === "studio") {
      q = q.eq("bedrooms", 0);
    } else if (filters.beds === "4plus") {
      q = q.gte("bedrooms", 4);
    } else {
      const n = parseInt(filters.beds, 10);
      if (!Number.isNaN(n)) q = q.eq("bedrooms", n);
    }
  }
  if (filters.areaId) {
    q = q.eq("area_id", filters.areaId);
  }

  return q
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });
}

export async function fetchPropertiesForCards(
  locale: string,
  filters: ListingFilters,
  limit?: number,
): Promise<PropertyRowFromDb[]> {
  const supabase = getSupabase();

  let query = buildPropertiesQuery(supabase, locale, filters);
  if (typeof limit === "number") {
    query = query.limit(limit);
  }
  let { data, error } = await query;

  if (error) {
    console.error("fetchPropertiesForCards:", error);
    return [];
  }

  if (!data?.length && locale !== "en") {
    let fq = buildPropertiesQuery(supabase, "en", filters);
    if (typeof limit === "number") {
      fq = fq.limit(limit);
    }
    const fb = await fq;
    if (fb.error) {
      console.error("fetchPropertiesForCards fallback:", fb.error);
      return [];
    }
    data = fb.data;
  }

  return (data || []) as PropertyRowFromDb[];
}

export function rowToHomeCard(row: PropertyRowFromDb) {
  const tr = normalizeTranslation(row);
  const images = orderedImages(row);
  const hasCustomPrice = Boolean(row.display_price && String(row.display_price).trim());
  return {
    id: row.id,
    title: tr?.title || row.slug,
    neighborhood: tr?.neighborhood || "",
    slug: tr?.slug_localized || row.slug,
    priceLabel: formatListingPrice(row),
    priceRaw: Number(row.price) || 0,
    listingType: row.listing_type,
    bedrooms: Number(row.bedrooms) || 0,
    bathrooms: Number(row.bathrooms) || 0,
    areaSqft: Number(row.area_sqft) || 0,
    images,
    priceSuffix:
      row.listing_type === "rent" && !hasCustomPrice ? " /yr" : "",
  };
}

export type HomePropertyCard = ReturnType<typeof rowToHomeCard>;

export function rowToListingCard(row: PropertyRowFromDb) {
  const base = rowToHomeCard(row);
  return {
    ...base,
    property_type: row.property_type,
    featured: Boolean(row.featured),
    reference_number: String(row.reference_number || ""),
  };
}

export type ListingPropertyCard = ReturnType<typeof rowToListingCard>;
