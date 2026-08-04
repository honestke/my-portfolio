"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";
import type { YoutubeVideo } from "@/lib/types";
import { contentAssetUrl } from "@/lib/supabase/storage";
import { trackEvent } from "@/lib/track-client";

export function YoutubeVideoCard({ video }: { video: YoutubeVideo }) {
  const [playing, setPlaying] = useState(false);
  const customThumb = contentAssetUrl(video.thumbnail_path);
  const thumbnailUrl = customThumb ?? `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`;
  const date = video.published_at
    ? new Date(video.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition hover:border-emerald/30">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1`}
            title={video.title ?? "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="relative block h-full w-full"
            aria-label={`Play ${video.title ?? "video"}`}
          >
            <Image
              src={thumbnailUrl}
              alt={video.title ?? "YouTube video"}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-black transition group-hover:scale-110">
                <Play size={22} fill="black" />
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {date && <span className="text-xs text-neutral-500">{date}</span>}
        <h3 className="font-display mt-2 text-base font-semibold text-white">
          {video.title ?? "Untitled video"}
        </h3>
        {video.description && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{video.description}</p>
        )}
        <a
          href={video.video_url}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("outbound_click", { target: video.video_url })}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/5"
        >
          <ExternalLink size={14} />
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
