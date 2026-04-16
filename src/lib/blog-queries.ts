import { getSupabase } from "@/lib/supabase";

const BLOG_LIST_SELECT = `
  *,
  translations:blog_translations!inner(
    title,
    slug_localized,
    excerpt,
    meta_title,
    meta_description
  )
`;

export type BlogPostRow = {
  id: string;
  slug: string;
  author?: string | null;
  cover_image?: string | null;
  published?: boolean | null;
  published_at?: string | null;
  category?: string | null;
  reading_minutes?: number | null;
  translations:
    | {
        title: string;
        slug_localized: string;
        excerpt?: string | null;
        meta_title?: string | null;
        meta_description?: string | null;
      }
    | Array<{
        title: string;
        slug_localized: string;
        excerpt?: string | null;
        meta_title?: string | null;
        meta_description?: string | null;
      }>;
};

function firstTr(row: BlogPostRow) {
  const t = row.translations;
  return Array.isArray(t) ? t[0] : t;
}

export async function fetchBlogPosts(
  locale: string,
  category?: string,
): Promise<BlogPostRow[]> {
  const supabase = getSupabase();
  const build = (loc: string) => {
    let q = supabase
      .from("blog_posts")
      .select(BLOG_LIST_SELECT)
      .eq("published", true)
      .not("published_at", "is", null)
      .eq("blog_translations.locale", loc)
      .order("published_at", { ascending: false });
    if (category && category !== "all") {
      q = q.eq("category", category);
    }
    return q;
  };

  let { data, error } = await build(locale);
  if (error) {
    console.error("fetchBlogPosts:", error);
    return [];
  }
  if (!data?.length && locale !== "en") {
    const fb = await build("en");
    if (fb.error) {
      console.error("fetchBlogPosts en:", fb.error);
      return [];
    }
    data = fb.data;
  }
  return (data || []) as BlogPostRow[];
}

export async function fetchBlogPostBySlug(locale: string, slug: string) {
  const supabase = getSupabase();
  const run = (loc: string) =>
    supabase
      .from("blog_translations")
      .select(
        `
        *,
        post:blog_posts!inner(*)
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
    post: Record<string, unknown> | Record<string, unknown>[];
  };
  const post = Array.isArray(row.post) ? row.post[0] : row.post;
  if (!post || post.published === false) return null;
  return { ...row, post };
}

export async function fetchRelatedBlogPosts(
  locale: string,
  excludePostId: string,
  limit = 3,
): Promise<BlogPostRow[]> {
  const supabase = getSupabase();
  const build = (loc: string) =>
    supabase
      .from("blog_posts")
      .select(BLOG_LIST_SELECT)
      .eq("published", true)
      .not("published_at", "is", null)
      .neq("id", excludePostId)
      .eq("blog_translations.locale", loc)
      .order("published_at", { ascending: false })
      .limit(limit);

  let { data, error } = await build(locale);
  if (error) return [];
  if (!data?.length && locale !== "en") {
    const fb = await build("en");
    data = fb.data;
  }
  return (data || []) as BlogPostRow[];
}

export function blogCardFromRow(row: BlogPostRow) {
  const tr = firstTr(row);
  const excerpt = (tr?.excerpt || "").replace(/\s+/g, " ").trim();
  return {
    id: row.id,
    slug: tr?.slug_localized || row.slug,
    title: tr?.title || row.slug,
    excerpt:
      excerpt.length > 120 ? `${excerpt.slice(0, 117)}…` : excerpt || "—",
    coverImage: row.cover_image || null,
    category: (row.category || "market").toLowerCase(),
    author: row.author || "MULKEEF",
    publishedAt: row.published_at || "",
    readingMinutes: row.reading_minutes ?? 5,
  };
}

export type BlogCardVM = ReturnType<typeof blogCardFromRow>;
