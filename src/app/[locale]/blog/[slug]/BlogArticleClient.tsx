"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/lib/i18n/routing";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { WHATSAPP_URL } from "@/lib/utils";
import type { BlogCardVM } from "@/lib/blog-queries";

const ease = [0.16, 1, 0.3, 1] as const;

function fmtDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function BlogArticleClient({
  locale: _locale,
  slug,
  title,
  excerpt,
  contentHtml,
  coverImage,
  author,
  publishedAt,
  readingMinutes,
  category,
  related,
}: {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImage: string | null;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  category: string;
  related: BlogCardVM[];
}) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>(
    [],
  );
  const safe = useMemo(() => sanitizeHtml(contentHtml), [contentHtml]);

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll("h2, h3");
    const items: { id: string; text: string; level: number }[] = [];
    nodes.forEach((el, i) => {
      const id = el.id || `section-${i}`;
      if (!el.id) el.id = id;
      items.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });
    setToc(items);
  }, [safe]);

  const [shareUrl, setShareUrl] = useState(
    `https://www.mulkeef.com/${_locale}/blog/${slug}`,
  );
  useEffect(() => {
    setShareUrl(window.location.href);
  }, [_locale, slug]);

  return (
    <article className="bg-[#060D1B] pt-28">
      <header className="section-tight">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <p className="text-[11px] font-light uppercase tracking-[2px] text-slate">
            <Link href="/blog" className="transition-colors hover:text-pearl">
              Blog
            </Link>
            <span className="mx-2 text-slate-dark">/</span>
            <span className="text-gold">{category}</span>
          </p>
          <h1 className="mt-6 max-w-[900px] font-display text-4xl font-normal leading-[1.15] text-pearl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-[720px] text-sm font-light leading-relaxed text-slate">
            {excerpt}
          </p>
          <p className="mt-4 text-xs font-light text-slate">
            {author} · {fmtDate(publishedAt)} · {readingMinutes} min read
          </p>
        </div>
      </header>

      {coverImage ? (
        <div className="relative mx-auto mt-10 h-[50vh] max-w-[1280px] px-5 md:px-8">
          <div className="relative h-full overflow-hidden rounded-[2px] border border-brand-blue/10">
            <Image
              src={coverImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}

      <div className="section-tight divider">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-5 md:flex-row md:px-8">
          <div
            ref={articleRef}
            className="blog-prose prose-editorial min-w-0 max-w-[680px] flex-1"
            dangerouslySetInnerHTML={{ __html: safe }}
          />

          <aside className="w-full shrink-0 md:sticky md:top-28 md:w-[260px]">
            {toc.length > 0 ? (
              <div className="rounded-[2px] border border-brand-blue/15 bg-[#0A1628]/50 p-4">
                <p className="label mb-3">Contents</p>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm font-light text-slate transition-colors hover:text-gold ${
                        item.level === 3 ? "pl-3" : ""
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            ) : null}

            <div className="mt-6 rounded-[2px] border border-brand-blue/15 bg-[#0A1628]/50 p-4">
              <p className="label mb-3">Share</p>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[2px] border border-brand-blue/20 px-3 py-2 text-gold hover:border-gold"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[2px] border border-brand-blue/20 px-3 py-2 text-gold hover:border-gold"
                >
                  LinkedIn
                </a>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="rounded-[2px] border border-brand-blue/20 px-3 py-2 text-gold hover:border-gold"
                >
                  Copy link
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-[2px] border border-brand-blue/15 bg-[#0A1628]/50 p-4">
              <p className="label mb-2">Author</p>
              <p className="font-display text-xl text-pearl">{author}</p>
              <p className="mt-2 text-[13px] font-light leading-relaxed text-slate">
                Editorial team at MULKEEF Real Estate — Dubai market specialists.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <section className="section-tight">
        <div className="mx-auto max-w-[680px] border-t border-gold/30 px-5 py-12 text-center md:px-0">
          <h2 className="font-display text-2xl font-light text-pearl">
            Interested in Dubai property?
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-gold">
              Book consultation
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-tight divider pb-24">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8">
            <div className="label-line label mb-6">
              <span>RELATED ARTICLES</span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group block rounded-[2px] border border-brand-blue/10 p-4 transition-colors hover:border-gold/30"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[4px] text-gold">
                    {r.category}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-light text-pearl">
                    {r.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] font-light text-slate">
                    {r.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
