import { GalleryImageForm } from "../_components/GalleryImageForm";

export default async function NewGalleryImagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Gallery Image</h1>
      <GalleryImageForm error={error} />
    </div>
  );
}
