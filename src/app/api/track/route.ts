import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseUserAgent } from "@/lib/ua";

export async function POST(request: NextRequest) {
  let body: { kind?: string; path?: string; target?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { kind, path, target } = body;
  if (!kind || !["pageview", "download", "outbound_click"].includes(kind)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { device, browser } = parseUserAgent(request.headers.get("user-agent"));
  const country =
    request.headers.get("x-vercel-ip-country") ?? request.headers.get("x-country") ?? null;
  const referrer = request.headers.get("referer");

  const supabase = await createClient();
  await supabase.from("interaction_events").insert({
    kind,
    path: path ?? null,
    target: target ?? null,
    referrer,
    country,
    device,
    browser,
  });

  return NextResponse.json({ ok: true });
}
