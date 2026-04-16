import { Link } from "@/lib/i18n/routing";

const CHIPS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "market", label: "Market" },
  { id: "investment", label: "Investment" },
  { id: "guide", label: "Guide" },
  { id: "areas", label: "Areas" },
];

function chipClass(active: boolean) {
  return active
    ? "border-b-2 border-gold pb-2 text-[11px] font-semibold uppercase tracking-[2px] text-gold"
    : "border-b-2 border-transparent pb-2 text-[11px] font-semibold uppercase tracking-[2px] text-slate hover:text-pearl";
}

export default function BlogCategoryChips({ active }: { active: string }) {
  return (
    <div className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-brand-blue/10 pb-4">
      {CHIPS.map((c) => {
        const href =
          c.id === "all" ? "/blog" : `/blog?category=${encodeURIComponent(c.id)}`;
        const isActive =
          c.id === "all" ? active === "all" || !active : active === c.id;
        return (
          <Link key={c.id} href={href} className={chipClass(isActive)}>
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}
