-- Level 1 · Citizen View
-- Read-only public data model. No auth, no payments.
-- anon key: SELECT-only, published rows only.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- units: National → State → City/District → Assembly → Ward/Village
-- ─────────────────────────────────────────────────────────────
create type unit_level as enum ('national', 'state', 'city_district', 'assembly', 'ward_village');
create type unit_status as enum ('working_group', 'chapter');

create table units (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references units(id) on delete restrict,
  level unit_level not null,
  name text not null,
  slug text not null unique,
  -- Honest status: most units start as a Working Group before graduating
  -- to a full Chapter. The UI must always show this, never hide it.
  status unit_status not null default 'working_group',
  description text,
  created_at timestamptz not null default now()
);

create index units_parent_id_idx on units (parent_id);
create index units_level_idx on units (level);

-- ─────────────────────────────────────────────────────────────
-- initiatives: every Project & Campaign, scoped to a unit
-- ─────────────────────────────────────────────────────────────
create type initiative_type as enum ('project', 'campaign');
create type initiative_status as enum ('planned', 'active', 'completed', 'archived');

create table initiatives (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete restrict,
  type initiative_type not null,
  justice_pillar text not null,
  title text not null,
  slug text not null unique,
  summary text not null,
  description text,
  goal_amount numeric(12, 2),
  start_date date not null default current_date,
  end_date date,
  status initiative_status not null default 'planned',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index initiatives_unit_id_idx on initiatives (unit_id);
create index initiatives_status_idx on initiatives (status);
create index initiatives_justice_pillar_idx on initiatives (justice_pillar);
create index initiatives_is_published_idx on initiatives (is_published);

-- ─────────────────────────────────────────────────────────────
-- initiative_updates: the progress/update feed on an initiative
-- ─────────────────────────────────────────────────────────────
create table initiative_updates (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references initiatives(id) on delete cascade,
  title text not null,
  body text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index initiative_updates_initiative_id_idx on initiative_updates (initiative_id);

-- ─────────────────────────────────────────────────────────────
-- financial_reports: quarterly transparency reports, per unit
-- ─────────────────────────────────────────────────────────────
create table financial_reports (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete restrict,
  period_label text not null, -- e.g. "Q1 2026"
  period_start date not null,
  period_end date not null,
  total_income numeric(14, 2) not null default 0,
  total_expenditure numeric(14, 2) not null default 0,
  summary text,
  document_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index financial_reports_unit_id_idx on financial_reports (unit_id);

-- ─────────────────────────────────────────────────────────────
-- Row-Level Security — anon (and authenticated) get SELECT-only,
-- published rows only. All writes happen through Supabase Studio
-- or a service-role script, never through the app.
-- ─────────────────────────────────────────────────────────────
alter table units enable row level security;
alter table initiatives enable row level security;
alter table initiative_updates enable row level security;
alter table financial_reports enable row level security;

create policy "units are public" on units
  for select
  to anon, authenticated
  using (true);

create policy "published initiatives are public" on initiatives
  for select
  to anon, authenticated
  using (is_published = true);

create policy "published updates are public" on initiative_updates
  for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1 from initiatives
      where initiatives.id = initiative_updates.initiative_id
        and initiatives.is_published = true
    )
  );

create policy "published reports are public" on financial_reports
  for select
  to anon, authenticated
  using (is_published = true);

-- ─────────────────────────────────────────────────────────────
-- funds raised per initiative — aggregated once donations exist (Level 2).
-- Safe to create now; returns 0 until the donations table exists is not
-- possible in Postgres, so this view is created in the Level 2 migration
-- once the donations table is in place.
-- ─────────────────────────────────────────────────────────────
