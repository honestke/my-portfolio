-- Phase 4: Certificates, Research Papers, Resume/CV, Gallery.
-- All follow the same reusable pattern established by projects/blog_posts,
-- sharing one storage bucket (content-assets) with folder prefixes per type.

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuing_org text,
  issue_date date,
  credential_id text,
  credential_url text,
  file_path text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.research_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  abstract text,
  authors text,
  publish_date date,
  keywords text[] not null default '{}',
  pdf_path text,
  citation text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  file_path text not null,
  is_default boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  image_path text not null,
  category text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array['certificates', 'research_papers', 'resumes', 'gallery_images']
  loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "Public can view published %I" on public.%I', t, t);
    execute format(
      'create policy "Public can view published %I" on public.%I for select to anon using (published = true)',
      t, t
    );

    execute format('drop policy if exists "Authenticated can view all %I" on public.%I', t, t);
    execute format(
      'create policy "Authenticated can view all %I" on public.%I for select to authenticated using (true)',
      t, t
    );

    execute format('drop policy if exists "Authenticated can insert %I" on public.%I', t, t);
    execute format(
      'create policy "Authenticated can insert %I" on public.%I for insert to authenticated with check (true)',
      t, t
    );

    execute format('drop policy if exists "Authenticated can update %I" on public.%I', t, t);
    execute format(
      'create policy "Authenticated can update %I" on public.%I for update to authenticated using (true) with check (true)',
      t, t
    );

    execute format('drop policy if exists "Authenticated can delete %I" on public.%I', t, t);
    execute format(
      'create policy "Authenticated can delete %I" on public.%I for delete to authenticated using (true)',
      t, t
    );
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('content-assets', 'content-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view content assets" on storage.objects;
create policy "Public can view content assets"
on storage.objects for select
to public
using (bucket_id = 'content-assets');

drop policy if exists "Authenticated can upload content assets" on storage.objects;
create policy "Authenticated can upload content assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'content-assets');

drop policy if exists "Authenticated can update content assets" on storage.objects;
create policy "Authenticated can update content assets"
on storage.objects for update
to authenticated
using (bucket_id = 'content-assets');

drop policy if exists "Authenticated can delete content assets" on storage.objects;
create policy "Authenticated can delete content assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'content-assets');
