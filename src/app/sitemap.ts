import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";
import { locales } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/contact",
  "/properties",
  "/off-plan",
  "/areas",
  "/faq",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const supabase = getSupabase();

  const staticUrls: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
  );

  const { data: propRows } = await supabase
    .from("property_translations")
    .select("slug_localized, locale, updated_at");

  const propertyUrls: MetadataRoute.Sitemap = (propRows || []).map(
    (row: { slug_localized: string; locale: string; updated_at?: string }) => ({
      url: `${base}/${row.locale}/properties/${row.slug_localized}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }),
  );

  const { data: areaRows } = await supabase
    .from("area_translations")
    .select("slug_localized, locale");

  const areaUrls: MetadataRoute.Sitemap = (areaRows || []).map(
    (row: { slug_localized: string; locale: string }) => ({
      url: `${base}/${row.locale}/areas/${row.slug_localized}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, published_at, published")
    .eq("published", true);

  const postIds = (posts || []).map((p: { id: string }) => p.id);
  let blogUrls: MetadataRoute.Sitemap = [];
  if (postIds.length) {
    const { data: blogTrs } = await supabase
      .from("blog_translations")
      .select("slug_localized, locale, post_id")
      .in("post_id", postIds);

    const publishedAtById = new Map(
      (posts || []).map((p: { id: string; published_at?: string }) => [
        p.id,
        p.published_at,
      ]),
    );

    blogUrls = (blogTrs || []).map(
      (row: {
        slug_localized: string;
        locale: string;
        post_id: string;
      }) => ({
        url: `${base}/${row.locale}/blog/${row.slug_localized}`,
        lastModified: new Date(
          publishedAtById.get(row.post_id) || new Date().toISOString(),
        ),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }),
    );
  }

  const { data: activeProjects } = await supabase
    .from("offplan_projects")
    .select("id")
    .eq("status", "active");
  const activeIds = new Set(
    (activeProjects || []).map((p: { id: string }) => p.id),
  );

  const { data: offTrs } = await supabase
    .from("offplan_translations")
    .select("slug_localized, locale, project_id");

  const offplanUrls: MetadataRoute.Sitemap = (offTrs || [])
    .filter((row: { project_id: string }) => activeIds.has(row.project_id))
    .map((row: { slug_localized: string; locale: string }) => ({
      url: `${base}/${row.locale}/off-plan/${row.slug_localized}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    ...staticUrls,
    ...propertyUrls,
    ...areaUrls,
    ...blogUrls,
    ...offplanUrls,
  ];
}
