import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { YoutubeVideo } from "@/lib/types";
import { deleteVideo, toggleVideoPublish } from "./actions";

export default async function YoutubeVideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("youtube_videos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">YouTube Videos</h1>
        <Link
          href="/dashboard/youtube-videos/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          New Video
        </Link>
      </div>

      <div className="mt-8">
        {!videos || videos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">No videos yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-950 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 bg-neutral-900">
                {(videos as YoutubeVideo[]).map((video) => (
                  <tr key={video.id}>
                    <td className="px-4 py-3 text-white">{video.title ?? video.video_url}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          video.published
                            ? "bg-green-600/15 text-green-400"
                            : "bg-neutral-700/40 text-neutral-400"
                        }`}
                      >
                        {video.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <form action={toggleVideoPublish}>
                          <input type="hidden" name="id" value={video.id} />
                          <button type="submit" className="text-neutral-300 underline hover:text-white">
                            {video.published ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteVideo}>
                          <input type="hidden" name="id" value={video.id} />
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
