import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { blogAssetUrl } from "@/lib/supabase/storage";
import { updatePost } from "../../actions";
import { PostForm } from "../../_components/PostForm";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).single();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit Post</h1>
      <div className="mt-6">
        <PostForm
          action={updatePost}
          post={post}
          error={error}
          featuredImageUrl={blogAssetUrl(post.featured_image_path)}
        />
      </div>
    </div>
  );
}
