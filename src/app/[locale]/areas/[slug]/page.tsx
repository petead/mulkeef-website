import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";
import {
  fetchAreaPropertyCounts,
  fetchAreaTranslationBySlug,
  parseHighlights,
} from "@/lib/area-queries";
import {
  fetchPropertiesForCards,
  rowToHomeCard,
  type HomePropertyCard,
} from "@/lib/properties-data";
import { sanitizeHtml } from "@/lib/sanitize-html";
import AreaLeadForm from "./AreaLeadForm";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function loadArea(locale: string, slug: string) {
  const data = await fetchAreaTranslationBySlug(locale, slug);
  if (!data) return null;
  const counts = await fetchAreaPropertyCounts();
  const total = counts.get(data.area.id) || 0;
  const properties = await fetchPropertiesForCards(
    locale,
    { areaId: data.area.id },
    6,
  );
  const cards = properties.map(rowToHomeCard);
  return { data, total, cards };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const payload = await loadArea(locale, slug);
  if (!payload) {
    return { title: "Area Guide | MULKEEF" };
  }
  const { data } = payload;
  const title =
    data.meta_title || `${data.name} Area Guide | MULKEEF Real Estate`;
  const desc =
    data.meta_description ||
    (data.description || "").replace(/\s+/g, " ").trim().slice(0, 160);
  return {
    title,
    description: desc || `${data.name} — Dubai neighborhood guide.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/areas/${slug}`,
    },
  };
}

function proseBlocks(text: string | null | undefined) {
  if (!text) return null;
  const parts = text.split(/\n\n+/).filter(Boolean);
  return parts.map((p, i) => (
    <p
      key={i}
      className="text-[15px] font-light leading-[1.85] text-pearl/95"
    >
      {p.trim()}
    </p>
  ));
}

function coverForCard(p: HomePropertyCard) {
  const cover = p.images.find((i) => i.is_cover);
  return cover?.url ?? p.images[0]?.url ?? null;
}

export default async function AreaGuidePage({ params }: Props) {
  const { locale, slug } = await params;
  const payload = await loadArea(locale, slug);
  if (!payload) notFound();

  const { data, total, cards } = payload;
  const area = data.area;
  const cover = area.cover_image;
  const highlights = parseHighlights(data.highlights);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: data.name,
    description: (data.description || "").slice(0, 5000),
    address: {
      "@type": "PostalAddress",
      addressLocality: data.name,
      addressCountry: "AE",
    },
    geo:
      area.latitude != null && area.longitude != null
        ? {
            "@type": "GeoCoordinates",
            latitude: Number(area.latitude),
            longitude: Number(area.longitude),
          }
        : undefined,
  };

  const mapSrc =
    area.latitude != null && area.longitude != null
      ? `https://maps.google.com/maps?q=${Number(area.latitude)},${Number(area.longitude)}&z=12&output=embed`
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[#060D1B] pt-20">
        <section className="relative min-h-[60vh] w-full overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={data.name}
              fill
              priority
              className="object-cover brightness-[0.4]"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(30,79,216,0.35),transparent_45%),linear-gradient(140deg,#060D1B,#0F1D35)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B] via-transparent to-[#060D1B]/40" />
          <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-[1280px] flex-col justify-end px-5 pb-12 pt-28 md:px-8">
            <nav className="mb-6 text-[11px] font-light uppercase tracking-[2px] text-slate">
              <Link href="/areas" className="transition-colors hover:text-pearl">
                Areas
              </Link>
              <span className="mx-2 text-slate-dark">/</span>
              <span className="text-pearl">{data.name}</span>
            </nav>
            <div className="label-line label mb-4">
              <span>DUBAI NEIGHBORHOOD</span>
            </div>
            <h1 className="font-display text-5xl font-light leading-[1.05] text-white md:text-[56px]">
              {data.name}
            </h1>
            <div className="mt-8 flex max-w-[720px] flex-wrap gap-4 rounded-[2px] border border-pearl/10 bg-[#060D1B]/55 px-4 py-3 font-mono text-[11px] text-gold backdrop-blur-md">
              <span>
                Avg sale:{" "}
                {area.avg_price_sale != null
                  ? new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                      maximumFractionDigits: 0,
                    }).format(Number(area.avg_price_sale))
                  : "—"}
              </span>
              <span className="text-slate-dark">·</span>
              <span>
                Avg rent:{" "}
                {area.avg_price_rent != null
                  ? new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                      maximumFractionDigits: 0,
                    }).format(Number(area.avg_price_rent))
                  : "—"}
              </span>
              <span className="text-slate-dark">·</span>
              <span>{total} listings</span>
            </div>
          </div>
        </section>

        <section className="section-tight divider">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 md:grid-cols-[minmax(0,1fr)_320px] md:px-8">
            <div className="min-w-0 space-y-14">
              <div>
                <div className="label-line label mb-4">
                  <span>About</span>
                </div>
                <div className="space-y-4">
                  {proseBlocks(sanitizeHtml(data.description))}
                </div>
              </div>

              {data.lifestyle ? (
                <div>
                  <div className="label-line label mb-4">
                    <span>Lifestyle</span>
                  </div>
                  <div className="space-y-4">{proseBlocks(data.lifestyle)}</div>
                </div>
              ) : null}

              {highlights.length > 0 ? (
                <div>
                  <div className="label-line label mb-4">
                    <span>Highlights</span>
                  </div>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-2 text-sm font-light leading-relaxed text-slate"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="md:sticky md:top-[100px] md:self-start">
              <div className="mb-6 rounded-[2px] border border-brand-blue/15 bg-[#0A1628]/60 p-5">
                <p className="label mb-3">Snapshot</p>
                <dl className="space-y-3 font-mono text-[11px] text-gold">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate">Avg sale</dt>
                    <dd>
                      {area.avg_price_sale != null
                        ? new Intl.NumberFormat("en-AE", {
                            style: "currency",
                            currency: "AED",
                            maximumFractionDigits: 0,
                          }).format(Number(area.avg_price_sale))
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate">Avg rent</dt>
                    <dd>
                      {area.avg_price_rent != null
                        ? new Intl.NumberFormat("en-AE", {
                            style: "currency",
                            currency: "AED",
                            maximumFractionDigits: 0,
                          }).format(Number(area.avg_price_rent))
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate">Listings</dt>
                    <dd>{total}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate">ROI (est.)</dt>
                    <dd>—</dd>
                  </div>
                </dl>
              </div>

              <AreaLeadForm
                areaName={data.name}
                sourcePath={`/${locale}/areas/${slug}`}
              />

              {mapSrc ? (
                <div className="mt-6 overflow-hidden rounded-[2px] border border-brand-blue/15">
                  <iframe
                    title={`Map — ${data.name}`}
                    src={mapSrc}
                    className="h-[220px] w-full grayscale contrast-125"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="section-tight divider pb-24">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="label-line label mb-3">
                  <span>Listings</span>
                </div>
                <h2 className="title-lg">
                  Properties in <span className="title-italic">{data.name}</span>
                </h2>
              </div>
              <Link
                href={`/properties?area=${encodeURIComponent(slug)}`}
                className="text-xs font-semibold uppercase tracking-[2px] text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
              >
                View all in {data.name}
              </Link>
            </div>

            {cards.length === 0 ? (
              <p className="text-sm text-slate">
                No active listings in this area yet. View all properties or contact
                us for off-market options.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {cards.map((p) => {
                  const img = coverForCard(p);
                  return (
                    <Link
                      key={p.id}
                      href={`/properties/${p.slug}`}
                      className="group relative block overflow-hidden rounded-[2px] border border-brand-blue/10"
                      style={{ minHeight: 280 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/15 to-gold/10" />
                      {img ? (
                        <Image
                          src={img}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-[6s] ease-out group-hover:scale-105"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B]/95 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-[10px] uppercase tracking-[2px] text-gold">
                          {p.neighborhood}
                        </p>
                        <p className="font-display text-xl text-pearl">{p.title}</p>
                        <p className="mt-2 font-mono text-xs text-gold">
                          {p.priceLabel}
                          {p.priceSuffix}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
