import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, routing } from "@/lib/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LocaleHtmlSync from "@/components/LocaleHtmlSync";

const SITE = "https://www.mulkeef.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = { "x-default": `${SITE}/en` };
  for (const loc of locales) {
    languages[loc] = `${SITE}/${loc}`;
  }
  return {
    alternates: {
      canonical: `${SITE}/${locale}`,
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div className="grain">
      <LocaleHtmlSync />
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <a
          href="https://wa.me/971585765719"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-7 right-7 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-lg transition-transform hover:scale-110"
          aria-label="WhatsApp"
        >
          💬
        </a>
      </NextIntlClientProvider>
    </div>
  );
}
