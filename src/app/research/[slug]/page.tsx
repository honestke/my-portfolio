import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { contentAssetUrl } from "@/lib/supabase/storage";
import { Navbar } from "@/components/Navbar";
import { CopyButton } from "@/components/CopyButton";

export default async function ResearchPaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: paper } = await supabase
    .from("research_papers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!paper) {
    notFound();
  }

  const pdfUrl = contentAssetUrl(paper.pdf_path);
  const date = paper.publish_date
    ? new Date(paper.publish_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          href="/#research"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to portfolio
        </Link>

        <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
          {date && <span>{date}</span>}
          {paper.authors && (
            <>
              <span>·</span>
              <span>{paper.authors}</span>
            </>
          )}
        </div>

        <h1 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
          {paper.title}
        </h1>

        {paper.keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {paper.keywords.map((kw: string) => (
              <span
                key={kw}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {paper.abstract && (
          <div className="glass-panel mt-8 rounded-xl p-6">
            <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-emerald">
              Abstract
            </h2>
            <p className="text-sm leading-relaxed text-neutral-300">{paper.abstract}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald px-4 py-2 text-sm font-medium text-black transition hover:brightness-110"
            >
              <Download size={14} />
              Download PDF
            </a>
          )}
          {paper.citation && <CopyButton text={paper.citation} />}
        </div>

        {pdfUrl && (
          <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
            <iframe src={pdfUrl} title={paper.title} className="h-[700px] w-full" />
          </div>
        )}

        {paper.citation && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="font-display mb-2 text-sm font-semibold uppercase tracking-widest text-emerald">
              Citation
            </h2>
            <p className="font-mono text-xs leading-relaxed text-neutral-400">{paper.citation}</p>
          </div>
        )}
      </article>
    </div>
  );
}
