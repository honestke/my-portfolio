import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contentAssetUrl } from "@/lib/supabase/storage";
import { updateCertificate } from "../../actions";
import { CertificateForm } from "../../_components/CertificateForm";

export default async function EditCertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: certificate } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();

  if (!certificate) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit Certificate</h1>
      <div className="mt-6">
        <CertificateForm
          action={updateCertificate}
          certificate={certificate}
          error={error}
          fileUrl={contentAssetUrl(certificate.file_path)}
        />
      </div>
    </div>
  );
}
