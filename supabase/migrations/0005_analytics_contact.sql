-- Phase 6: contact form submissions and lightweight analytics events
-- (pageviews, downloads, outbound clicks). Both tables accept public
-- inserts (visitors submitting the form / triggering tracking) but
-- only the authenticated admin can read or manage them.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Public can submit contact form" on public.contact_submissions;
create policy "Public can submit contact form"
on public.contact_submissions for insert
to anon
with check (true);

drop policy if exists "Authenticated can view contact submissions" on public.contact_submissions;
create policy "Authenticated can view contact submissions"
on public.contact_submissions for select
to authenticated
using (true);

drop policy if exists "Authenticated can update contact submissions" on public.contact_submissions;
create policy "Authenticated can update contact submissions"
on public.contact_submissions for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete contact submissions" on public.contact_submissions;
create policy "Authenticated can delete contact submissions"
on public.contact_submissions for delete
to authenticated
using (true);

create table if not exists public.interaction_events (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('pageview', 'download', 'outbound_click')),
  path text,
  target text,
  referrer text,
  country text,
  device text,
  browser text,
  created_at timestamptz not null default now()
);

create index if not exists interaction_events_created_at_idx on public.interaction_events (created_at);
create index if not exists interaction_events_kind_idx on public.interaction_events (kind);

alter table public.interaction_events enable row level security;

drop policy if exists "Public can log interaction events" on public.interaction_events;
create policy "Public can log interaction events"
on public.interaction_events for insert
to anon
with check (true);

drop policy if exists "Authenticated can view interaction events" on public.interaction_events;
create policy "Authenticated can view interaction events"
on public.interaction_events for select
to authenticated
using (true);
