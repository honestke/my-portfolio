import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Download, FileText } from "lucide-react";
import { parseContent } from "@/lib/markdown";

export function MarkdownContent({ content }: { content: string }) {
  const segments = parseContent(content);

  return (
    <div className="space-y-6">
      {segments.map((segment, index) => {
        if (segment.type === "markdown") {
          if (!segment.value.trim()) return null;
          return (
            <div
              key={index}
              className="prose prose-invert prose-headings:font-display max-w-none prose-a:text-emerald prose-img:rounded-xl"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {segment.value}
              </ReactMarkdown>
            </div>
          );
        }

        if (segment.type === "youtube") {
          return (
            <div key={index} className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                src={`https://www.youtube.com/embed/${segment.id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          );
        }

        if (segment.type === "pdf") {
          return (
            <div key={index} className="overflow-hidden rounded-xl border border-white/10">
              <iframe src={segment.url} title={segment.name} className="h-[600px] w-full" />
              <a
                href={segment.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border-t border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-300 transition hover:text-white"
              >
                <FileText size={16} />
                {segment.name}
              </a>
            </div>
          );
        }

        return (
          <a
            key={index}
            href={segment.url}
            target="_blank"
            rel="noreferrer"
            className="glass-panel flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white transition hover:border-emerald/40"
          >
            <Download size={16} className="text-emerald" />
            {segment.name}
          </a>
        );
      })}
    </div>
  );
}
