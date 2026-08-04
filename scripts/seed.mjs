// One-off seed script: populates every /portfolio section with realistic
// sample data through the same tables + storage the admin panel uses, so
// everything is visible immediately and fully editable/replaceable later.
//
// Run with: node --env-file=.env.local scripts/seed.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const MINIMAL_PDF = Buffer.from(
  `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 150]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 84>>
stream
BT /F1 14 Tf 20 100 Td (Sample Placeholder PDF - Replace in Admin Panel) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R/Size 6>>
`,
  "utf-8",
);

const MINIMAL_CSV = Buffer.from(
  "month,new_customers,churned_customers,churn_rate\nJan,412,38,9.2%\nFeb,455,41,9.0%\nMar,498,35,7.0%\nApr,522,29,5.6%\n",
  "utf-8",
);

async function uploadPlaceholder(bucket, path, buffer, contentType) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Upload failed for ${path}: ${error.message}`);
  return path;
}

async function uploadRemoteImage(bucket, path, seed) {
  const res = await fetch(`https://picsum.photos/seed/${seed}/900/600`);
  if (!res.ok) throw new Error(`Failed to fetch placeholder image for ${seed}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return uploadPlaceholder(bucket, path, buffer, "image/jpeg");
}

async function main() {
  console.log("Uploading placeholder assets...");
  const pdfPath = await uploadPlaceholder(
    "content-assets",
    "seed/sample-placeholder.pdf",
    MINIMAL_PDF,
    "application/pdf",
  );
  const csvPath = await uploadPlaceholder(
    "project-assets",
    "seed/sample-dataset.csv",
    MINIMAL_CSV,
    "text/csv",
  );

  const thumbChurn = await uploadRemoteImage("project-assets", "seed/thumb-churn.jpg", "churn-dashboard");
  const thumbBi = await uploadRemoteImage("project-assets", "seed/thumb-bi.jpg", "sales-bi-report");
  const thumbWeb = await uploadRemoteImage("project-assets", "seed/thumb-web.jpg", "portfolio-web");
  const thumbGame = await uploadRemoteImage("project-assets", "seed/thumb-game.jpg", "puzzle-game");

  const galleryImages = await Promise.all(
    ["workshop", "hackathon", "team-session", "conference-talk"].map((seed, i) =>
      uploadRemoteImage("content-assets", `gallery/seed-${i}.jpg`, seed),
    ),
  );

  console.log("Seeding skills...");
  await supabase.from("skills").insert([
    { name: "Python", category: "Programming", proficiency: 95, sort_order: 1, published: true },
    { name: "SQL", category: "Programming", proficiency: 92, sort_order: 2, published: true },
    { name: "TypeScript", category: "Programming", proficiency: 80, sort_order: 3, published: true },
    { name: "Power BI", category: "Data & BI", proficiency: 90, sort_order: 4, published: true },
    { name: "Excel", category: "Data & BI", proficiency: 95, sort_order: 5, published: true },
    { name: "Tableau", category: "Data & BI", proficiency: 78, sort_order: 6, published: true },
    { name: "Machine Learning", category: "AI & ML", proficiency: 82, sort_order: 7, published: true },
    { name: "TensorFlow", category: "AI & ML", proficiency: 70, sort_order: 8, published: true },
    { name: "React / Next.js", category: "Web Development", proficiency: 85, sort_order: 9, published: true },
    { name: "Git", category: "Tools", proficiency: 88, sort_order: 10, published: true },
  ]);

  console.log("Seeding work experience...");
  await supabase.from("work_experience").insert([
    {
      company: "Nova Analytics Group",
      role: "Data Analyst",
      location: "Remote",
      start_date: "2023-06-01",
      end_date: null,
      is_current: true,
      description: "Sample entry — replace with your real role. Own end-to-end reporting for the growth team, from raw data pipelines to executive dashboards.",
      achievements: [
        "Built a Power BI reporting suite adopted by 4 departments",
        "Reduced monthly reporting time from 3 days to 4 hours through automation",
        "Led a data cleaning initiative that improved forecast accuracy by 18%",
      ],
      sort_order: 1,
      published: true,
    },
    {
      company: "BrightPath Consulting",
      role: "Junior Data Analyst",
      location: "Nairobi, Kenya",
      start_date: "2021-09-01",
      end_date: "2023-05-31",
      is_current: false,
      description: "Sample entry — replace with your real role. Supported client-facing analytics engagements across retail and finance sectors.",
      achievements: [
        "Delivered 12+ client dashboards using Excel and Power BI",
        "Automated recurring data pulls, saving ~10 hours/week team-wide",
      ],
      sort_order: 2,
      published: true,
    },
  ]);

  console.log("Seeding education...");
  await supabase.from("education").insert([
    {
      institution: "Horizon State University",
      degree: "B.Sc.",
      field_of_study: "Statistics",
      start_date: "2018-09-01",
      end_date: "2022-06-01",
      description: "Sample entry — replace with your real degree. Coursework in applied statistics, probability, and data science.",
      sort_order: 1,
      published: true,
    },
  ]);

  console.log("Seeding projects...");
  await supabase.from("projects").insert([
    {
      title: "Customer Churn Prediction Dashboard",
      slug: "customer-churn-prediction-dashboard",
      description: "Sample project — replace with your real work. An interactive dashboard predicting customer churn risk using a Random Forest model, with a live dataset explorer.",
      category: "Data Analysis",
      technologies: ["Python", "Pandas", "scikit-learn", "Matplotlib"],
      thumbnail_path: thumbChurn,
      file_path: csvPath,
      demo_url: null,
      github_url: null,
      project_date: "2024-03-15",
      published: true,
    },
    {
      title: "Sales Performance Power BI Report",
      slug: "sales-performance-power-bi-report",
      description: "Sample project — replace with your real work. A multi-page Power BI report tracking regional sales performance, targets, and rep leaderboards.",
      category: "Power BI Report",
      technologies: ["Power BI", "DAX", "SQL"],
      thumbnail_path: thumbBi,
      file_path: null,
      demo_url: null,
      github_url: null,
      project_date: "2024-06-10",
      published: true,
    },
    {
      title: "Portfolio Website Redesign",
      slug: "portfolio-website-redesign",
      description: "Sample project — replace with your real work. This very site — a Next.js + Supabase portfolio with a full admin CMS.",
      category: "Web App",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      thumbnail_path: thumbWeb,
      file_path: null,
      demo_url: null,
      github_url: null,
      project_date: "2026-08-01",
      published: true,
    },
    {
      title: "Statistical Analysis Research Toolkit",
      slug: "statistical-analysis-research-toolkit",
      description: "Sample project — replace with your real work. A reusable toolkit of statistical test scripts (t-tests, ANOVA, regression diagnostics) with a written methodology paper.",
      category: "Research Document",
      technologies: ["Python", "R", "Statistics"],
      thumbnail_path: null,
      file_path: pdfPath,
      demo_url: null,
      github_url: null,
      project_date: "2023-11-20",
      published: true,
    },
    {
      title: "2048 Puzzle Game",
      slug: "2048-puzzle-game",
      description: "Sample project — replace with your real work. A browser-based clone of the 2048 puzzle game with smooth tile animations.",
      category: "Funzone",
      technologies: ["JavaScript", "HTML5 Canvas", "CSS"],
      thumbnail_path: thumbGame,
      file_path: null,
      demo_url: null,
      github_url: null,
      project_date: "2024-01-05",
      published: true,
    },
  ]);

  console.log("Seeding certificates...");
  await supabase.from("certificates").insert([
    {
      title: "Google Data Analytics Professional Certificate",
      issuing_org: "Google (via Coursera)",
      issue_date: "2023-08-01",
      credential_id: "SAMPLE-CERT-001",
      credential_url: null,
      file_path: pdfPath,
      published: true,
    },
    {
      title: "Microsoft Power BI Data Analyst Associate (PL-300)",
      issuing_org: "Microsoft",
      issue_date: "2024-01-15",
      credential_id: "SAMPLE-CERT-002",
      credential_url: null,
      file_path: pdfPath,
      published: true,
    },
    {
      title: "AWS Certified Cloud Practitioner",
      issuing_org: "Amazon Web Services",
      issue_date: "2024-05-10",
      credential_id: "SAMPLE-CERT-003",
      credential_url: null,
      file_path: pdfPath,
      published: true,
    },
  ]);

  console.log("Seeding research paper...");
  await supabase.from("research_papers").insert([
    {
      title: "Predictive Modeling Approaches for Customer Retention in E-Commerce",
      slug: "predictive-modeling-customer-retention-ecommerce",
      abstract: "Sample entry — replace with your real paper. This paper compares logistic regression, random forest, and gradient boosting models for predicting customer churn in e-commerce, finding gradient boosting achieves the best F1 score on imbalanced retention data.",
      authors: "Honest Mbeheze",
      publish_date: "2024-02-01",
      keywords: ["Machine Learning", "Customer Analytics", "Predictive Modeling", "E-Commerce"],
      pdf_path: pdfPath,
      citation: "Mbeheze, H. (2024). Predictive Modeling Approaches for Customer Retention in E-Commerce. Sample Journal of Applied Data Science, 1(1), 1-10.",
      published: true,
    },
  ]);

  console.log("Seeding gallery...");
  await supabase.from("gallery_images").insert(
    galleryImages.map((path, i) => ({
      title: ["Data Visualization Workshop", "Hackathon 2024", "Team Analytics Session", "Conference Talk"][i],
      description: "Sample gallery image — replace with your real photos.",
      image_path: path,
      category: "Events",
      sort_order: i,
      published: true,
    })),
  );

  console.log("Seeding YouTube video...");
  await supabase.from("youtube_videos").insert([
    {
      video_url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      video_id: "aqz-KE-bpKQ",
      title: "Sample Video — Replace with Your Own",
      description: "Sample entry — replace with a real video walkthrough of one of your projects.",
      thumbnail_path: null,
      published_at: "2024-04-01",
      published: true,
    },
  ]);

  console.log("Updating site settings...");
  await supabase
    .from("site_settings")
    .update({
      linkedin_summary:
        "Sample summary — replace with your own. Data Analyst and AI Integration Specialist passionate about turning raw data into decisions.",
    })
    .eq("id", 1);

  console.log("\nDone. All sample content is published and editable from the dashboard.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
