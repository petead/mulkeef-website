"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqCategoryId,
} from "./faq-data";

const ease = [0.16, 1, 0.3, 1] as const;

export default function FaqPageClient() {
  const [cat, setCat] = useState<FaqCategoryId>("buying");
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(() => FAQ_ITEMS[cat], [cat]);

  return (
    <div className="bg-[#060D1B] pt-28">
      <section className="section-tight">
        <div className="mx-auto max-w-[900px] px-5 md:px-8">
          <div className="label-line label mb-6 justify-center md:justify-start">
            <span className="w-0 md:w-8" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h1 className="title-xl text-center md:text-left">
            Your Questions,
            <br />
            <span className="title-italic">Answered</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] text-center text-base font-light leading-relaxed text-slate md:mx-0 md:text-left">
            Straight answers on buying, renting, off-plan, visas, and fees — from a
            RERA-licensed Dubai brokerage.
          </p>
        </div>
      </section>

      <section className="section-tight divider pb-24">
        <div className="mx-auto max-w-[900px] px-5 md:px-8">
          <div className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-brand-blue/10 pb-4">
            {FAQ_CATEGORIES.map((c) => {
              const active = c.id === cat;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCat(c.id);
                    setOpenId(null);
                  }}
                  className={`pb-2 text-[11px] font-semibold uppercase tracking-[2px] transition-colors ${
                    active
                      ? "border-b-2 border-gold text-gold"
                      : "border-b-2 border-transparent text-slate hover:text-pearl"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="divide-y divide-brand-blue/10 border-y border-brand-blue/10">
            {items.map((item) => {
              const open = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-[2px] transition-colors ${
                    open ? "border-l-2 border-gold bg-[#0A1628]/40" : "border-l-2 border-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-start justify-between gap-4 px-4 py-5 text-left"
                  >
                    <span className="font-display text-xl font-medium leading-snug text-pearl">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-5 pl-6 text-[15px] font-light leading-[1.8] text-slate">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
