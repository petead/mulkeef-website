"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Link,
  usePathname,
  useRouter,
  locales,
  type Locale,
} from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = [
    { label: t("buy"), href: "/properties?listing=sale" },
    { label: t("rent"), href: "/properties?listing=rent" },
    { label: t("offplan"), href: "/off-plan" },
    { label: t("services"), href: "/services" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  const switchLocale = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
    setLangOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-20 transition-all duration-500",
          scrolled
            ? "border-b border-brand-blue/10 bg-[#060D1B]/75 backdrop-blur-[20px] backdrop-saturate-[180%]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="leading-none">
            <span className="font-display text-[28px] font-semibold tracking-[4px] text-white">
              MULKEEF
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[3px] text-gold">
              Dubai
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((open) => !open)}
                className="text-xs uppercase tracking-[2px] text-slate transition-colors hover:text-pearl"
              >
                {`🌐 ${locale.toUpperCase()}`}
              </button>
              {langOpen ? (
                <div className="absolute right-0 top-9 min-w-[120px] border border-brand-blue/10 bg-[#091327] p-2">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        "block w-full px-2 py-1 text-left text-xs uppercase tracking-[2px] transition-colors",
                        loc === locale
                          ? "text-gold"
                          : "text-slate hover:text-pearl"
                      )}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <Link href="/contact" className="btn-gold">
              INQUIRE
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center text-pearl lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-[#060D1B]/95 lg:hidden">
          <div className="mx-auto flex h-full max-w-[1280px] flex-col px-6 pb-10 pt-24">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[3px] text-slate">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setLangOpen((open) => !open)}
                className="text-xs uppercase tracking-[2px] text-slate hover:text-pearl"
              >
                {`🌐 ${locale.toUpperCase()}`}
              </button>
            </div>

            {langOpen ? (
              <div className="mb-8 flex flex-wrap gap-3">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => switchLocale(loc)}
                    className={cn(
                      "border border-brand-blue/20 px-3 py-2 text-xs uppercase tracking-[2px]",
                      loc === locale ? "text-gold" : "text-slate"
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex flex-1 flex-col justify-center gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-4xl leading-none text-pearl"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-gold mt-8 w-full text-center"
            >
              INQUIRE
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
