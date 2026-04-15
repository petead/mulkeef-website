import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyDetailClient, {
  type PropertyDetailAgent,
  type PropertyDetailImage,
  type PropertyDetailRecord,
  type SimilarPropertyCard,
} from "./PropertyDetailClient";

type TranslationRow = {
  id: string;
  locale: string;
  title: string;
  slug_localized: string;
  description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  short_description?: string | null;
  neighborhood?: string | null;
  highlights?: string[] | null;
};

type PropertyRow = {
  id: string;
  slug: string;
  price: number;
  currency?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqft?: number | null;
  parking?: number | null;
  furnished?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  property_type: string;
  listing_type: "sale" | "rent";
  reference_number?: string | null;
  amenities?: Record<string, unknown> | null;
  images?: PropertyDetailImage[] | null;
  agent?: PropertyDetailAgent[] | PropertyDetailAgent | null;
};

type PropertyTranslationWithJoin = TranslationRow & {
  property: PropertyRow[] | PropertyRow | null;
};

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing Supabase env vars for property detail page");
  }
  return createClient(url, anon);
}

function sanitizeHtml(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
}

function normalizeJoinedProperty(row: PropertyTranslationWithJoin): {
  translation: TranslationRow;
  property: PropertyRow;
} | null {
  const property = Array.isArray(row.property) ? row.property[0] : row.property;
  if (!property) return null;
  return { translation: row, property };
}

async function fetchPropertyBySlug(locale: string, slug: string) {
  const supabase = getSupabaseServerClient();

  async function queryForLocale(targetLocale: string) {
    const { data, error } = await supabase
      .from("property_translations")
      .select(
        `
        *,
        property:properties!inner(
          *,
          images:property_images(*),
          agent:agents(*)
        )
      `
      )
      .eq("slug_localized", slug)
      .eq("locale", targetLocale)
      .single();

    if (error || !data) return null;
    return {
      row: data as PropertyTranslationWithJoin,
      localeUsed: targetLocale,
    };
  }

  const primary = await queryForLocale(locale);
  if (primary) return primary;
  if (locale !== "en") {
    const fallback = await queryForLocale("en");
    if (fallback) return fallback;
  }
  return null;
}

async function fetchSimilarProperties(params: {
  currentPropertyId: string;
  listingType: "sale" | "rent";
  price: number;
  locale: string;
}): Promise<SimilarPropertyCard[]> {
  const supabase = getSupabaseServerClient();
  const minPrice = Math.max(0, Math.floor(params.price * 0.7));
  const maxPrice = Math.ceil(params.price * 1.3);

  async function query(localeToUse: string) {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        id,
        slug,
        price,
        listing_type,
        bedrooms,
        bathrooms,
        area_sqft,
        translation:property_translations!inner(title, neighborhood, slug_localized, locale),
        images:property_images(url, is_cover, position)
      `
      )
      .eq("status", "available")
      .not("published_at", "is", null)
      .eq("listing_type", params.listingType)
      .eq("property_translations.locale", localeToUse)
      .neq("id", params.currentPropertyId)
      .gte("price", minPrice)
      .lte("price", maxPrice)
      .order("featured", { ascending: false })
      .limit(3);

    if (error) return null;
    return (data || []) as Record<string, unknown>[];
  }

  let rows = await query(params.locale);
  if ((!rows || rows.length === 0) && params.locale !== "en") {
    rows = await query("en");
  }
  if (!rows || rows.length === 0) return [];

  return rows.map((row) => {
    const trRaw = row.translation as Record<string, unknown>[] | Record<string, unknown> | undefined;
    const translation = Array.isArray(trRaw) ? trRaw[0] : trRaw;
    const images =
      ((row.images as PropertyDetailImage[]) || []).slice().sort((a, b) => a.position - b.position);
    return {
      id: String(row.id),
      title: String(translation?.title || row.slug || "Property"),
      neighborhood: String(translation?.neighborhood || ""),
      slug: String(translation?.slug_localized || row.slug || ""),
      listingType: row.listing_type as "sale" | "rent",
      price: Number(row.price) || 0,
      bedrooms: Number(row.bedrooms) || 0,
      bathrooms: Number(row.bathrooms) || 0,
      areaSqft: Number(row.area_sqft) || 0,
      images,
    };
  });
}

async function getPagePayload(locale: string, slug: string) {
  const result = await fetchPropertyBySlug(locale, slug);
  if (!result) return null;

  const normalized = normalizeJoinedProperty(result.row);
  if (!normalized) return null;

  const { translation, property } = normalized;
  const images = ((property.images || []) as PropertyDetailImage[])
    .slice()
    .sort((a, b) => a.position - b.position);
  const agentRaw = property.agent;
  const agent = Array.isArray(agentRaw) ? agentRaw[0] : agentRaw || null;

  const record: PropertyDetailRecord = {
    id: String(property.id),
    slug: String(translation.slug_localized || property.slug),
    listingType: property.listing_type,
    propertyType: property.property_type,
    title: translation.title,
    neighborhood: translation.neighborhood || "",
    descriptionHtml: sanitizeHtml(translation.description || ""),
    shortDescription: translation.short_description || "",
    metaTitle: translation.meta_title || "",
    metaDescription: translation.meta_description || "",
    price: Number(property.price) || 0,
    currency: property.currency || "AED",
    bedrooms: Number(property.bedrooms) || 0,
    bathrooms: Number(property.bathrooms) || 0,
    areaSqft: Number(property.area_sqft) || 0,
    parking: Number(property.parking) || 0,
    furnished: Boolean(property.furnished),
    latitude: property.latitude ?? null,
    longitude: property.longitude ?? null,
    referenceNumber: property.reference_number || "",
    amenities: (property.amenities as Record<string, unknown>) || {},
    highlights: translation.highlights || [],
    images,
    agent: (agent as PropertyDetailAgent) || null,
    localeUsed: result.localeUsed,
  };

  const similar = await fetchSimilarProperties({
    currentPropertyId: record.id,
    listingType: record.listingType,
    price: record.price,
    locale: result.localeUsed,
  });

  return { record, similar };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const payload = await getPagePayload(locale, slug);
  if (!payload) {
    return {
      title: "Property | MULKEEF Real Estate",
    };
  }

  const cover =
    payload.record.images.find((img) => img.is_cover) || payload.record.images[0];

  const metaTitle = payload.record.metaTitle || payload.record.title;
  const metaDescription =
    payload.record.metaDescription ||
    payload.record.shortDescription ||
    payload.record.neighborhood;

  return {
    title: `${metaTitle} | MULKEEF Real Estate`,
    description: metaDescription,
    openGraph: {
      title: payload.record.title,
      description: payload.record.shortDescription || metaDescription,
      images: cover?.url ? [{ url: cover.url }] : [],
      type: "website",
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const payload = await getPagePayload(locale, slug);
  if (!payload) {
    notFound();
  }

  const { record, similar } = payload;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: record.title,
    description: record.shortDescription || record.metaDescription || "",
    url: `https://www.mulkeef.com/${locale}/properties/${record.slug}`,
    image: record.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: record.price,
      priceCurrency: record.currency || "AED",
      availability: "https://schema.org/InStock",
    },
    numberOfRooms: record.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: record.areaSqft,
      unitCode: "FTK",
    },
    geo:
      record.latitude && record.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: record.latitude,
            longitude: record.longitude,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailClient property={record} similar={similar} locale={locale} />
    </>
  );
}
