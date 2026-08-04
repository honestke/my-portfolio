import { Download, Mail, MailOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ContactSubmission } from "@/lib/types";
import { deleteSubmission, toggleRead } from "./actions";

export default async function ContactInboxPage() {
  const supabase = await createClient();
  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const unreadCount = (submissions ?? []).filter((s) => !s.read).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contact Inbox</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-neutral-400">{unreadCount} unread</p>
          )}
        </div>
        <a
          href="/api/contact-submissions/export"
          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          <Download size={14} />
          Export CSV
        </a>
      </div>

      <div className="mt-8 space-y-3">
        {!submissions || submissions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No messages yet.</p>
          </div>
        ) : (
          (submissions as ContactSubmission[]).map((submission) => (
            <div
              key={submission.id}
              className={`rounded-lg border p-4 ${
                submission.read
                  ? "border-neutral-800 bg-neutral-900"
                  : "border-blue-900 bg-blue-950/20"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-white">
                    {submission.name}{" "}
                    <span className="font-normal text-neutral-500">&lt;{submission.email}&gt;</span>
                  </p>
                  {submission.subject && (
                    <p className="mt-1 text-sm text-neutral-300">{submission.subject}</p>
                  )}
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(submission.created_at).toLocaleString()}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-400">{submission.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <a
                  href={`mailto:${submission.email}${submission.subject ? `?subject=Re: ${encodeURIComponent(submission.subject)}` : ""}`}
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Reply
                </a>
                <form action={toggleRead}>
                  <input type="hidden" name="id" value={submission.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 text-neutral-300 underline hover:text-white"
                  >
                    {submission.read ? <Mail size={12} /> : <MailOpen size={12} />}
                    {submission.read ? "Mark unread" : "Mark read"}
                  </button>
                </form>
                <form action={deleteSubmission}>
                  <input type="hidden" name="id" value={submission.id} />
                  <button type="submit" className="text-red-400 underline hover:text-red-300">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
