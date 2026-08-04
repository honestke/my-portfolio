-- Phase 5: YouTube videos (curated, admin-managed) and a singleton
-- site_settings row for things like the GitHub username to sync and
-- the LinkedIn profile summary/link.

create table if not exists public.youtube_videos (
  id uuid primary key default gen_random_uuid(),
  video_url text not null,
  video_id text not null,
  title text,
  description text,
  thumbnail_path text,
  published_at date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists youtube_videos_set_updated_at on public.youtube_videos;
create trigger youtube_videos_set_updated_at
before update on public.youtube_videos
for each row execute function public.set_updated_at();

alter table public.youtube_videos enable row level security;

drop policy if exists "Public can view published youtube videos" on public.youtube_videos;
create policy "Public can view published youtube videos"
on public.youtube_videos for select
to anon
using (published = true);

drop policy if exists "Authenticated can view all youtube videos" on public.youtube_videos;
create policy "Authenticated can view all youtube videos"
on public.youtube_videos for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert youtube videos" on public.youtube_videos;
create policy "Authenticated can insert youtube videos"
on public.youtube_videos for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update youtube videos" on public.youtube_videos;
create policy "Authenticated can update youtube videos"
on public.youtube_videos for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete youtube videos" on public.youtube_videos;
create policy "Authenticated can delete youtube videos"
on public.youtube_videos for delete
to authenticated
using (true);

-- Singleton settings row.
create table if not exists public.site_settings (
  id integer primary key default 1,
  github_username text,
  linkedin_url text,
  linkedin_summary text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
on public.site_settings for select
to anon
using (true);

drop policy if exists "Authenticated can view site settings" on public.site_settings;
create policy "Authenticated can view site settings"
on public.site_settings for select
to authenticated
using (true);

drop policy if exists "Authenticated can update site settings" on public.site_settings;
create policy "Authenticated can update site settings"
on public.site_settings for update
to authenticated
using (true)
with check (true);
