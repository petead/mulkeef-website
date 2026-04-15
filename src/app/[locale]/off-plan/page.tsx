"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Download, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { getSupabase } from "@/lib/supabase";
import { WHATSAPP_URL } from "@/lib/utils";

type OffPlanProject = {
  id: string;
  title: string;
  developer: string;
  community: string;
  startingPrice: string;
  completion: number;
  paymentPlan: string[];
};

const FALLBACK_PROJECTS: OffPlanProject[] = [
  {
    id: "1",
    title: "Emaar Beachfront",
    developer: "EMAAR",
    community: "Dubai Harbour",
    startingPrice: "1.9M AED",
    completion: 72,
    paymentPlan: ["80/20", "Post-Handover", "Waterfront"],
  },
  {
    id: "2",
    title: "Sobha One",
    developer: "SOBHA",
    community: "Ras Al Khor",
    startingPrice: "1.1M AED",
    completion: 48,
    paymentPlan: ["60/40", "Golf Views", "Q4 2027"],
  },
  {
    id: "3",
    title: "Damac Sun City",
    developer: "DAMAC",
    community: "Dubailand",
    startingPrice: "2.4M AED",
    completion: 31,
    paymentPlan: ["70/30", "Community Villas", "Handover 2028"],
  },
  {
    id: "4",
    title: "Azizi Venice",
    developer: "AZIZI",
    community: "Dubai South",
    startingPrice: "780K AED",
    completion: 54,
    paymentPlan: ["50/50", "Lagoon Living", "Metro Access"],
  },
  {
    id: "5",
    title: "Binghatti Ghost",
    developer: "BINGHATTI",
    community: "Al Jaddaf",
    startingPrice: "950K AED",
    completion: 22,
    paymentPlan: ["65/35", "Design-Led", "Canal Front"],
  },
  {
    id: "6",
    title: "Emaar The Valley",
    developer: "EMAAR",
    community: "Dubai",
    startingPrice: "2.1M AED",
    completion: 63,
    paymentPlan: ["75/25", "Family Villas", "Green Community"],
  },
];

function mapOffPlanRow(row: Record<string, unknown>): OffPlanProject {
  const trRaw = row.translation;
  const tr = Array.isArray(trRaw)
    ? (trRaw[0] as Record<string, unknown> | undefined)
    : (trRaw as Record<string, unknown> | undefined);

  const plan =
    Array.isArray(tr?.payment_plan_highlights)
      ? (tr?.payment_plan_highlights as string[])
      : Array.isArray(row.payment_plan_highlights)
        ? (row.payment_plan_highlights as string[])
        : [];

  return {
    id: String(row.id),
    title: String(tr?.title || row.slug || "Off-Plan Project"),
    developer: String(row.developer || tr?.developer || "Developer"),
    community: String(tr?.community || tr?.neighborhood || row.community || "Dubai"),
    startingPrice: row.starting_price
      ? `${Number(row.starting_price).toLocaleString()} AED`
      : String(tr?.starting_price_label || "Contact us"),
    completion: Math.max(8, Math.min(100, Number(row.completion_percentage) || 42)),
    paymentPlan: plan.length > 0 ? plan.slice(0, 4) : ["Flexible Plan", "High ROI"],
  };
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function OffPlanPage() {
  const locale = useLocale();
  const [projects, setProjects] = useState<OffPlanProject[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const supabase = getSupabase();
        const base = () =>
          supabase
            .from("offplan_projects")
            .select("*, translation:offplan_translations!inner(*)")
            .order("created_at", { ascending: false });

        let { data, error } = await base().eq("offplan_translations.locale", locale);
        if (error) throw error;

        if ((!data || data.length === 0) && locale !== "en") {
          const fallback = await base().eq("offplan_translations.locale", "en");
          if (fallback.error) throw fallback.error;
          data = fallback.data;
        }

        if (!cancelled && data && data.length > 0) {
          setProjects(
            data.map((row) => mapOffPlanRow(row as Record<string, unknown>))
          );
        } else if (!cancelled) {
          setProjects(FALLBACK_PROJECTS);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setProjects(FALLBACK_PROJECTS);
      }
    }

    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const totalProjects = useMemo(() => projects.length, [projects]);

  return (
    <div className="bg-[#060D1B] pt-28">
      <section className="section-tight">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <Reveal>
            <div className="label-line label mb-6">
              <span>OFF-PLAN INVESTMENTS</span>
            </div>
            <h1 className="title-xl max-w-[860px]">
              Invest in Dubai&apos;s
              <br />
              <span className="title-italic">Future</span>
            </h1>
            <p className="mt-6 max-w-[620px] text-base font-light leading-relaxed text-slate">
              Access exclusive developer projects with attractive payment plans
              and high ROI potential.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[2px] text-slate-dark">
              {totalProjects} curated projects
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight divider">
        <div className="mx-auto w-full max-w-[1280px] space-y-6 px-5 md:px-8">
          {projects.map((project, idx) => (
            <Reveal key={project.id} delay={idx * 0.06}>
              <article className="grid grid-cols-1 gap-0 border border-brand-blue/10 md:grid-cols-[360px_minmax(0,1fr)]">
                <div className="relative min-h-[250px] overflow-hidden border-b border-brand-blue/10 bg-[radial-gradient(circle_at_25%_25%,rgba(30,79,216,0.3),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(201,168,76,0.2),transparent_42%),linear-gradient(140deg,#0A1628,#0F1D35)] md:border-b-0 md:border-r">
                  <div className="absolute inset-0 bg-[linear-gradient(112deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)]" />
                  <div className="absolute bottom-5 left-5">
                    <p className="text-[10px] uppercase tracking-[2px] text-gold">
                      {project.developer}
                    </p>
                    <p className="mt-1 text-sm text-slate">{project.community}</p>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-[10px] uppercase tracking-[3px] text-gold">
                    {project.developer}
                  </p>
                  <h2 className="mt-2 font-display text-[28px] leading-none text-pearl">
                    {project.title}
                  </h2>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[2px] text-slate">
                        Completion
                      </span>
                      <span className="font-mono text-xs text-gold">
                        {project.completion}%
                      </span>
                    </div>
                    <div className="h-[3px] w-full bg-[#0A1628]">
                      <div
                        className="h-full bg-gold transition-all duration-700"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-6 font-mono text-xl text-gold">
                    {project.startingPrice}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.paymentPlan.map((chip) => (
                      <span
                        key={chip}
                        className="border border-brand-blue/12 px-2.5 py-1 text-[10px] uppercase tracking-[1.4px] text-slate"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" className="btn-outline inline-flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Brochure
                    </button>
                    <Link href="/contact" className="btn-gold inline-flex items-center gap-2">
                      Inquire
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-tight divider">
        <div className="mx-auto max-w-[860px] px-5 text-center md:px-8">
          <Reveal>
            <h2 className="title-lg">
              Interested in <span className="title-italic">off-plan investment?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-sm leading-relaxed text-slate">
              Our advisors help you compare payment plans, developer track
              records and long-term rental yield before you commit.
            </p>
            <div className="mt-8">
              <Link href="/contact" className="btn-gold inline-flex items-center gap-2">
                Book Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#060D1B] shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] transition-transform duration-300 hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
