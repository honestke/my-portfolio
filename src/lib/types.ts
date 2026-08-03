export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  technologies: string[];
  thumbnail_path: string | null;
  file_path: string | null;
  demo_url: string | null;
  github_url: string | null;
  project_date: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};
