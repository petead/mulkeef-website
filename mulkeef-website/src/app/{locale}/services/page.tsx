import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Home, Key, Building2, Settings, ClipboardCheck, TrendingUp, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Buy Property",
    slug: "buy",
    desc: "From luxury villas on Palm Jumeirah to modern apartments in JVC, we help you find the perfect property that matches your lifestyle and investment goals.",
    features: ["Exclusive listings not available on portals", "Personalized property matching", "Negotiation and price analysis", "End-to-end transaction support", "Mortgage advisory referrals"],
  },
  {
    icon: Key,
    title: "Rent Property",
    slug: "rent",
    desc: "Discover rental properties across Dubai's most desirable communities. We handle everything from viewing to Ejari registration.",
    features: ["Verified listings across all communities", "Virtual tours available", "Ejari registration support", "Lease negotiation", "Move-in condition inspections"],
  },
  {
    icon: Building2,
    title: "Off-Plan Investment",
    slug: "offplan",
    desc: "Access exclusive off-plan projects from Dubai's top developers. We provide detailed ROI analysis and guide you through payment plans.",
    features: ["Direct developer relationships", "Payment plan optimization", "ROI and rental yield analysis", "Construction progress tracking", "Post-handover management"],
  },
  {
    icon: Settings,
    title: "Property Management",
    slug: "management",
    desc: "Full-service property management for landlords. We take care of your property so you can focus on returns.",
    features: ["Tenant sourcing and screening", "Rent collection and remittance", "Maintenance coordination", "Check-in / check-out inspections", "Annual RERA index compliance"],
  },
  {
    icon: ClipboardCheck,
    title: "Property Valuation",
    slug: "valuation",
    desc: "Get an accurate market valuation of your property based on recent transactions, market trends, and comparable analysis.",
    features: ["Comparative market analysis", "Recent transaction data", "Area trend forecasting", "Investment performance review", "Free no-obligation assessment"],
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    slug: "advisory",
    desc: "Strategic investment guidance for building and optimizing your Dubai property portfolio with data-driven insights.",
    features: ["Portfolio diversification strategy", "Market entry timing advice", "Area growth potential analysis", "Tax and visa benefit guidance", "Golden Visa property selection"],
  },
];

export default function ServicesPage() {
  const t = useTranslations();

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-navy">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="section-label mb-4">{t("services.label")}</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-pearl leading-tight mb-6">
            {t("services.title")}
          </h1>
          <p className="text-slate text-lg leading-relaxed max-w-2xl mx-auto">
            From finding your dream home to managing your investment portfolio,
            MULKEEF provides end-to-end real estate services tailored to the Dubai market.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {services.map((svc, i) => (
            <div key={svc.slug} className="card p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left */}
                <div className="lg:col-span-1">
                  <div className="w-14 h-14 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-5">
                    <svc.icon className="w-7 h-7 text-brand-blue" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-pearl mb-3">{svc.title}</h2>
                  <p className="text-sm text-slate leading-relaxed">{svc.desc}</p>
                </div>

                {/* Right — Features */}
                <div className="lg:col-span-2">
                  <h4 className="text-xs text-gold font-semibold uppercase tracking-wider mb-4">What's included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {svc.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-3 text-sm text-slate">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 flex-shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy-light border-t border-brand-blue/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl text-pearl mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-slate mb-8">{t("cta.subtitle")}</p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2">
            {t("cta.btn")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
