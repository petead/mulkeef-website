"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import type { OffPlanCard } from "@/lib/offplan-queries";

const ease = [0.16, 1, 0.3, 1] as const;

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
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.82, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function OffPlanListClient({ projects }: { projects: OffPlanCard[] }) {
  return (
    <>
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
              Access exclusive developer projects with attractive payment plans and
              institutional-grade due diligence from our team.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[2px] text-slate-dark">
              {projects.length} active projects
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight divider pb-24">
        <div className="mx-auto w-full max-w-[1280px] space-y-6 px-5 md:px-8">
          {projects.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate">
              No active off-plan projects are listed yet. Contact us for private
              launches and developer allocations.
            </p>
          ) : null}
          {projects.map((project, idx) => (
            <Reveal key={project.id} delay={idx * 0.06}>
              <article className="grid grid-cols-1 overflow-hidden rounded-[2px] border border-brand-blue/10 md:grid-cols-[40%_60%]">
                <Link
                  href={`/off-plan/${project.slug}`}
                  className="relative min-h-[220px] bg-[radial-gradient(circle_at_25%_25%,rgba(30,79,216,0.3),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(201,168,76,0.2),transparent_42%),linear-gradient(140deg,#0A1628,#0F1D35)] md:min-h-[280px]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(112deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)]" />
                  <div className="absolute bottom-5 left-5">
                    <p className="text-[10px] uppercase tracking-[2px] text-gold">
                      {project.developer}
                    </p>
                    <p className="mt-1 text-sm text-slate">{project.neighborhood}</p>
                  </div>
                </Link>

                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="text-[10px] uppercase tracking-[3px] text-gold">
                    {project.developer}
                  </p>
                  <h2 className="mt-2 font-display text-[28px] font-light leading-none text-pearl">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-[13px] font-light text-slate">
                    {project.neighborhood}
                    {project.completionDate
                      ? ` · Handover ${project.completionDate}`
                      : ""}
                  </p>
                  <p className="mt-4 line-clamp-2 text-[13px] font-light leading-relaxed text-slate">
                    {project.excerpt || "—"}
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[2px] text-slate">
                        Completion
                      </span>
                      <span className="font-mono text-xs text-gold">
                        {project.completion}%
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-[2px] bg-[#0A1628]">
                      <div
                        className="h-full rounded-[2px] bg-gold transition-all duration-700"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-6 font-mono text-xl text-gold">
                    {project.startingPriceLabel}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.highlights.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-[2px] border border-brand-blue/20 px-2.5 py-1 text-[10px] uppercase tracking-[1.4px] text-slate"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn-outline inline-flex items-center gap-2 rounded-[2px]"
                    >
                      <Download className="h-4 w-4" />
                      Download brochure
                    </button>
                    <Link
                      href={`/off-plan/${project.slug}`}
                      className="btn-gold inline-flex items-center gap-2 rounded-[2px]"
                    >
                      Inquire
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
