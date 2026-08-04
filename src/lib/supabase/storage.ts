const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function publicAssetUrl(bucket: string, path: string | null) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function projectAssetUrl(path: string | null) {
  return publicAssetUrl("project-assets", path);
}

export function blogAssetUrl(path: string | null) {
  return publicAssetUrl("blog-assets", path);
}

export function contentAssetUrl(path: string | null) {
  return publicAssetUrl("content-assets", path);
}
