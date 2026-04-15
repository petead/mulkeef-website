import { useTranslations } from "next-intl";
import { Shield, Users, Award, TrendingUp } from "lucide-react";

const stats = [
  { value: "500+", label: "Properties Sold" },
  { value: "1,200+", label: "Happy Clients" },
  { value: "8+", label: "Years Experience" },
  { value: "40+", label: "Communities" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "Every transaction is handled with complete transparency. No hidden fees, no surprises — just honest, professional service backed by RERA licensing.",
  },
  {
    icon: Users,
    title: "Client-First Approach",
    desc: "Your goals drive everything we do. We listen, understand your needs, and deliver personalized solutions that match your lifestyle and investment objectives.",
  },
  {
    icon: Award,
    title: "Market Expertise",
    desc: "Deep knowledge of Dubai's neighborhoods, market trends, and investment opportunities. Our agents specialize in specific communities for unmatched local insight.",
  },
  {
    icon: TrendingUp,
    title: "Innovation & Technology",
    desc: "We leverage cutting-edge technology to streamline your experience — from virtual tours and AI-powered recommendations to seamless digital transactions.",
  },
];

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-navy">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="section-label mb-4">{t("nav.about")}</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-pearl leading-tight mb-6">
            Your Trusted Partner in Dubai Real Estate
          </h1>
          <p className="text-slate text-lg leading-relaxed max-w-2xl mx-auto">
            MULKEEF Real Estate is a Dubai-based agency committed to empowering clients
            with trusted, innovative, and dynamic real estate solutions. We facilitate seamless
            property transactions through expertise, transparency, and a personalized approach.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-navy-light border-y border-brand-blue/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="font-mono text-3xl lg:text-4xl font-bold text-gold mb-2">{stat.value}</div>
                <div className="text-sm text-slate">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-label mb-3">Our Values</div>
            <h2 className="section-title">What Sets Us Apart</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-8 group hover:bg-navy-medium transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <v.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="font-display font-bold text-xl text-pearl mb-3">{v.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RERA */}
      <section className="py-16 bg-navy-light">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-gold text-sm font-semibold tracking-wider uppercase mb-4">
            <div className="w-2 h-2 rounded-full bg-gold" />
            RERA Licensed Brokerage
          </div>
          <p className="text-slate leading-relaxed">
            MULKEEF Real Estate LLC is fully licensed and regulated by the Real Estate Regulatory
            Agency (RERA) of Dubai. All our agents hold valid RERA broker cards and undergo
            annual recertification to ensure compliance with the latest regulations.
          </p>
        </div>
      </section>
    </div>
  );
}
