"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

export default function AreaLeadForm({
  areaName,
  sourcePath,
}: {
  areaName: string;
  sourcePath: string;
}) {
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          intent: "general",
          locale,
          source: "website",
          source_page: sourcePath,
          message: `Interest in area: ${areaName}`,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setName("");
      setEmail("");
      setPhone("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2px] border border-brand-blue/15 bg-[#0A1628]/80 p-5 backdrop-blur-sm"
    >
      <p className="label mb-1">Inquiry</p>
      <p className="font-display text-xl text-pearl">Interested in this area?</p>
      <div className="mt-5 space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full rounded-[2px] border border-brand-blue/15 bg-transparent px-3 py-2.5 text-sm text-pearl placeholder:text-slate-dark focus:border-gold focus:outline-none"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-[2px] border border-brand-blue/15 bg-transparent px-3 py-2.5 text-sm text-pearl placeholder:text-slate-dark focus:border-gold focus:outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="w-full rounded-[2px] border border-brand-blue/15 bg-transparent px-3 py-2.5 text-sm text-pearl placeholder:text-slate-dark focus:border-gold focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold mt-5 w-full disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>
      {status === "ok" ? (
        <p className="mt-3 text-xs text-slate">Thank you — we will be in touch.</p>
      ) : null}
      {status === "err" ? (
        <p className="mt-3 text-xs text-coral">Something went wrong. Try again.</p>
      ) : null}
    </form>
  );
}
