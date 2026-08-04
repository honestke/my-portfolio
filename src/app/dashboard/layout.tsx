import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./_components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: unreadCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900 sm:flex-row">
      <Sidebar unreadCount={unreadCount ?? 0} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
    </div>
  );
}
