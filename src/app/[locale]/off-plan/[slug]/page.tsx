import type { Metadata } from "next";
import { Link } from "@/lib/i18n/routing";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { fetchOffPlanBySlug } from "@/lib/offplan-queries";
import { sanitizeHtml } from "@/lib/sanitize-html";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const row = await fetchOffPlanBySlug(locale, slug);
  if (!row) return { title: "Off-Plan | MULKEEF" };
  const tr = row.translation as Record<string, unknown>;
  const title =
    (tr.meta_title as string) ||
    `${tr.title as string} | MULKEEF Off-Plan`;
  const desc =
    (tr.meta_description as string) ||
    String(tr.description || "").slice(0, 160);
  return {
    title,
    description: desc,
    alternates: {
      canonical: `${SITE_URL}/${locale}/off-plan/${slug}`,
    },
  };
}

export default async function OffPlanDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const row = await fetchOffPlanBySlug(locale, slug);
  if (!row) notFound();

  const tr = row.translation as Record<string, unknown>;
  const project = row.project as Record<string, unknown>;
  const highlights = Array.isArray(tr.highlights)
    ? (tr.highlights as string[])
    : [];

  return (
    <div className="bg-[#060D1B] pt-28">
      <div className="mx-auto max-w-[900px] px-5 pb-24 md:px-8">
        <nav className="text-[11px] font-light uppercase tracking-[2px] text-slate">
          <Link href="/off-plan" className="hover:text-pearl">
            Off-Plan
          </Link>
          <span className="mx-2 text-slate-dark">/</span>
          <span className="text-pearl">{String(tr.title)}</span>
        </nav>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[4px] text-gold">
          {String(project.developer)}
        </p>
        <h1 className="mt-3 font-display text-4xl font-light text-pearl md:text-5xl">
          {String(tr.title)}
        </h1>
        <p className="mt-4 text-sm text-slate">
          {String(tr.neighborhood || "Dubai")}
        </p>
        <div
          className="prose-editorial mt-10"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(String(tr.description || "")),
          }}
        />
        {highlights.length > 0 ? (
          <ul className="mt-8 space-y-2 border-t border-brand-blue/10 pt-8">
            {highlights.map((h) => (
              <li key={h} className="text-sm text-slate">
                <span className="mr-2 text-gold">✓</span>
                {h}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-gold rounded-[2px]">
            Inquire about this project
          </Link>
        </div>
      </div>
    </div>
  );
}
