import { fetchOffPlanProjects, mapOffPlanToCard } from "@/lib/offplan-queries";
import OffPlanListClient from "./OffPlanListClient";

export default async function OffPlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const rows = await fetchOffPlanProjects(locale);
  const projects = rows.map(mapOffPlanToCard);
  return <OffPlanListClient projects={projects} />;
}
