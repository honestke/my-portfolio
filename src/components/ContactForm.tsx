"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/actions/contact";

const inputClass =
  "w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-emerald";

export function ContactForm({ status }: { status?: "success" | "error" }) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto mt-10 max-w-lg text-left">
      {status === "success" && (
        <div className="mb-4 rounded-md border border-emerald/40 bg-emerald/10 px-3 py-2 text-sm text-emerald">
          Thanks — your message has been sent.
        </div>
      )}
      {status === "error" && (
        <div className="mb-4 rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          Something went wrong. Please fill in all required fields and try again.
        </div>
      )}

      <form
        action={submitContactForm}
        onSubmit={() => setSubmitting(true)}
        className="glass-panel space-y-4 rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input name="name" type="text" placeholder="Your name" required className={inputClass} />
          <input name="email" type="email" placeholder="Your email" required className={inputClass} />
        </div>
        <input name="subject" type="text" placeholder="Subject (optional)" className={inputClass} />
        <textarea
          name="message"
          placeholder="Your message"
          required
          rows={4}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-emerald px-6 py-3 text-sm font-medium text-black transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
