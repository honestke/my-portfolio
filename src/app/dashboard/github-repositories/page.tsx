import { createClient } from "@/lib/supabase/server";
import { fetchGitHubRepos } from "@/lib/github";
import { GitHubRepoCard } from "@/components/GitHubRepoCard";
import { updateGithubUsername } from "./actions";

export default async function GithubRepositoriesPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("github_username")
    .eq("id", 1)
    .single();

  const repos = await fetchGitHubRepos(settings?.github_username);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">GitHub Repositories</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Repos sync automatically from your public GitHub profile — no manual uploads needed.
      </p>

      <form action={updateGithubUsername} className="mt-6 flex max-w-md items-end gap-3">
        <div className="flex-1">
          <label htmlFor="github_username" className="mb-1 block text-sm text-neutral-300">
            GitHub username
          </label>
          <input
            id="github_username"
            name="github_username"
            type="text"
            defaultValue={settings?.github_username ?? ""}
            placeholder="honestke"
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Save
        </button>
      </form>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-medium text-neutral-400">Live preview</h2>
        {repos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm text-neutral-400">
              No repositories found — check the username above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <GitHubRepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
