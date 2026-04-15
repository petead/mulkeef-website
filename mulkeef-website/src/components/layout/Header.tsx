"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/routing";
import { locales, localeFlags, localeNames, type Locale } from "@/lib/i18n/routing";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { label: t("buy"), href: "/properties?type=sale" },
    { label: t("rent"), href: "/properties?type=rent" },
    { label: t("offplan"), href: "/off-plan" },
    { label: t("services"), href: "/services" },
    { label: t("about"), href: "/about" },
    { label: t("blog"), href: "/blog" },
    { label: t("contact"), href: "/contact" },
  ];

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass bg-navy/80 border-b border-brand-blue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-display font-bold text-2xl text-brand-blue tracking-wide">
              MULKEEF
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  pathname === item.href
                    ? "text-pearl bg-brand-blue/10"
                    : "text-slate hover:text-pearl hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate hover:text-pearl rounded-lg hover:bg-white/5 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{localeFlags[locale]}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", langOpen && "rotate-180")} />
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-navy-light border border-brand-blue/15 rounded-card shadow-2xl z-50 py-2 max-h-80 overflow-y-auto">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          loc === locale
                            ? "text-brand-blue bg-brand-blue/10"
                            : "text-slate hover:text-pearl hover:bg-white/5"
                        )}
                      >
                        <span className="text-base">{localeFlags[loc]}</span>
                        <span>{localeNames[loc]}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <Link href="/contact" className="hidden sm:inline-flex btn-primary text-sm !py-2 !px-4">
              {t("contact")}
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate hover:text-pearl"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-light border-t border-brand-blue/10">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  pathname === item.href
                    ? "text-pearl bg-brand-blue/10"
                    : "text-slate hover:text-pearl hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center btn-primary"
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
