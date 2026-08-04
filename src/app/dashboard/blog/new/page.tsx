import { createPost } from "../actions";
import { PostForm } from "../_components/PostForm";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New Post</h1>
      <div className="mt-6">
        <PostForm action={createPost} error={error} />
      </div>
    </div>
  );
}
