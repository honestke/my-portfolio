import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type ResultGroup = {
  label: string;
  items: { title: string; href: string; subtitle?: string | null }[];
};

export default async function DashboardSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  const groups: ResultGroup[] = [];

  if (query) {
    const supabase = await createClient();
    const like = `%${query}%`;

    const [projects, posts, papers, certificates] = await Promise.all([
      supabase
        .from("projects")
        .select("id, title, category")
        .or(`title.ilike.${like},description.ilike.${like}`)
        .limit(10),
      supabase
        .from("blog_posts")
        .select("id, title, status")
        .or(`title.ilike.${like},excerpt.ilike.${like},content.ilike.${like}`)
        .limit(10),
      supabase
        .from("research_papers")
        .select("id, title, authors")
        .or(`title.ilike.${like},abstract.ilike.${like}`)
        .limit(10),
      supabase
        .from("certificates")
        .select("id, title, issuing_org")
        .ilike("title", like)
        .limit(10),
    ]);

    if (projects.data && projects.data.length > 0) {
      groups.push({
        label: "Projects",
        items: projects.data.map((p) => ({
          title: p.title,
          subtitle: p.category,
          href: `/dashboard/projects/${p.id}/edit`,
        })),
      });
    }
    if (posts.data && posts.data.length > 0) {
      groups.push({
        label: "Blog Posts",
        items: posts.data.map((p) => ({
          title: p.title,
          subtitle: p.status,
          href: `/dashboard/blog/${p.id}/edit`,
        })),
      });
    }
    if (papers.data && papers.data.length > 0) {
      groups.push({
        label: "Research Papers",
        items: papers.data.map((p) => ({
          title: p.title,
          subtitle: p.authors,
          href: `/dashboard/research-papers/${p.id}/edit`,
        })),
      });
    }
    if (certificates.data && certificates.data.length > 0) {
      groups.push({
        label: "Certificates",
        items: certificates.data.map((c) => ({
          title: c.title,
          subtitle: c.issuing_org,
          href: `/dashboard/certifications/${c.id}/edit`,
        })),
      });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Search</h1>

      <form action="/dashboard/search" className="mt-6 max-w-md">
        <input
          name="q"
          type="text"
          defaultValue={query}
          placeholder="Search projects, posts, papers, certificates..."
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          autoFocus
        />
      </form>

      <div className="mt-8 space-y-8">
        {query && groups.length === 0 && (
          <p className="text-sm text-neutral-400">No results for &ldquo;{query}&rdquo;.</p>
        )}

        {groups.map((group) => (
          <div key={group.label}>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
              {group.label}
            </h2>
            <div className="space-y-2">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm transition hover:border-blue-800"
                >
                  <span className="text-white">{item.title}</span>
                  {item.subtitle && (
                    <span className="ml-2 text-neutral-500">— {item.subtitle}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
