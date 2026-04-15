"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, MessageCircle, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/utils";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
      intent: form.get("intent"),
      locale,
      source: "contact-page",
    };

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Info */}
          <div>
            <div className="section-label mb-4">MULKEEF Real Estate</div>
            <h1 className="section-title mb-6">{t("title")}</h1>
            <p className="text-slate text-lg leading-relaxed mb-10">
              Whether you're looking to buy, rent, or invest — our team of RERA-certified
              experts is here to help you navigate the Dubai property market with confidence.
            </p>

            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Address", value: "Dubai, United Arab Emirates" },
                { icon: Mail, label: "Email", value: "info@mulkeef.com", href: "mailto:info@mulkeef.com" },
                { icon: Phone, label: "WhatsApp", value: "+971 58 576 5719", href: WHATSAPP_URL },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-slate uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener" className="text-pearl hover:text-brand-blue transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-pearl">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              className="mt-10 inline-flex items-center gap-3 px-6 py-3.5 bg-emerald/10 border border-emerald/30 rounded-btn text-emerald font-semibold hover:bg-emerald/15 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Prefer WhatsApp? Chat with us directly
            </a>
          </div>

          {/* Right — Form */}
          <div>
            <div className="card p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-4" />
                  <h3 className="font-display font-bold text-2xl text-pearl mb-2">Thank you!</h3>
                  <p className="text-slate">{t("success")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs text-slate font-semibold uppercase tracking-wider mb-2 block">
                      {t("name")} *
                    </label>
                    <input name="name" required className="input-field w-full" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate font-semibold uppercase tracking-wider mb-2 block">
                        {t("email")} *
                      </label>
                      <input name="email" type="email" required className="input-field w-full" />
                    </div>
                    <div>
                      <label className="text-xs text-slate font-semibold uppercase tracking-wider mb-2 block">
                        {t("phone")}
                      </label>
                      <input name="phone" type="tel" className="input-field w-full" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate font-semibold uppercase tracking-wider mb-2 block">
                      {t("intent")} *
                    </label>
                    <select name="intent" required className="input-field w-full bg-navy-light">
                      <option value="">Select...</option>
                      <option value="buy">Buying a property</option>
                      <option value="rent">Renting a property</option>
                      <option value="offplan">Off-plan investment</option>
                      <option value="valuation">Property valuation</option>
                      <option value="general">General inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate font-semibold uppercase tracking-wider mb-2 block">
                      {t("message")}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      className="input-field w-full resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : t("send")}
                    <Send className="w-4 h-4" />
                  </button>

                  <p className="text-xs text-slate-dark text-center">
                    We typically respond within 30 minutes during business hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
