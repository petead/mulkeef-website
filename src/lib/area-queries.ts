import { getSupabase } from "@/lib/supabase";

const AREA_LIST_SELECT = `
  *,
  translations:area_translations!inner(
    name,
    slug_localized,
    description,
    meta_title,
    meta_description,
    lifestyle
  )
`;

export type AreaGuideRow = {
  id: string;
  slug: string;
  cover_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  avg_price_sale?: number | null;
  avg_price_rent?: number | null;
  translations:
    | {
        name: string;
        slug_localized: string;
        description?: string | null;
        meta_title?: string | null;
        meta_description?: string | null;
        lifestyle?: string | null;
        highlights?: unknown;
      }
    | Array<{
        name: string;
        slug_localized: string;
        description?: string | null;
        meta_title?: string | null;
        meta_description?: string | null;
        lifestyle?: string | null;
        highlights?: unknown;
      }>;
};

function firstTr(row: AreaGuideRow) {
  const t = row.translations;
  return Array.isArray(t) ? t[0] : t;
}

export async function fetchAreaGuides(locale: string): Promise<AreaGuideRow[]> {
  const supabase = getSupabase();
  let { data, error } = await supabase
    .from("area_guides")
    .select(AREA_LIST_SELECT)
    .eq("area_translations.locale", locale);

  if (error) {
    console.error("fetchAreaGuides:", error);
    return [];
  }

  if (!data?.length && locale !== "en") {
    const fb = await supabase
      .from("area_guides")
      .select(AREA_LIST_SELECT)
      .eq("area_translations.locale", "en");
    if (fb.error) {
      console.error("fetchAreaGuides en:", fb.error);
      return [];
    }
    data = fb.data;
  }

  return (data || []) as AreaGuideRow[];
}

export async function fetchAreaPropertyCounts(): Promise<Map<string, number>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("area_id")
    .eq("status", "available")
    .not("published_at", "is", null);

  if (error || !data) return new Map();

  const map = new Map<string, number>();
  for (const row of data as { area_id: string | null }[]) {
    if (!row.area_id) continue;
    map.set(row.area_id, (map.get(row.area_id) || 0) + 1);
  }
  return map;
}

export function areaCardFromRow(row: AreaGuideRow, count: number) {
  const tr = firstTr(row);
  const desc = (tr?.description || "").replace(/\s+/g, " ").trim();
  const short =
    desc.length > 140 ? `${desc.slice(0, 137).trim()}…` : desc || "—";
  return {
    id: row.id,
    slug: tr?.slug_localized || row.slug,
    name: tr?.name || row.slug,
    shortDescription: short,
    coverImage: row.cover_image || null,
    propertyCount: count,
    avgSale: row.avg_price_sale,
    avgRent: row.avg_price_rent,
  };
}

export type AreaTranslationDetail = {
  id: string;
  locale: string;
  name: string;
  slug_localized: string;
  description?: string | null;
  lifestyle?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  highlights?: unknown;
  area: {
    id: string;
    slug: string;
    cover_image?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    avg_price_sale?: number | null;
    avg_price_rent?: number | null;
  };
};

export async function fetchAreaTranslationBySlug(
  locale: string,
  slug: string,
): Promise<AreaTranslationDetail | null> {
  const supabase = getSupabase();
  const run = (loc: string) =>
    supabase
      .from("area_translations")
      .select(
        `
        *,
        area:area_guides!inner(id, slug, cover_image, latitude, longitude, avg_price_sale, avg_price_rent)
      `,
      )
      .eq("slug_localized", slug)
      .eq("locale", loc)
      .single();

  let { data, error } = await run(locale);
  if ((error || !data) && locale !== "en") {
    const fb = await run("en");
    data = fb.data;
    error = fb.error;
  }
  if (error || !data) return null;

  const row = data as AreaTranslationDetail & {
    area: AreaTranslationDetail["area"] | AreaTranslationDetail["area"][];
  };
  const areaRaw = row.area;
  const area = Array.isArray(areaRaw) ? areaRaw[0] : areaRaw;
  if (!area) return null;
  return { ...row, area };
}

export async function resolveAreaIdFromSlug(
  locale: string,
  slug: string,
): Promise<string | null> {
  const supabase = getSupabase();
  const run = (loc: string) =>
    supabase
      .from("area_translations")
      .select("area_id")
      .eq("slug_localized", slug)
      .eq("locale", loc)
      .maybeSingle();

  let { data } = await run(locale);
  if (!data?.area_id && locale !== "en") {
    const fb = await run("en");
    data = fb.data;
  }
  return (data as { area_id?: string } | null)?.area_id ?? null;
}

export function parseHighlights(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  return [];
}
