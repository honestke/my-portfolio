export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

const DEFAULT_GITHUB_USERNAME = process.env.GITHUB_USERNAME || "honestke";

export async function fetchGitHubRepos(username?: string | null): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${username || DEFAULT_GITHUB_USERNAME}/repos?sort=updated&per_page=9`,
    { headers, next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  const repos: GitHubRepo[] = await res.json();
  return repos.filter((repo) => !repo.fork && !repo.archived).slice(0, 6);
}
