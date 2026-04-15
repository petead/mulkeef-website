import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, message, intent, locale, source, source_page, property_id, utm_source, utm_medium, utm_campaign } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          message: message || null,
          intent: intent || "general",
          locale: locale || "en",
          source: source || "website",
          source_page: source_page || null,
          property_id: property_id || null,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit lead" },
        { status: 500 }
      );
    }

    // TODO: Phase 6 — Trigger Make.com webhook for:
    // - Email notification to agent
    // - WhatsApp notification
    // - CRM sync

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
