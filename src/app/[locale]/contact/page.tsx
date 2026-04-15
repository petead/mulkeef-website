"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { usePathname } from "@/lib/i18n/routing";
import { WHATSAPP_URL } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_INTL_RE = /^\+[\d\s().-]{8,}$/;

const INTENT_OPTIONS = [
  { value: "buy", labelKey: "buying" },
  { value: "rent", labelKey: "renting" },
  { value: "offplan", labelKey: "offplan" },
  { value: "valuation", labelKey: "valuation" },
  { value: "general", labelKey: "general" },
] as const;

type FieldErrors = Partial<Record<"name" | "email" | "intent" | "phone", string>>;

function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
    }),
    [searchParams]
  );

  const validate = () => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = t("errors.nameRequired");
    if (!email.trim()) next.email = t("errors.emailRequired");
    else if (!EMAIL_RE.test(email.trim())) next.email = t("errors.emailInvalid");
    if (!intent) next.intent = t("errors.intentRequired");
    if (phone.trim() && !PHONE_INTL_RE.test(phone.trim())) next.phone = t("phoneHint");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
        intent: intent || "general",
        locale,
        source: "contact-page",
        source_page: pathname || "/contact",
        ...utm,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.success !== true) {
        setSubmitError(t("errors.submitFailed"));
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(t("errors.submitFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#060D1B] pt-28">
      <section className="section-tight">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-5 md:grid-cols-2 md:px-8">
          <div>
            <div className="label-line label mb-5">
              <span>{t("brandLabel")}</span>
            </div>
            <h1 className="title-lg mb-6">{t("title")}</h1>
            <p className="max-w-[520px] text-sm leading-relaxed text-slate">{t("intro")}</p>

            <div className="mt-10 space-y-6">
              {[
                { icon: MapPin, label: t("addressLabel"), value: t("addressValue"), href: "" },
                { icon: Mail, label: t("emailLabel"), value: t("emailValue"), href: `mailto:${t("emailValue")}` },
                { icon: Phone, label: t("whatsappLabel"), value: t("whatsappValue"), href: WHATSAPP_URL },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] text-slate-dark">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-pearl hover:text-gold">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-pearl">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-brand-blue/12 p-7 md:p-9">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="py-10 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-gold/40 text-gold">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="font-display text-4xl text-pearl">{t("thankYou")}</h2>
                <p className="mt-3 text-sm text-slate">{t("success")}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label mb-1.5 block">{t("name")}</label>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className="input-line"
                  />
                  {errors.name ? <p className="mt-2 text-xs text-coral">{errors.name}</p> : null}
                </div>

                <div>
                  <label className="label mb-1.5 block">{t("email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className="input-line"
                  />
                  {errors.email ? <p className="mt-2 text-xs text-coral">{errors.email}</p> : null}
                </div>

                <div>
                  <label className="label mb-1.5 block">{t("phone")}</label>
                  <input
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+971..."
                    className="input-line"
                  />
                  {errors.phone ? <p className="mt-2 text-xs text-coral">{errors.phone}</p> : null}
                </div>

                <div>
                  <label className="label mb-1.5 block">{t("intent")}</label>
                  <select
                    value={intent}
                    onChange={(e) => {
                      setIntent(e.target.value);
                      if (errors.intent) setErrors((prev) => ({ ...prev, intent: undefined }));
                    }}
                    className="input-line"
                  >
                    <option value="">{t("selectIntent")}</option>
                    {INTENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  {errors.intent ? <p className="mt-2 text-xs text-coral">{errors.intent}</p> : null}
                </div>

                <div>
                  <label className="label mb-1.5 block">{t("message")}</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-line"
                  />
                </div>

                {submitError ? <p className="text-xs text-coral">{submitError}</p> : null}

                <button type="submit" disabled={loading} className="btn-gold w-full">
                  {loading ? t("sending") : t("send")}
                </button>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp inline-flex w-full items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("whatsappCta")}
                </a>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060D1B] pt-24 text-center text-slate">
          …
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  );
}
