import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = [
    ["Name", "Email", "Subject", "Message", "Read", "Submitted At"],
    ...(submissions ?? []).map((s) => [
      s.name,
      s.email,
      s.subject ?? "",
      s.message,
      s.read ? "Yes" : "No",
      s.created_at,
    ]),
  ];

  const csv = rows.map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="contact-submissions.csv"',
    },
  });
}
