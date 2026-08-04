export type ContentSegment =
  | { type: "markdown"; value: string }
  | { type: "youtube"; id: string }
  | { type: "pdf"; url: string; name: string }
  | { type: "file"; url: string; name: string };

const TOKEN_RE = /\[\[(youtube|pdf|file):([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = trimmed.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = trimmed.match(/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];
  return trimmed;
}

export function parseContent(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(content))) {
    if (match.index > lastIndex) {
      segments.push({ type: "markdown", value: content.slice(lastIndex, match.index) });
    }

    const [, kind, arg1, arg2] = match;
    if (kind === "youtube") {
      segments.push({ type: "youtube", id: extractYouTubeId(arg1) });
    } else if (kind === "pdf") {
      segments.push({ type: "pdf", url: arg1, name: arg2 ?? "Document.pdf" });
    } else if (kind === "file") {
      segments.push({ type: "file", url: arg1, name: arg2 ?? "Download" });
    }

    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "markdown", value: content.slice(lastIndex) });
  }

  return segments;
}

export function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
