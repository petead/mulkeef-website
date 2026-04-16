import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/lib/i18n/routing";
import { locales } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { blogCardFromRow, fetchBlogPosts } from "@/lib/blog-queries";
import BlogCategoryChips from "./BlogCategoryChips";

function pick(
  sp: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  if (!sp) return undefined;
  const v = sp[key];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}/blog`]),
  ) as Record<string, string>;
  languages["x-default"] = `${SITE_URL}/en/blog`;
  return {
    title: "Dubai Real Estate Insights | MULKEEF",
    description:
      "Market updates, investment guides, and neighborhood intelligence for Dubai property.",
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages,
    },
  };
}

function fmtDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { locale } = await params;
  const raw = pick(searchParams, "category");
  const category = raw || "all";
  const rows = await fetchBlogPosts(
    locale,
    category === "all" ? undefined : category,
  );
  const cards = rows.map(blogCardFromRow);
  const featured = cards[0];
  const rest = cards.slice(1);

  return (
    <div className="bg-[#060D1B] pt-28">
      <section className="section-tight">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="label-line label mb-6">
            <span>INSIGHTS</span>
          </div>
          <h1 className="title-xl max-w-[900px]">
            Dubai Real Estate
            <br />
            <span className="title-italic">Insights</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-base font-light leading-relaxed text-slate">
            Data-led perspectives on the communities, trends, and opportunities shaping
            Dubai property.
          </p>
        </div>
      </section>

      <section className="section-tight divider pb-24">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <BlogCategoryChips active={category} />

          {cards.length === 0 ? (
            <p className="text-sm text-slate">
              Articles will appear here once published.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
              {featured ? (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group relative row-span-2 block min-h-[420px] overflow-hidden rounded-[2px] border border-brand-blue/10 md:col-span-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-gold/10" />
                  {featured.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-[6s] ease-out group-hover:scale-[1.04]"
                      sizes="(min-width: 768px) 66vw, 100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(140deg,#0A1628,#0F1D35)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B]/95 via-[#060D1B]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[4px] text-gold">
                      {featured.category}
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-light leading-tight text-pearl md:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="mt-4 line-clamp-3 text-[13px] font-light leading-relaxed text-slate">
                      {featured.excerpt}
                    </p>
                    <p className="mt-6 font-mono text-[10px] uppercase tracking-[1px] text-slate-dark">
                      {featured.author} · {fmtDate(featured.publishedAt)} ·{" "}
                      {featured.readingMinutes} min read
                    </p>
                  </div>
                </Link>
              ) : null}

              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-[2px] border border-brand-blue/10 md:min-h-0"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A1628]">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(140deg,#0A1628,#0F1D35)]" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[4px] text-gold">
                      {post.category}
                    </p>
                    <h3 className="mt-2 font-display text-[22px] font-light leading-snug text-pearl">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-[13px] font-light leading-relaxed text-slate">
                      {post.excerpt}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[1px] text-slate-dark">
                      {post.author} · {fmtDate(post.publishedAt)} ·{" "}
                      {post.readingMinutes} min
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
