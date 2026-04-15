"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bath,
  BedDouble,
  CarFront,
  Check,
  Clipboard,
  ExternalLink,
  Mail,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  Sofa,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

export type PropertyDetailImage = {
  url: string;
  is_cover: boolean;
  position: number;
};

export type PropertyDetailAgent = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  rera_number?: string;
  avatar_url?: string;
};

export type PropertyDetailRecord = {
  id: string;
  slug: string;
  listingType: "sale" | "rent";
  propertyType: string;
  title: string;
  neighborhood: string;
  descriptionHtml: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parking: number;
  furnished: boolean;
  latitude: number | null;
  longitude: number | null;
  referenceNumber: string;
  amenities: Record<string, unknown>;
  highlights: string[];
  images: PropertyDetailImage[];
  agent: PropertyDetailAgent | null;
  localeUsed: string;
};

export type SimilarPropertyCard = {
  id: string;
  title: string;
  neighborhood: string;
  slug: string;
  listingType: "sale" | "rent";
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  images: PropertyDetailImage[];
};

function formatPrice(price: number) {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1).replace(".0", "")}M`;
  if (price >= 1000) return `${Math.round(price / 1000)}K`;
  return `${price}`;
}

function imageCover(images: PropertyDetailImage[]) {
  return images.find((img) => img.is_cover) || images[0];
}

function toAmenityLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function PropertyDetailClient({
  property,
  similar,
  locale,
}: {
  property: PropertyDetailRecord;
  similar: SimilarPropertyCard[];
  locale: string;
}) {
  const t = useTranslations();
  const tp = useTranslations("propertiesPage");
  const tc = useTranslations("contact");

  const images = property.images.length ? property.images : [{ url: "", is_cover: true, position: 0 }];
  const cover = imageCover(images);

  const initialIndex = Math.max(
    0,
    images.findIndex((img) => img.url === cover?.url)
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeImage = images[activeIndex] || cover;
  const amenityList = useMemo(
    () =>
      Object.entries(property.amenities || {})
        .filter(([, value]) => value === true)
        .map(([key]) => toAmenityLabel(key)),
    [property.amenities]
  );

  const agent = property.agent;
  const agentName = agent?.name || "MULKEEF Advisor";
  const agentInitials = agentName
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const agentWhatsapp = String(agent?.whatsapp || "").replace(/\D/g, "");
  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in ${property.title}`
  );
  const whatsappUrl = agentWhatsapp
    ? `https://wa.me/${agentWhatsapp}?text=${whatsappText}`
    : `https://wa.me/971585765719?text=${whatsappText}`;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://www.mulkeef.com/${locale}/properties/${property.slug}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!name.trim() || !email.trim()) {
      setSubmitError(tc("errors.submitFailed"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: message.trim() || `Inquiry for ${property.title}`,
          property_id: property.id,
          property_title: property.title,
          source: "property-detail",
          source_page: `/properties/${property.slug}`,
          intent: property.listingType === "rent" ? "rent" : "buy",
          locale,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.success !== true) {
        setSubmitError(tc("errors.submitFailed"));
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(tc("errors.submitFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="bg-[#060D1B] pt-24">
      <div className="mx-auto max-w-[1280px] px-5 pt-5 text-[11px] tracking-[0.3px] text-slate md:px-8">
        <span>{tp("filtersTitle")}</span>
        <span className="mx-2 text-gold">·</span>
        <span>{property.listingType === "sale" ? t("property.forSale") : t("property.forRent")}</span>
        <span className="mx-2 text-gold">·</span>
        <span className="text-pearl">{property.title}</span>
      </div>

      <section className="relative mt-4">
        <div
          className="relative h-[50vh] min-h-[340px] w-full overflow-hidden md:h-[70vh]"
          onClick={() => setLightboxOpen(true)}
        >
          {activeImage?.url ? (
            <img
              src={activeImage.url}
              alt={property.title}
              className="h-full w-full cursor-zoom-in object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_35%,rgba(30,79,216,0.3),transparent_45%),linear-gradient(130deg,#060D1B_0%,#0A1628_45%,#0F1D35_100%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B] via-transparent to-transparent" />
          <div className="absolute right-5 top-5 border border-pearl/25 bg-[#060D1B]/35 px-3 py-1.5 text-xs text-pearl backdrop-blur-md">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        <div className="mx-auto mt-2 flex max-w-[1280px] gap-[2px] overflow-x-auto px-5 pb-1 md:px-8">
          {images.map((img, idx) => (
            <motion.button
              key={`${img.url}-${idx}`}
              type="button"
              className={`relative h-20 w-[100px] shrink-0 overflow-hidden border-b-2 ${
                idx === activeIndex ? "border-gold" : "border-transparent"
              }`}
              onClick={() => setActiveIndex(idx)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              {img.url ? (
                <img src={img.url} alt={`${property.title} ${idx + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#0F1D35]" />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <Reveal>
              <div className="text-[10px] uppercase tracking-[3px] text-gold">
                {property.propertyType.toUpperCase()} ·{" "}
                {property.listingType === "sale" ? "FOR SALE" : "FOR RENT"}
              </div>
              <h1 className="mt-3 font-display text-[32px] font-medium leading-[1.05] text-pearl md:text-[40px]">
                {property.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate">
                <MapPin className="h-4 w-4" />
                {property.neighborhood}
              </div>
              {property.referenceNumber ? (
                <p className="mt-2 font-mono text-[11px] text-slate-dark">
                  Ref: {property.referenceNumber}
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={0.05} className="mt-8 border-y border-brand-blue/10 py-7">
              <p className="font-mono text-[32px] font-semibold leading-none text-gold">
                {formatPrice(property.price)}{" "}
                <span className="text-[14px] font-normal text-slate">
                  {property.listingType === "rent" ? "/year" : ""}
                </span>
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[2px] text-slate-dark">
                {property.currency || "AED"}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 overflow-x-auto">
              <div className="inline-flex min-w-full items-center gap-0 border-y border-brand-blue/10 py-4">
                {[
                  {
                    icon: BedDouble,
                    value: property.bedrooms > 0 ? property.bedrooms : "Studio",
                    label: t("property.bedrooms"),
                  },
                  {
                    icon: Bath,
                    value: property.bathrooms || "—",
                    label: t("property.bathrooms"),
                  },
                  {
                    icon: Maximize,
                    value: property.areaSqft ? `${property.areaSqft.toLocaleString()} sqft` : "—",
                    label: t("property.area"),
                  },
                  {
                    icon: CarFront,
                    value: property.parking || "—",
                    label: "Parking",
                  },
                  {
                    icon: Sofa,
                    value: property.furnished ? "Yes" : "No",
                    label: "Furnished",
                  },
                ].map((spec, idx) => (
                  <div
                    key={spec.label}
                    className={`flex min-w-[140px] items-center gap-2 px-4 ${
                      idx < 4 ? "border-r border-slate/15" : ""
                    }`}
                  >
                    <spec.icon className="h-4.5 w-4.5 text-slate" />
                    <div>
                      <p className="text-base font-semibold text-pearl">{spec.value}</p>
                      <p className="text-[11px] text-slate">{spec.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14} className="mt-12">
              <div className="label-line label mb-4">
                <span>DESCRIPTION</span>
              </div>
              {property.descriptionHtml ? (
                <div className="property-richtext text-[15px] font-light leading-[1.8] text-slate">
                  <div dangerouslySetInnerHTML={{ __html: property.descriptionHtml }} />
                </div>
              ) : (
                <p className="text-[15px] font-light leading-[1.8] text-slate">
                  {property.shortDescription || "No description available."}
                </p>
              )}
            </Reveal>

            {amenityList.length > 0 ? (
              <Reveal delay={0.2} className="mt-12">
                <div className="label-line label mb-4">
                  <span>AMENITIES</span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3">
                  {amenityList.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-[13px] text-pearl">
                      <Check className="h-3.5 w-3.5 text-gold" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.24} className="mt-12">
              <div className="label-line label mb-4">
                <span>LOCATION</span>
              </div>
              <h2 className="font-display text-2xl text-pearl">{property.neighborhood || "Dubai"}</h2>
              <div className="mt-4 overflow-hidden border border-brand-blue/10">
                {property.latitude && property.longitude ? (
                  <iframe
                    title="Property location map"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.03}%2C${property.latitude - 0.02}%2C${property.longitude + 0.03}%2C${property.latitude + 0.02}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`}
                    className="h-[280px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="h-[280px] bg-[radial-gradient(circle_at_32%_36%,rgba(30,79,216,0.28),transparent_50%),linear-gradient(140deg,#0A1628,#0F1D35)]" />
                )}
              </div>
              {property.highlights.length > 0 ? (
                <p className="mt-3 text-sm text-slate">{property.highlights.join(" · ")}</p>
              ) : null}
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <Reveal>
              <div className="border border-brand-blue/10 p-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-display text-[22px] text-pearl">
                      Inquire About This Property
                    </h3>
                    <p className="text-[12px] text-slate">
                      Our team will respond within 30 minutes
                    </p>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={tc("name")}
                      className="input-line min-h-[44px]"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={tc("email")}
                      className="input-line min-h-[44px]"
                      required
                    />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971"
                      className="input-line min-h-[44px]"
                    />
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={tc("message")}
                      className="input-line resize-none"
                    />

                    <input type="hidden" value={property.id} />
                    <input type="hidden" value={property.title} />
                    <input type="hidden" value="property-detail" />

                    {submitError ? (
                      <p className="text-xs text-coral">{submitError}</p>
                    ) : null}

                    <button
                      type="submit"
                      className="btn-gold min-h-[44px] w-full"
                      disabled={loading}
                    >
                      {loading ? tc("sending") : "SEND INQUIRY"}
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-gold/40 text-gold">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-3xl text-pearl">Thank you</h3>
                  </motion.div>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-6 border border-brand-blue/10 p-5">
              <div className="flex items-center gap-3">
                {agent?.avatar_url ? (
                  <img
                    src={agent.avatar_url}
                    alt={agentName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F1D35] font-display text-lg text-pearl">
                    {agentInitials}
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-pearl">{agentName}</p>
                  <p className="font-mono text-[10px] text-slate-dark">
                    {agent?.rera_number ? `RERA ${agent.rera_number}` : "RERA Licensed"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={agent?.phone ? `tel:${agent.phone}` : "tel:+971585765719"}
                  className="btn-outline py-3 text-center text-[11px] tracking-[1.5px]"
                >
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp py-3 text-center text-[11px] tracking-[1.5px]"
                >
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="mt-6 border border-brand-blue/10 p-5">
              <p className="text-[11px] uppercase tracking-[3px] text-gold">
                Share This Property
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex h-8 w-8 items-center justify-center border border-brand-blue/15 text-slate hover:text-pearl"
                  aria-label="Copy link"
                >
                  <Clipboard className="h-4 w-4" />
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center border border-brand-blue/15 text-slate hover:text-pearl"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareUrl)}`}
                  className="flex h-8 w-8 items-center justify-center border border-brand-blue/15 text-slate hover:text-pearl"
                  aria-label="Share by email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
              {copied ? (
                <p className="mt-2 text-xs text-gold">Link copied</p>
              ) : null}
            </Reveal>
          </aside>
        </div>
      </section>

      {similar.length > 0 ? (
        <section className="section-tight divider">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8">
            <Reveal>
              <div className="label-line label mb-4">
                <span>SIMILAR PROPERTIES</span>
              </div>
              <h2 className="font-display text-[32px] text-pearl">You May Also Like</h2>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {similar.map((item, idx) => {
                const cover = imageCover(item.images);
                return (
                  <Reveal key={item.id} delay={idx * 0.06}>
                    <Link href={`/properties/${item.slug}`} className="property-card group block h-[340px]">
                      {cover?.url ? (
                        <img src={cover.url} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(140deg,#0A1628,#0F1D35)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060D1B]/95 via-[#060D1B]/20 to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-4">
                        <p className="text-[10px] uppercase tracking-[3px] text-gold">{item.neighborhood}</p>
                        <h3 className="mt-1 font-display text-[28px] leading-none text-pearl">{item.title}</h3>
                        <p className="mt-2 text-xs text-slate">
                          {item.bedrooms > 0 ? `${item.bedrooms} Bed · ` : "Studio · "}
                          {item.bathrooms} Bath · {item.areaSqft.toLocaleString()} sqft
                        </p>
                        <p className="price mt-3">
                          {formatPrice(item.price)} AED
                          {item.listingType === "rent" ? " /year" : ""}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-tight divider">
        <div className="mx-auto max-w-[920px] px-5 text-center md:px-8">
          <Reveal>
            <h2 className="font-display text-[28px] text-pearl">
              Ready to schedule a viewing?
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn-gold">
                Book Viewing
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            className="fixed inset-0 z-[120] bg-[#060D1B]/96 p-6 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-pearl/20 text-pearl"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-full max-w-[1400px] flex-col">
              <div className="relative flex-1 overflow-hidden">
                {activeImage?.url ? (
                  <img src={activeImage.url} alt={property.title} className="h-full w-full object-contain" />
                ) : null}
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={`${img.url}-${idx}-lb`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`h-20 w-[110px] shrink-0 overflow-hidden border-b-2 ${
                      idx === activeIndex ? "border-gold" : "border-transparent"
                    }`}
                  >
                    {img.url ? (
                      <img src={img.url} alt={`${property.title} ${idx + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-[#0F1D35]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx global>{`
        .property-richtext p {
          margin-bottom: 16px;
          color: var(--slate);
          line-height: 1.8;
        }
        .property-richtext ul,
        .property-richtext ol {
          margin: 12px 0 18px 18px;
          color: var(--slate);
        }
        .property-richtext li::marker {
          color: var(--gold);
        }
        .property-richtext h2,
        .property-richtext h3,
        .property-richtext h4 {
          font-family: var(--font-cormorant);
          color: var(--pearl);
          margin: 16px 0 8px;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
}
