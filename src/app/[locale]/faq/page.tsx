import type { Metadata } from "next";
import { locales } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { buildFaqJsonLd } from "./faq-data";
import FaqPageClient from "./FaqPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}/faq`]),
  ) as Record<string, string>;
  languages["x-default"] = `${SITE_URL}/en/faq`;
  return {
    title: "FAQ — Dubai Real Estate | MULKEEF",
    description:
      "Answers on buying, renting, off-plan, visas, and property fees in Dubai.",
    alternates: {
      canonical: `${SITE_URL}/${locale}/faq`,
      languages,
    },
  };
}

export default function FaqPage() {
  const faqSchema = buildFaqJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqPageClient />
    </>
  );
}
