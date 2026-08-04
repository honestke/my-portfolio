// One-off script: replaces the fake sample data from scripts/seed.mjs
// (and any manual test entries) with real data from the user's resume,
// in skills, work_experience, education, and certificates.
//
// Run with: node --env-file=.env.local scripts/update-real-data.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function clearTable(table) {
  const { error } = await supabase.from(table).delete().not("id", "is", null);
  if (error) throw new Error(`Failed to clear ${table}: ${error.message}`);
  console.log(`Cleared ${table}`);
}

async function main() {
  await clearTable("skills");
  await clearTable("work_experience");
  await clearTable("education");
  await clearTable("certificates");

  console.log("Inserting real skills...");
  await supabase.from("skills").insert([
    { name: "Statistical Modeling", category: "Data & Statistics", proficiency: 85, sort_order: 1, published: true },
    { name: "Hypothesis Testing", category: "Data & Statistics", proficiency: 80, sort_order: 2, published: true },
    { name: "Trend Analysis", category: "Data & Statistics", proficiency: 85, sort_order: 3, published: true },
    { name: "Excel (Advanced)", category: "Visualization", proficiency: 95, sort_order: 4, published: true },
    { name: "Power BI", category: "Visualization", proficiency: 90, sort_order: 5, published: true },
    { name: "Dashboard Development", category: "Visualization", proficiency: 90, sort_order: 6, published: true },
    { name: "AI-Enhanced Analytics", category: "AI & Automation", proficiency: 80, sort_order: 7, published: true },
    { name: "Workflow Automation", category: "AI & Automation", proficiency: 80, sort_order: 8, published: true },
    { name: "Decentralized Systems Research", category: "Blockchain", proficiency: 75, sort_order: 9, published: true },
    { name: "Web Development", category: "Web", proficiency: 55, sort_order: 10, published: true },
  ]);

  console.log("Inserting real work experience...");
  await supabase.from("work_experience").insert([
    {
      company: "Freelance / Self-Employed",
      role: "Data & Analytics Consultant",
      location: "Nairobi, Kenya",
      start_date: null,
      end_date: null,
      is_current: true,
      description: "Independent consulting across data analytics, AI automation, and blockchain research.",
      achievements: [
        "Developed interactive dashboards (Excel, Power BI)",
        "Applied statistical analysis for client insights",
        "Implemented AI automation workflows",
        "Conducted blockchain research & data analysis",
      ],
      sort_order: 1,
      published: true,
    },
  ]);

  console.log("Inserting real education...");
  await supabase.from("education").insert([
    {
      institution: "Machakos University",
      degree: "Economics & Statistics",
      field_of_study: null,
      start_date: "2019-01-01",
      end_date: "2022-01-01",
      description: null,
      sort_order: 1,
      published: true,
    },
    {
      institution: "Kips Technical College",
      degree: "Short Course",
      field_of_study: null,
      start_date: "2019-01-01",
      end_date: "2019-01-01",
      description: null,
      sort_order: 2,
      published: true,
    },
    {
      institution: "Mbale Boys High School",
      degree: "Secondary Education",
      field_of_study: null,
      start_date: "2015-01-01",
      end_date: "2018-01-01",
      description: null,
      sort_order: 3,
      published: true,
    },
    {
      institution: "Moi Air Base Primary School",
      degree: "Primary Education",
      field_of_study: null,
      start_date: null,
      end_date: "2014-01-01",
      description: null,
      sort_order: 4,
      published: true,
    },
  ]);

  console.log("Inserting real certifications...");
  await supabase.from("certificates").insert([
    { title: "HubSpot Certified", issuing_org: "HubSpot", issue_date: null, credential_id: null, credential_url: null, file_path: null, published: true },
    { title: "Microsoft Excel Expert", issuing_org: "Microsoft", issue_date: null, credential_id: null, credential_url: null, file_path: null, published: true },
    { title: "Microsoft Power BI", issuing_org: "Microsoft", issue_date: null, credential_id: null, credential_url: null, file_path: null, published: true },
    { title: "Azure Fundamentals", issuing_org: "Microsoft", issue_date: null, credential_id: null, credential_url: null, file_path: null, published: true },
    { title: "Microsoft Office (Access, Word & PowerPoint)", issuing_org: "Microsoft", issue_date: null, credential_id: null, credential_url: null, file_path: null, published: true },
  ]);

  console.log("Updating profile summary...");
  await supabase
    .from("site_settings")
    .update({
      linkedin_summary:
        "Analytical data specialist skilled in statistics, data visualization, AI integration, blockchain research, and basic web development. Experienced in dashboard creation, freelance analytics projects, and AI-driven workflow automation.",
    })
    .eq("id", 1);

  console.log("\nDone. Real resume data is live and editable from the dashboard.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
