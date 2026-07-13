# Batangas Youth Civic Hub

An e-civic hub for **Batangas City, Philippines**, built to help the youth easily
access activities and information about their local government. Next.js 14
(App Router, TypeScript) + Tailwind CSS + Supabase (Postgres, Auth, Storage, RLS),
with a built-in CMS at `/admin`. Developed in partnership with the University of
Batangas as a research initiative.

## Tech stack

- **Next.js 14 App Router** with TypeScript and Tailwind CSS (custom map-poster design system)
- **Supabase**: Postgres + Row Level Security, Auth (email + Google OAuth), Storage
- **Tiptap** rich text editor in the CMS
- Deployable to **Vercel**

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Open the **SQL Editor** and run, in order:
   1. the whole of [`supabase/schema.sql`](supabase/schema.sql) — tables, enums, RLS policies, triggers, and the `images` / `documents` storage buckets;
   2. the whole of [`supabase/seed.sql`](supabase/seed.sql) — demo content (news, events, legislation, officials, hotlines, proposals…). Event dates are relative to `now()`, so the demo always shows upcoming events.
3. The storage buckets are created by `schema.sql`. If you prefer, you can also create public buckets named `images` and `documents` manually under **Storage**.

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in from **Project Settings → API**:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | the publishable / anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | server-only; reserved for future jobs (never shipped to the browser) |

### 3. Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### 4. Create the first admin user

1. On the site, click **Sign in → Create a free account** (or use Google).
2. In the Supabase **SQL Editor**, promote your account:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```

3. Reload the site — an **Admin** link appears in the header; the CMS lives at `/admin`.

Roles: **citizen** (RSVP + comment) · **editor** (create/edit drafts) ·
**admin** (publish, delete, moderate comments, manage users). These are enforced
by RLS in the database, not just in the UI.

### 5. Google OAuth (optional)

Enable the **Google** provider in Supabase **Authentication → Providers** and add
`https://<your-domain>/auth/callback` (and the Supabase callback URL Google asks
for) per the Supabase docs. Email/password works out of the box.

## Content management

Everything public-facing comes from the database — news, events (+ RSVPs),
legislation, transparency documents & forms, services, officials, departments,
hotlines, proposals (+ moderated public comments), contact messages, and
subscribers are all managed at `/admin`.

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Set the same env vars (plus `NEXT_PUBLIC_SITE_URL=https://your-domain` for
   correct sitemap/OG URLs).
3. Add your production URL to Supabase **Authentication → URL Configuration**
   (Site URL + redirect URLs) so OAuth and email links work.

## Project structure

```
supabase/            schema.sql (run first) + seed.sql
src/app/(public)/    public pages (home, youth hub, transparency, services, …)
src/app/admin/       CMS (role-protected)
src/app/auth/        OAuth/email confirmation callback
src/components/      design system + admin CRUD framework
src/lib/             Supabase clients, typed DB helpers, utils
public/assets/       Batangas City seal, UB logo
```
