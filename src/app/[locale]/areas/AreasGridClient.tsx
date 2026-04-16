"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/routing";
import { ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export type AreaCardVM = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  coverImage: string | null;
  propertyCount: number;
  footerSale: string;
  footerRent: string;
  height: number;
};

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function AreasGridClient({ cards }: { cards: AreaCardVM[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((area, index) => (
          <Reveal key={area.id} delay={index * 0.06} className="min-w-0">
            <Link
              href={`/areas/${area.slug}`}
              className="group relative block overflow-hidden rounded-[2px] border border-brand-blue/10 bg-[#0A1628]"
              style={{ height: area.height }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(30,79,216,0.28),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(201,168,76,0.15),transparent_42%),linear-gradient(140deg,#0A1628,#0F1D35)]" />

              {area.coverImage ? (
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                >
                  <Image
                    src={area.coverImage}
                    alt={area.name}
                    fill
                    className="object-cover brightness-[0.55]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </motion.div>
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B]/95 via-[#060D1B]/35 to-transparent transition-opacity duration-500 group-hover:from-[#060D1B]" />

              <div className="absolute right-3 top-3 rounded-[2px] border border-pearl/10 bg-[#060D1B]/55 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-gold backdrop-blur-sm">
                {area.propertyCount}{" "}
                {area.propertyCount === 1 ? "Property" : "Properties"}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-display text-[26px] font-light leading-tight text-pearl">
                  {area.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-[13px] font-light leading-relaxed text-slate">
                  {area.shortDescription}
                </p>
                <p className="mt-4 font-mono text-[11px] text-gold">
                  From {area.footerSale} / sale · {area.footerRent} / rent
                </p>
                <p className="mt-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[2px] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
    </div>
  );
}
