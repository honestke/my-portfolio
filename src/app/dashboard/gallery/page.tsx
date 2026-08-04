import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { contentAssetUrl } from "@/lib/supabase/storage";
import type { GalleryImage } from "@/lib/types";
import { deleteGalleryImage, toggleGalleryPublish } from "./actions";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Gallery</h1>
        <Link
          href="/dashboard/gallery/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Image
        </Link>
      </div>

      <div className="mt-8">
        {!images || images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(images as GalleryImage[]).map((image) => {
              const url = contentAssetUrl(image.image_path);
              return (
                <div key={image.id} className="overflow-hidden rounded-lg border border-neutral-800">
                  <div className="relative aspect-square bg-neutral-950">
                    {url && (
                      <Image src={url} alt={image.title ?? "Gallery image"} fill className="object-cover" />
                    )}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-sm text-white">{image.title ?? "Untitled"}</p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        image.published
                          ? "bg-green-600/15 text-green-400"
                          : "bg-neutral-700/40 text-neutral-400"
                      }`}
                    >
                      {image.published ? "Published" : "Draft"}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <form action={toggleGalleryPublish}>
                        <input type="hidden" name="id" value={image.id} />
                        <button type="submit" className="text-neutral-300 underline hover:text-white">
                          {image.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteGalleryImage}>
                        <input type="hidden" name="id" value={image.id} />
                        <button type="submit" className="text-red-400 underline hover:text-red-300">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
