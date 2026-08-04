import { VideoForm } from "../_components/VideoForm";

export default async function NewVideoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New YouTube Video</h1>
      <div className="mt-6">
        <VideoForm error={error} />
      </div>
    </div>
  );
}
