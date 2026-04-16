import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import {
  blogCardFromRow,
  fetchBlogPostBySlug,
  fetchRelatedBlogPosts,
} from "@/lib/blog-queries";
import BlogArticleClient from "./BlogArticleClient";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const rowRaw = await fetchBlogPostBySlug(locale, slug);
  if (!rowRaw) return { title: "Article | MULKEEF" };
  const tr = rowRaw as Record<string, unknown>;
  const post = tr.post as Record<string, unknown>;
  const title =
    (tr.meta_title as string) ||
    `${String(tr.title)} | MULKEEF Real Estate`;
  const desc =
    (tr.meta_description as string) ||
    String(tr.excerpt || "").slice(0, 160) ||
    "";
  return {
    title,
    description: desc,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: String(tr.title),
      description: desc,
      images: post.cover_image ? [{ url: String(post.cover_image) }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const rowRaw = await fetchBlogPostBySlug(locale, slug);
  if (!rowRaw) notFound();

  const tr = rowRaw as Record<string, unknown>;
  const post = tr.post as Record<string, unknown>;
  const relatedRows = await fetchRelatedBlogPosts(
    locale,
    String(post.id),
    3,
  );
  const related = relatedRows.map(blogCardFromRow);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: tr.title,
    description: tr.excerpt || "",
    image: post.cover_image || undefined,
    datePublished: post.published_at || undefined,
    author: {
      "@type": "Person",
      name: post.author || "MULKEEF",
    },
    publisher: {
      "@type": "Organization",
      name: "MULKEEF Real Estate",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogArticleClient
        locale={locale}
        slug={slug}
        title={String(tr.title)}
        excerpt={String(tr.excerpt || "")}
        contentHtml={String(tr.content || "")}
        coverImage={post.cover_image ? String(post.cover_image) : null}
        author={String(post.author || "MULKEEF")}
        publishedAt={String(post.published_at || "")}
        readingMinutes={Number(post.reading_minutes ?? 5)}
        category={String(post.category || "market")}
        related={related}
      />
    </>
  );
}
