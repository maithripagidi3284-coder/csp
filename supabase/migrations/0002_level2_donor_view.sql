-- Level 2 · Donor View
-- Adds Supabase Auth (magic link / OTP) donor accounts, donations, and follows.
-- A donor profile is explicitly NOT a JMI membership.

-- ─────────────────────────────────────────────────────────────
-- donors: one row per Supabase Auth user who has donated / signed up
-- to donate. id mirrors auth.users.id (1:1).
-- ─────────────────────────────────────────────────────────────
create table donors (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  full_name text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- donations: written server-side only (service role), never from
-- the client. The Razorpay webhook is the only writer of `status`.
-- ─────────────────────────────────────────────────────────────
create type donation_status as enum ('pending', 'paid', 'failed', 'refunded');

create table donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references donors(id) on delete restrict,
  initiative_id uuid not null references initiatives(id) on delete restrict,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'INR',
  status donation_status not null default 'pending',
  razorpay_order_id text unique,
  razorpay_payment_id text,
  receipt_number text unique,
  receipt_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index donations_donor_id_idx on donations (donor_id);
create index donations_initiative_id_idx on donations (initiative_id);
create index donations_status_idx on donations (status);

-- ─────────────────────────────────────────────────────────────
-- initiative_follows: get update notifications without donating again
-- ─────────────────────────────────────────────────────────────
create table initiative_follows (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references donors(id) on delete cascade,
  initiative_id uuid not null references initiatives(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (donor_id, initiative_id)
);

create index initiative_follows_donor_id_idx on initiative_follows (donor_id);
create index initiative_follows_initiative_id_idx on initiative_follows (initiative_id);

-- ─────────────────────────────────────────────────────────────
-- Row-Level Security — a donor reads only their own rows, always.
-- ─────────────────────────────────────────────────────────────
alter table donors enable row level security;
alter table donations enable row level security;
alter table initiative_follows enable row level security;

create policy "a donor reads their own profile" on donors
  for select
  to authenticated
  using (id = auth.uid());

create policy "a donor updates their own profile" on donors
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "a donor creates their own profile" on donors
  for insert
  to authenticated
  with check (id = auth.uid());

-- No insert/update policy for `donations` on anon/authenticated —
-- rows are written exclusively by the service role from the
-- order-create and webhook routes, per the design constraint that
-- "every donation must be verifiable server-side."
create policy "a donor reads their own donations" on donations
  for select
  to authenticated
  using (donor_id = auth.uid());

create policy "a donor manages their own follows" on initiative_follows
  for all
  to authenticated
  using (donor_id = auth.uid())
  with check (donor_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- Aggregate funds raised per initiative — used on initiative detail
-- pages and the directory. Only counts confirmed payments.
-- ─────────────────────────────────────────────────────────────
create view initiative_funds_raised as
select
  initiative_id,
  coalesce(sum(amount), 0) as amount_raised,
  count(*) as donor_count
from donations
where status = 'paid'
group by initiative_id;

grant select on initiative_funds_raised to anon, authenticated;
