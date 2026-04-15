import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
let _serverSupabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  if (!_supabase) {
    _supabase = createClient(url, anonKey);
  }
  return _supabase;
}

// Server-side client with service role for admin operations
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  if (!_serverSupabase) {
    _serverSupabase = createClient(url, serviceRoleKey);
  }
  return _serverSupabase;
}

// ============================================
// Types
// ============================================

export interface Property {
  id: string;
  slug: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  latitude: number;
  longitude: number;
  property_type: string;
  listing_type: "sale" | "rent";
  status: "available" | "sold" | "rented" | "reserved";
  featured: boolean;
  parking: number;
  developer: string;
  reference_number: string;
  published_at: string;
  created_at: string;
}

export interface PropertyTranslation {
  id: string;
  property_id: string;
  locale: string;
  title: string;
  slug_localized: string;
  description: string;
  meta_title: string;
  meta_description: string;
  neighborhood: string;
  highlights: string[];
  og_image_alt: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  position: number;
  is_cover: boolean;
}

export interface PropertyWithDetails extends Property {
  translation: PropertyTranslation;
  images: PropertyImage[];
}

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  source_page?: string;
  intent: "buy" | "rent" | "offplan" | "general" | "valuation";
  property_id?: string;
  locale?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// ============================================
// Data fetching helpers
// ============================================

export async function getProperties(
  locale: string,
  filters?: {
    listing_type?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    neighborhood?: string;
    featured?: boolean;
  }
) {
  let query = getSupabase()
    .from("properties")
    .select(
      `
      *,
      translation:property_translations!inner(*),
      images:property_images(*)
    `
    )
    .eq("property_translations.locale", locale)
    .eq("status", "available")
    .not("published_at", "is", null)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (filters?.listing_type) {
    query = query.eq("listing_type", filters.listing_type);
  }
  if (filters?.property_type) {
    query = query.eq("property_type", filters.property_type);
  }
  if (filters?.min_price) {
    query = query.gte("price", filters.min_price);
  }
  if (filters?.max_price) {
    query = query.lte("price", filters.max_price);
  }
  if (filters?.bedrooms) {
    query = query.eq("bedrooms", filters.bedrooms);
  }
  if (filters?.featured) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    translation: Array.isArray(p.translation) ? p.translation[0] : p.translation,
    images: (p.images || []).sort((a: any, b: any) => a.position - b.position),
  })) as PropertyWithDetails[];
}

export async function getPropertyBySlug(locale: string, slug: string) {
  const { data, error } = await getSupabase()
    .from("property_translations")
    .select(
      `
      *,
      property:properties!inner(
        *,
        images:property_images(*)
      )
    `
    )
    .eq("locale", locale)
    .eq("slug_localized", slug)
    .single();

  if (error || !data) return null;

  return {
    ...data.property,
    translation: { ...data, property: undefined },
    images: (data.property.images || []).sort(
      (a: any, b: any) => a.position - b.position
    ),
  } as PropertyWithDetails;
}

export async function getFeaturedProperties(locale: string, limit = 6) {
  return getProperties(locale, { featured: true });
}

/** Neighborhood / area options for filters (localized names). */
export async function getAreaGuideOptions(
  locale: string
): Promise<{ slug: string; name: string }[]> {
  const { data, error } = await getSupabase()
    .from("area_translations")
    .select(
      `
      name,
      area:area_guides!inner(slug)
    `
    )
    .eq("locale", locale)
    .order("name");

  if (error) {
    console.error("Error fetching area guides:", error);
    return [];
  }

  return (data || [])
    .map((row: any) => {
      const area = Array.isArray(row.area) ? row.area[0] : row.area;
      return {
        slug: (area?.slug as string) || "",
        name: (row.name as string) || "",
      };
    })
    .filter((row) => row.slug && row.name);
}

export async function submitLead(lead: Lead) {
  const { data, error } = await getSupabase()
    .from("leads")
    .insert([lead])
    .select();

  if (error) {
    console.error("Error submitting lead:", error);
    return null;
  }

  return data?.[0];
}
