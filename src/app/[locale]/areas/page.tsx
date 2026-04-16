import type { Metadata } from "next";
import { locales } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";
import {
  areaCardFromRow,
  fetchAreaGuides,
  fetchAreaPropertyCounts,
} from "@/lib/area-queries";
import AreasGridClient from "./AreasGridClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}/areas`]),
  ) as Record<string, string>;
  languages["x-default"] = `${SITE_URL}/en/areas`;

  return {
    title: "Dubai Neighborhoods & Area Guides | MULKEEF",
    description:
      "Explore Dubai's most prestigious neighborhoods. Complete area guides with property prices, lifestyle, and investment insights.",
    alternates: {
      canonical: `${SITE_URL}/${locale}/areas`,
      languages,
    },
  };
}

function formatAed(n: number | null | undefined) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

export default async function AreasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [rows, counts] = await Promise.all([
    fetchAreaGuides(locale),
    fetchAreaPropertyCounts(),
  ]);

  const cards = rows.map((r, idx) => {
    const c = areaCardFromRow(r, counts.get(r.id) || 0);
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      shortDescription: c.shortDescription,
      coverImage: c.coverImage,
      propertyCount: c.propertyCount,
      footerSale: formatAed(c.avgSale),
      footerRent: formatAed(c.avgRent),
      height: [380, 320, 380][idx % 3],
    };
  });

  return (
    <div className="bg-[#060D1B] pt-28">
      <section className="section-tight">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="label-line label mb-6">
            <span>DUBAI NEIGHBORHOODS</span>
          </div>
          <h1 className="title-xl max-w-[900px]">
            Explore Dubai&apos;s
            <br />
            <span className="title-italic">Premier</span> Communities
          </h1>
          <p className="mt-6 max-w-[560px] text-base font-light leading-relaxed text-slate">
            Curated area guides with pricing context, lifestyle notes, and live
            listings — so you can choose a community with confidence.
          </p>
        </div>
      </section>

      <section className="section-tight divider pb-24">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          {cards.length === 0 ? (
            <p className="text-sm text-slate">
              Area guides will appear here once published in the CMS.
            </p>
          ) : (
            <AreasGridClient cards={cards} />
          )}
        </div>
      </section>
    </div>
  );
}
