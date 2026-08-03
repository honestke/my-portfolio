-- Projects table: the core content type for Phase 2, and the reusable
-- pattern for every other content type in later phases.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category text,
  technologies text[] not null default '{}',
  thumbnail_path text,
  file_path text,
  demo_url text,
  github_url text,
  project_date date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
on public.projects for select
to anon
using (published = true);

drop policy if exists "Authenticated can view all projects" on public.projects;
create policy "Authenticated can view all projects"
on public.projects for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert projects" on public.projects;
create policy "Authenticated can insert projects"
on public.projects for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update projects" on public.projects;
create policy "Authenticated can update projects"
on public.projects for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete projects" on public.projects;
create policy "Authenticated can delete projects"
on public.projects for delete
to authenticated
using (true);

-- Storage bucket for thumbnails and downloadable files.
insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view project assets" on storage.objects;
create policy "Public can view project assets"
on storage.objects for select
to public
using (bucket_id = 'project-assets');

drop policy if exists "Authenticated can upload project assets" on storage.objects;
create policy "Authenticated can upload project assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-assets');

drop policy if exists "Authenticated can update project assets" on storage.objects;
create policy "Authenticated can update project assets"
on storage.objects for update
to authenticated
using (bucket_id = 'project-assets');

drop policy if exists "Authenticated can delete project assets" on storage.objects;
create policy "Authenticated can delete project assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-assets');
