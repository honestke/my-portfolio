import { createCertificate } from "../actions";
import { CertificateForm } from "../_components/CertificateForm";

export default async function NewCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Certificate</h1>
      <div className="mt-6">
        <CertificateForm action={createCertificate} error={error} />
      </div>
    </div>
  );
}
