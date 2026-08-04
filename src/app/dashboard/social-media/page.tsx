import { createClient } from "@/lib/supabase/server";
import { updateLinkedIn } from "./actions";

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500";
const labelClass = "mb-1 block text-sm text-neutral-300";

export default async function SocialMediaPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("linkedin_url, linkedin_summary")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Social Media</h1>
      <p className="mt-2 text-sm text-neutral-400">
        LinkedIn has no public API for live syncing, so this is a manual profile summary and link.
      </p>

      <form action={updateLinkedIn} className="mt-6 max-w-xl space-y-5">
        <div>
          <label htmlFor="linkedin_url" className={labelClass}>
            LinkedIn profile URL
          </label>
          <input
            id="linkedin_url"
            name="linkedin_url"
            type="url"
            defaultValue={settings?.linkedin_url ?? ""}
            placeholder="https://www.linkedin.com/in/..."
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="linkedin_summary" className={labelClass}>
            Profile summary
          </label>
          <textarea
            id="linkedin_summary"
            name="linkedin_summary"
            rows={4}
            defaultValue={settings?.linkedin_summary ?? ""}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Save
        </button>
      </form>
    </div>
  );
}
