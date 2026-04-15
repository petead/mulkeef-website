import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MULKEEF Real Estate | Dubai Property Experts",
    template: "%s | MULKEEF Real Estate",
  },
  description:
    "Trusted real estate agency in Dubai. Buy, rent, or invest in premium properties across Dubai's most prestigious communities. RERA licensed.",
  metadataBase: new URL("https://www.mulkeef.com"),
  openGraph: {
    type: "website",
    siteName: "MULKEEF Real Estate",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mulkeef_ae",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
