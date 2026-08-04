"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { dashboardNav } from "@/lib/dashboard-nav";
import { logout } from "@/app/login/actions";

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="border-b border-neutral-800 px-5 py-5">
        <p className="text-sm font-semibold text-white">Portfolio CMS</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
          router.push(`/dashboard/search?q=${encodeURIComponent(q)}`);
        }}
        className="border-b border-neutral-800 px-3 py-3"
      >
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            name="q"
            type="text"
            placeholder="Search everything..."
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 py-1.5 pl-8 pr-2 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
      </form>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {dashboardNav.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const showBadge = item.href === "/dashboard/contact-information" && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              {item.label}
              {showBadge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 p-3">
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
