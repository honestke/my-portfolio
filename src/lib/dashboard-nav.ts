export type NavItem = {
  label: string;
  href: string;
};

export const dashboardNav: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Blog", href: "/dashboard/blog" },
  { label: "Research Papers", href: "/dashboard/research-papers" },
  { label: "Certifications", href: "/dashboard/certifications" },
  { label: "Skills", href: "/dashboard/skills" },
  { label: "Work Experience", href: "/dashboard/work-experience" },
  { label: "Education", href: "/dashboard/education" },
  { label: "GitHub Repositories", href: "/dashboard/github-repositories" },
  { label: "YouTube Videos", href: "/dashboard/youtube-videos" },
  { label: "Resume/CV", href: "/dashboard/resume" },
  { label: "Gallery", href: "/dashboard/gallery" },
  { label: "Contact Information", href: "/dashboard/contact-information" },
  { label: "Social Media", href: "/dashboard/social-media" },
  { label: "Website Settings", href: "/dashboard/settings" },
];
