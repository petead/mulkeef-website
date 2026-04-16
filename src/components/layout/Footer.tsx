"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Instagram, Linkedin, MessageCircle, Youtube } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/utils";

type FooterProps = {
  locale: string;
};

const connectLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/mulkeef",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/mulkeef",
    icon: Linkedin,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@mulkeef",
    icon: Youtube,
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: MessageCircle,
  },
];

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="divider bg-[#060D1B]">
      <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-display text-3xl tracking-[2px] text-white">MULKEEF</p>
            <p className="mt-4 max-w-xs text-[13px] font-light leading-relaxed text-slate-dark">
              {t("tagline")}
            </p>
          </div>

          <div>
            <p className="label">{t("colProperties")}</p>
            <div className="mt-5 space-y-3">
              <Link
                locale={locale}
                href="/properties?type=sale"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("buy")}
              </Link>
              <Link
                locale={locale}
                href="/properties?type=rent"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("rent")}
              </Link>
              <Link
                locale={locale}
                href="/off-plan"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("offplan")}
              </Link>
              <Link
                locale={locale}
                href="/areas"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("areas")}
              </Link>
              <Link
                locale={locale}
                href="/properties"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {t("allProperties")}
              </Link>
            </div>
          </div>

          <div>
            <p className="label">{t("colCompany")}</p>
            <div className="mt-5 space-y-3">
              <Link
                locale={locale}
                href="/about"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("about")}
              </Link>
              <Link
                locale={locale}
                href="/services"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("services")}
              </Link>
              <Link
                locale={locale}
                href="/blog"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("blog")}
              </Link>
              <Link
                locale={locale}
                href="/contact"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {nav("contact")}
              </Link>
              <Link
                locale={locale}
                href="/faq"
                className="block text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
              >
                {t("faq")}
              </Link>
            </div>
          </div>

          <div>
            <p className="label">{t("colLegal")}</p>
            <div className="mt-5 space-y-3 text-[13px] font-light text-slate-dark">
              <p>
                {t("privacy")}{" "}
                <span className="text-slate">({t("legalSoon")})</span>
              </p>
              <p>
                {t("terms")}{" "}
                <span className="text-slate">({t("legalSoon")})</span>
              </p>
            </div>
          </div>

          <div>
            <p className="label">{t("followUs")}</p>
            <div className="mt-5 space-y-3">
              {connectLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] font-light text-slate-dark transition-colors hover:text-pearl"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-brand-blue/10 pt-6 text-xs text-slate-dark md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} MULKEEF Real Estate LLC. {t("rights")}
          </p>
          <p>Dubai, UAE</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-brand-blue via-gold to-brand-blue" />
    </footer>
  );
}
