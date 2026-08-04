"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Certificate } from "@/lib/types";
import { FileDropzone } from "@/app/dashboard/projects/_components/FileDropzone";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  certificate?: Certificate;
  error?: string;
  fileUrl?: string | null;
};

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export function CertificateForm({ action, certificate, error, fileUrl }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form action={action} onSubmit={() => setSubmitting(true)} className="max-w-2xl space-y-5">
      {certificate && <input type="hidden" name="id" value={certificate.id} />}

      {error && (
        <div className="rounded-md border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input id="title" name="title" type="text" required defaultValue={certificate?.title} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="issuing_org" className={labelClass}>
            Issuing organization
          </label>
          <input
            id="issuing_org"
            name="issuing_org"
            type="text"
            defaultValue={certificate?.issuing_org ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="issue_date" className={labelClass}>
            Issue date
          </label>
          <input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={certificate?.issue_date ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="credential_id" className={labelClass}>
            Credential ID
          </label>
          <input
            id="credential_id"
            name="credential_id"
            type="text"
            defaultValue={certificate?.credential_id ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="credential_url" className={labelClass}>
            Credential URL
          </label>
          <input
            id="credential_url"
            name="credential_url"
            type="url"
            defaultValue={certificate?.credential_url ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <FileDropzone
        name="file"
        label="Certificate file (PDF, image, or badge)"
        existingUrl={fileUrl}
        removeFieldName="remove_file"
      />

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input type="checkbox" name="published" defaultChecked={certificate?.published ?? false} />
        Published (visible on the public site)
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/certifications")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
