"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Send,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { usePathname } from "@/lib/i18n/routing";
import { WHATSAPP_URL, cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Loose E.164-style: optional spaces; must start with + */
const PHONE_INTL_RE = /^\+[\d\s().-]{8,}$/;

type FieldErrors = Partial<
  Record<"name" | "email" | "intent" | "phone", string>
>;

const INTENT_OPTIONS = [
  { value: "buy", labelKey: "buying" },
  { value: "rent", labelKey: "renting" },
  { value: "offplan", labelKey: "offplan" },
  { value: "valuation", labelKey: "valuation" },
  { value: "general", labelKey: "general" },
] as const;

function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [intent, setIntent] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
    }),
    [searchParams]
  );

  const fieldClass = useCallback(
    (field: keyof FieldErrors) =>
      cn(
        "input-field w-full",
        errors[field] && "border-coral/80 ring-1 ring-coral/40 focus:border-coral"
      ),
    [errors]
  );

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) next.name = t("errors.nameRequired");
    if (!trimmedEmail) next.email = t("errors.emailRequired");
    else if (!EMAIL_RE.test(trimmedEmail)) next.email = t("errors.emailInvalid");
    if (!intent) next.intent = t("errors.intentRequired");
    if (trimmedPhone && !PHONE_INTL_RE.test(trimmedPhone)) {
      next.phone = t("phoneHint");
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
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

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(t("errors.submitFailed"));
        return;
      }
      if (body?.success !== true) {
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setIntent("");
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-navy pt-20 lg:pt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="section-label mb-4">{t("brandLabel")}</div>
            <h1 className="section-title mb-6">{t("title")}</h1>
            <p className="mb-10 text-lg leading-relaxed text-slate">
              {t("intro")}
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  label: t("addressLabel"),
                  value: t("addressValue"),
                  href: undefined as string | undefined,
                },
                {
                  icon: Mail,
                  label: t("emailLabel"),
                  value: t("emailValue"),
                  href: `mailto:${t("emailValue")}`,
                },
                {
                  icon: Phone,
                  label: t("whatsappLabel"),
                  value: t("whatsappValue"),
                  href: WHATSAPP_URL,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
                    <item.icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pearl transition-colors hover:text-brand-blue-light"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-pearl">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-btn border border-emerald/30 bg-emerald/10 px-6 py-3.5 font-semibold text-emerald transition-colors hover:bg-emerald/15"
            >
              <MessageCircle className="h-5 w-5" />
              {t("whatsappCta")}
            </a>

            <div className="mt-12">
              <h2 className="mb-3 font-body text-xs font-bold uppercase tracking-[3px] text-gold">
                {t("mapTitle")}
              </h2>
              <div className="overflow-hidden rounded-card border border-brand-blue/15 shadow-[0_0_0_1px_rgba(30,79,216,0.12)]">
                <iframe
                  title={t("mapCaption")}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=55.10%2C25.04%2C55.42%2C25.28&layer=mapnik&marker=25.2048%2C55.2708"
                  className="h-[220px] w-full border-0 grayscale-[0.2] contrast-[1.05] sm:h-[260px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-2 text-center text-xs text-slate-dark">
                {t("mapCaption")}
              </p>
            </div>
          </div>

          <div>
            <div
              className={cn(
                "card rounded-card p-8",
                "shadow-[0_0_0_1px_rgba(30,79,216,0.15),0_0_48px_-12px_rgba(30,79,216,0.22)]"
              )}
            >
              {submitted ? (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -25 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald/15 text-emerald"
                  >
                    <CheckCircle className="h-11 w-11" strokeWidth={2} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-2 font-display text-2xl font-bold text-pearl"
                  >
                    {t("thankYou")}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-8 text-slate"
                  >
                    {t("success")}
                  </motion.p>
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    onClick={resetForm}
                    className="btn-outline"
                  >
                    {t("sendAnother")}
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
                      {t("name")}{" "}
                      <span className="text-coral">*</span>
                    </label>
                    <input
                      name="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name)
                          setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      className={fieldClass("name")}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs font-medium text-coral">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
                        {t("email")}{" "}
                        <span className="text-coral">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email)
                            setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        className={fieldClass("email")}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs font-medium text-coral">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
                        {t("phone")}
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone)
                            setErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        placeholder="+971 …"
                        className={fieldClass("phone")}
                        autoComplete="tel"
                      />
                      <p className="mt-1.5 text-xs text-slate-dark">
                        {t("phoneHint")}
                      </p>
                      {errors.phone && (
                        <p className="mt-1.5 text-xs font-medium text-coral">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
                      {t("intent")}{" "}
                      <span className="text-coral">*</span>
                    </label>
                    <select
                      name="intent"
                      value={intent}
                      onChange={(e) => {
                        setIntent(e.target.value);
                        if (errors.intent)
                          setErrors((prev) => ({ ...prev, intent: undefined }));
                      }}
                      className={cn(fieldClass("intent"), "bg-navy-light")}
                    >
                      <option value="">{t("selectIntent")}</option>
                      {INTENT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                    {errors.intent && (
                      <p className="mt-1.5 text-xs font-medium text-coral">
                        {errors.intent}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">
                      {t("message")}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="input-field w-full resize-none"
                    />
                  </div>

                  {submitError && (
                    <p className="text-center text-sm font-medium text-coral">
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="order-2 flex-1 sm:order-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold flex w-full items-center justify-center gap-2 disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
                      >
                        {loading ? t("sending") : t("send")}
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="order-1 sm:order-2 sm:max-w-[240px] sm:text-right">
                      <p className="rounded-lg border border-gold/25 bg-gold/10 px-3 py-2 text-center text-xs font-semibold leading-snug text-gold sm:text-right">
                        {t("responseBadge")}
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy pt-24 text-center text-slate">
          …
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  );
}
