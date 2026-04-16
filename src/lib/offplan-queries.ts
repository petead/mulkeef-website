import { getSupabase } from "@/lib/supabase";

const OFFPLAN_SELECT = `
  *,
  translations:offplan_translations!inner(
    title,
    slug_localized,
    description,
    meta_title,
    meta_description,
    neighborhood,
    highlights
  )
`;

export type OffPlanRow = Record<string, unknown> & {
  id: string;
  slug: string;
  developer: string;
  completion_percentage?: number | null;
  completion_date?: string | null;
  starting_price?: number | null;
  featured?: boolean;
  translations:
    | Record<string, unknown>
    | Array<Record<string, unknown>>;
};

function firstTr(row: OffPlanRow) {
  const t = row.translations;
  return Array.isArray(t) ? t[0] : t;
}

export async function fetchOffPlanProjects(locale: string): Promise<OffPlanRow[]> {
  const supabase = getSupabase();
  let { data, error } = await supabase
    .from("offplan_projects")
    .select(OFFPLAN_SELECT)
    .eq("status", "active")
    .eq("offplan_translations.locale", locale)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchOffPlanProjects:", error);
    return [];
  }

  if (!data?.length && locale !== "en") {
    const fb = await supabase
      .from("offplan_projects")
      .select(OFFPLAN_SELECT)
      .eq("status", "active")
      .eq("offplan_translations.locale", "en")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (fb.error) {
      console.error("fetchOffPlanProjects en:", fb.error);
      return [];
    }
    data = fb.data;
  }

  return (data || []) as OffPlanRow[];
}

export function mapOffPlanToCard(row: OffPlanRow) {
  const tr = firstTr(row) || {};
  const rawHighlights = tr.highlights;
  const highlights = Array.isArray(rawHighlights)
    ? (rawHighlights as string[]).filter(Boolean).slice(0, 8)
    : [];

  const desc = String(tr.description || "").replace(/\s+/g, " ").trim();
  const excerpt = desc.length > 160 ? `${desc.slice(0, 157)}…` : desc;

  return {
    id: String(row.id),
    slug: String(tr.slug_localized || row.slug),
    title: String(tr.title || row.slug),
    developer: String(row.developer || "Developer"),
    neighborhood: String(tr.neighborhood || "Dubai"),
    completion: Math.max(
      0,
      Math.min(100, Number(row.completion_percentage ?? 0)),
    ),
    completionDate: row.completion_date
      ? String(row.completion_date)
      : null,
    startingPriceLabel: row.starting_price
      ? new Intl.NumberFormat("en-AE", {
          style: "currency",
          currency: "AED",
          maximumFractionDigits: 0,
        }).format(Number(row.starting_price))
      : "Contact us",
    highlights: highlights.length ? highlights.slice(0, 4) : [],
    excerpt,
    metaTitle: (tr.meta_title as string) || null,
    metaDescription: (tr.meta_description as string) || null,
  };
}

export type OffPlanCard = ReturnType<typeof mapOffPlanToCard>;

export async function fetchOffPlanBySlug(locale: string, slug: string) {
  const supabase = getSupabase();
  const run = (loc: string) =>
    supabase
      .from("offplan_translations")
      .select(
        `
        *,
        project:offplan_projects!inner(*)
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

  const row = data as Record<string, unknown> & {
    project: Record<string, unknown> | Record<string, unknown>[];
  };
  const project = Array.isArray(row.project) ? row.project[0] : row.project;
  if (!project) return null;

  const { project: _omit, ...translation } = row;
  return {
    translation: translation as Record<string, unknown>,
    project: project as Record<string, unknown>,
  };
}
