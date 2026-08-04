-- Skills, Work Experience, Education: the missing CV pieces that
-- power the dedicated /portfolio page.

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  proficiency integer not null default 80 check (proficiency between 0 and 100),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  achievements text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field_of_study text,
  start_date date,
  end_date date,
  description text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array['skills', 'work_experience', 'education']
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
