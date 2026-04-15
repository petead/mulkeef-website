"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Instagram, Facebook, Linkedin, Youtube, MessageCircle } from "lucide-react";

const socials = [
  { icon: Instagram, href: "https://instagram.com/mulkeef", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/mulkeef", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com/company/mulkeef", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@mulkeef", label: "YouTube" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-navy border-t border-brand-blue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-display font-bold text-2xl text-brand-blue">
              MULKEEF
            </span>
            <p className="mt-4 text-slate text-sm leading-relaxed">
              {t("tagline")}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-wider uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              {t("rera")}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-bold text-sm text-pearl mb-4">
              {t("quickLinks")}
            </h4>
            <div className="space-y-3">
              {[
                { label: nav("buy"), href: "/properties?type=sale" },
                { label: nav("rent"), href: "/properties?type=rent" },
                { label: nav("offplan"), href: "/off-plan" },
                { label: nav("services"), href: "/services" },
                { label: nav("blog"), href: "/blog" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate hover:text-pearl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-bold text-sm text-pearl mb-4">
              {t("contactUs")}
            </h4>
            <div className="space-y-3 text-sm text-slate">
              <p>Dubai, United Arab Emirates</p>
              <a
                href="mailto:info@mulkeef.com"
                className="block hover:text-brand-blue transition-colors"
              >
                info@mulkeef.com
              </a>
              <a
                href="https://wa.me/971585765719"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 hover:text-emerald transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-body font-bold text-sm text-pearl mb-4">
              {t("followUs")}
            </h4>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="w-10 h-10 rounded-lg bg-navy-light border border-brand-blue/10 flex items-center justify-center text-slate hover:text-brand-blue hover:border-brand-blue/30 transition-all"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-brand-blue/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-dark">
            &copy; {new Date().getFullYear()} MULKEEF Real Estate LLC. {t("rights")}
          </p>
          <p className="text-xs text-slate-dark">
            www.mulkeef.com
          </p>
        </div>
      </div>

      {/* Brand accent bottom bar */}
      <div className="h-1 bg-gradient-to-r from-brand-blue via-gold to-brand-blue" />
    </footer>
  );
}
