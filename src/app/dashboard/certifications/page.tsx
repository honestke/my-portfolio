import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Certificate } from "@/lib/types";
import { deleteCertificate, toggleCertificatePublish } from "./actions";

export default async function CertificationsPage() {
  const supabase = await createClient();
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .order("issue_date", { ascending: false, nullsFirst: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Certifications</h1>
        <Link
          href="/dashboard/certifications/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Certificate
        </Link>
      </div>

      <div className="mt-8">
        {!certificates || certificates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No certificates yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Issuer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900">
                {(certificates as Certificate[]).map((cert) => (
                  <tr key={cert.id}>
                    <td className="px-4 py-3 text-white">{cert.title}</td>
                    <td className="px-4 py-3 text-neutral-400">{cert.issuing_org ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          cert.published
                            ? "bg-green-600/15 text-green-400"
                            : "bg-neutral-700/40 text-neutral-400"
                        }`}
                      >
                        {cert.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <Link
                          href={`/dashboard/certifications/${cert.id}/edit`}
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <form action={toggleCertificatePublish}>
                          <input type="hidden" name="id" value={cert.id} />
                          <button type="submit" className="text-neutral-300 underline hover:text-white">
                            {cert.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteCertificate}>
                          <input type="hidden" name="id" value={cert.id} />
                          <button type="submit" className="text-red-400 underline hover:text-red-300">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
