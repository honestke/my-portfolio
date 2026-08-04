export type BlogPostStatus = "draft" | "scheduled" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_path: string | null;
  tags: string[];
  category: string | null;
  status: BlogPostStatus;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuing_org: string | null;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  file_path: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ResearchPaper = {
  id: string;
  title: string;
  slug: string;
  abstract: string | null;
  authors: string | null;
  publish_date: string | null;
  keywords: string[];
  pdf_path: string | null;
  citation: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  id: string;
  label: string;
  file_path: string;
  is_default: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  title: string | null;
  description: string | null;
  image_path: string;
  category: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type YoutubeVideo = {
  id: string;
  video_url: string;
  video_id: string;
  title: string | null;
  description: string | null;
  thumbnail_path: string | null;
  published_at: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  github_username: string | null;
  linkedin_url: string | null;
  linkedin_summary: string | null;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export type InteractionEventKind = "pageview" | "download" | "outbound_click";

export type InteractionEvent = {
  id: string;
  kind: InteractionEventKind;
  path: string | null;
  target: string | null;
  referrer: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  created_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string | null;
  proficiency: number;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkExperience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

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
