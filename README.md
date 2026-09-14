# Citizens' Sabha Platform — Level 1 & 2

Level 1 (Citizen View) and Level 2 (Donor View) of the CSP, built exactly to the
tech stack in the build-plan deck:

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Data:** Supabase (Postgres + Row-Level Security)
- **Auth:** Supabase Auth — magic link / OTP for donors only, separate from JMI membership
- **Payments:** Razorpay, verified server-side via webhook — never trusted from the client
- **Email:** Resend, for donation receipts
- **Delivery:** GitHub → Vercel, protected `main`, PR previews, CI (lint + type-check + build)

## Project structure

```
supabase/migrations/    Level 1 and Level 2 schema + RLS policies
supabase/seed.sql       Sample units/initiatives for local dev
src/lib/supabase/       Browser, server (cookie-aware), and admin (service-role) clients
src/lib/queries.ts      Shared read queries (unit tree, funds raised, etc.)
src/lib/razorpay.ts     Order creation + webhook signature verification
src/lib/email.ts        Donation receipt email
src/app/                Pages — see routes below
src/components/         UI building blocks
```

## Routes

**Public (Citizen View — no auth, read-only, cacheable):**
- `/` — national overview + states snapshot + recent activity
- `/units/[slug]` — drill National → State → City/District → Assembly → Ward/Village
- `/initiatives` — directory, filterable by type / justice pillar / status
- `/initiatives/[slug]` — detail: goal, timeline, progress, update feed
- `/reports` — quarterly transparency reports per unit
- `/search` — site-wide search across units and initiatives

**Donor View (Level 2):**
- `/signup`, `/signup/verify` — lightweight donor sign-up (email magic link or phone OTP)
- `/donate/[slug]` — donate to a specific initiative
- `/dashboard` — donation history, receipts, followed initiatives
- `/api/donations/create` — server route: creates the Razorpay order + a pending donation row
- `/api/donations/webhook` — server route: the *only* place a donation is ever marked paid
- `/api/receipts/[id]` — printable receipt, scoped to the signed-in donor

## Local setup

1. Create a Supabase project, then run the migrations against it (via the SQL editor,
   or `supabase db push` if you're using the CLI locally).
2. Optionally run `supabase/seed.sql` for sample data.
3. Copy `.env.example` to `.env.local` and fill in your Supabase, Razorpay, and Resend keys.
4. `npm install`
5. `npm run dev`

## Deploying

- **Frontend → Vercel.** Connect the GitHub repo, auto-deploys on push to `main`,
  PR previews on every pull request. Add the `.env.example` variables in the
  Vercel project settings — never commit real keys.
- **Database → Supabase.** Already hosted; just make sure the project isn't on a
  tier that pauses on inactivity if you expect real traffic.
- **Razorpay webhook:** point it at `https://<your-domain>/api/donations/webhook`
  and set `RAZORPAY_WEBHOOK_SECRET` to the secret Razorpay gives you for that
  endpoint — the route rejects anything that doesn't match.
- **Resend:** verify your sending domain before going live, or receipts will be
  restricted to Resend's sandbox address.

## Security notes (matches the design constraints in the deck)

- `units`, `initiatives`, `initiative_updates`, `financial_reports`: RLS grants
  `anon`/`authenticated` **SELECT only**, and only rows with `is_published = true`
  (units themselves are always visible — status honesty, not gatekeeping).
- `donors`: a donor can only read/write their own row (`id = auth.uid()`).
- `donations`: **no insert/update policy for anon or authenticated** — the only
  writers are the two server routes above, using the service-role key. A donor
  can only ever `SELECT` their own donations.
- The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) is imported through
  `src/lib/supabase/admin.ts`, which is marked `server-only` — it will fail to
  build if anything tries to import it from a Client Component.
- The Razorpay webhook verifies `X-Razorpay-Signature` with a constant-time
  comparison before touching the database.

## What's intentionally out of scope here

Per the deck, Levels 3–7 (Volunteer, Active Member, Committee/Organiser, Unit
Executive, National Executive) and the admin panel are later-stage work, once
there's a team and a moderation process to run them.
