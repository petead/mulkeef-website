import {
  coverImageFromProperty,
  fetchPropertiesForCards,
  rowToHomeCard,
} from "@/lib/properties-data";
import HomePageClient from "@/components/HomePageClient";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const rows = await fetchPropertiesForCards(locale, {}, 6);
  const featured = rows.map(rowToHomeCard);
  const heroImage = rows[0] ? coverImageFromProperty(rows[0]) : null;

  return <HomePageClient featured={featured} heroImage={heroImage} />;
}
