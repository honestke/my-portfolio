-- Blog posts: Phase 3. Content is stored as Markdown; the editor supports
-- code blocks and tables via Markdown syntax, and images/files/YouTube
-- embeds via uploaded assets and links resolved at render time.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  featured_image_path text,
  tags text[] not null default '{}',
  category text,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public can view published blog posts" on public.blog_posts;
create policy "Public can view published blog posts"
on public.blog_posts for select
to anon
using (
  status = 'published'
  or (status = 'scheduled' and scheduled_for <= now())
);

drop policy if exists "Authenticated can view all blog posts" on public.blog_posts;
create policy "Authenticated can view all blog posts"
on public.blog_posts for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert blog posts" on public.blog_posts;
create policy "Authenticated can insert blog posts"
on public.blog_posts for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update blog posts" on public.blog_posts;
create policy "Authenticated can update blog posts"
on public.blog_posts for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete blog posts" on public.blog_posts;
create policy "Authenticated can delete blog posts"
on public.blog_posts for delete
to authenticated
using (true);

-- Storage bucket for featured images, in-post images, and downloadable files.
insert into storage.buckets (id, name, public)
values ('blog-assets', 'blog-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view blog assets" on storage.objects;
create policy "Public can view blog assets"
on storage.objects for select
to public
using (bucket_id = 'blog-assets');

drop policy if exists "Authenticated can upload blog assets" on storage.objects;
create policy "Authenticated can upload blog assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-assets');

drop policy if exists "Authenticated can update blog assets" on storage.objects;
create policy "Authenticated can update blog assets"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-assets');

drop policy if exists "Authenticated can delete blog assets" on storage.objects;
create policy "Authenticated can delete blog assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-assets');
