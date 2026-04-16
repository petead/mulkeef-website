export type FaqCategoryId =
  | "buying"
  | "renting"
  | "offplan"
  | "visas"
  | "taxes";

export type FaqItem = { id: string; question: string; answer: string };

export const FAQ_CATEGORIES: { id: FaqCategoryId; label: string }[] = [
  { id: "buying", label: "Buying Property" },
  { id: "renting", label: "Renting Property" },
  { id: "offplan", label: "Off-Plan Investment" },
  { id: "visas", label: "Visas & Residency" },
  { id: "taxes", label: "Taxes & Fees" },
];

export const FAQ_ITEMS: Record<FaqCategoryId, FaqItem[]> = {
  buying: [
    {
      id: "b1",
      question: "Can foreigners buy property in Dubai?",
      answer:
        "Yes, foreigners can own freehold property in designated freehold zones throughout Dubai.",
    },
    {
      id: "b2",
      question: "What is the minimum investment for Dubai property?",
      answer:
        "The minimum varies by area. Apartments in emerging areas like International City start from AED 400,000.",
    },
    {
      id: "b3",
      question: "What are the fees when buying property in Dubai?",
      answer:
        "Main fees: 4% DLD transfer fee, 2% agent commission, AED 4,200 Oqood registration, and optional mortgage fees.",
    },
    {
      id: "b4",
      question: "How long does the buying process take?",
      answer:
        "Typically 30–60 days from offer acceptance to title deed transfer.",
    },
  ],
  renting: [
    {
      id: "r1",
      question: "How much is the security deposit in Dubai?",
      answer:
        "5% of annual rent for unfurnished, 10% for furnished properties.",
    },
    {
      id: "r2",
      question: "What is Ejari?",
      answer:
        "Ejari is the mandatory tenancy contract registration system in Dubai, required by RERA.",
    },
    {
      id: "r3",
      question: "Can I pay rent monthly?",
      answer:
        "Some landlords accept monthly payments, but most require 1–4 cheques annually.",
    },
    {
      id: "r4",
      question: "What documents do I need to rent?",
      answer:
        "Passport, visa, Emirates ID, employment contract or salary certificate.",
    },
  ],
  offplan: [
    {
      id: "o1",
      question: "What does off-plan mean?",
      answer:
        "Buying a property before construction is completed, directly from the developer.",
    },
    {
      id: "o2",
      question: "Are off-plan properties safer now?",
      answer:
        "Yes, Dubai's escrow law protects buyers. Payments go into a regulated escrow account.",
    },
    {
      id: "o3",
      question: "What is the typical payment plan?",
      answer:
        "Common: 10–20% on booking, 50–70% during construction, 10–30% on handover.",
    },
    {
      id: "o4",
      question: "Can I resell before handover?",
      answer:
        "Yes, most developers allow transfer after 30–40% has been paid.",
    },
  ],
  visas: [
    {
      id: "v1",
      question: "What is the Dubai Golden Visa?",
      answer:
        "A 10-year renewable residency for investors with AED 2M+ property investment.",
    },
    {
      id: "v2",
      question: "Can I sponsor family with property ownership?",
      answer:
        "Yes, the Golden Visa allows sponsoring spouse, children, and parents.",
    },
    {
      id: "v3",
      question: "Do I need a visa to buy property?",
      answer: "No, you don't need a UAE visa to purchase property.",
    },
  ],
  taxes: [
    {
      id: "t1",
      question: "Is there property tax in Dubai?",
      answer:
        "No annual property tax. Main costs: 4% DLD transfer on purchase, 5% VAT on commercial.",
    },
    {
      id: "t2",
      question: "Do I pay capital gains tax?",
      answer: "No capital gains tax in the UAE for individuals.",
    },
    {
      id: "t3",
      question: "What about rental income tax?",
      answer: "No income tax on rental income in the UAE.",
    },
  ],
};

export function buildFaqJsonLd() {
  const all = FAQ_CATEGORIES.flatMap((c) => FAQ_ITEMS[c.id]);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}
