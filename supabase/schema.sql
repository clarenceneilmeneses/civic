-- ============================================================
-- Batangas City Youth E-Civic Hub — Database Schema
-- Run this whole file in the Supabase SQL Editor, then run seed.sql.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Enums ----------
create type public.user_role as enum ('citizen', 'editor', 'admin');
create type public.pub_status as enum ('draft', 'published');
create type public.post_type as enum ('news', 'announcement');
create type public.event_category as enum ('Sports', 'Arts', 'Leadership', 'Volunteering', 'Scholarships', 'SK Programs');
create type public.legislation_kind as enum ('ordinance', 'resolution', 'executive_order', 'administrative_order', 'proclamation');
create type public.document_category as enum ('Annual Budget', 'Bids & Projects', 'Financial Reports', 'Programs & Projects', 'Annual Investment Plans', 'Forms');
create type public.proposal_status as enum ('open', 'closed');

-- ---------- Helper: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'citizen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Role helpers (security definer so RLS policies don't recurse)
create or replace function public.my_role()
returns public.user_role
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'citizen'::public.user_role)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() = 'admin'
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() in ('admin','editor')
$$;

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent non-admins from changing roles.
-- auth.uid() is null outside PostgREST (SQL editor / service role) — those
-- contexts are trusted and must stay able to set roles (e.g. the first admin).
create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end $$;

create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- CONTENT TABLES
-- ============================================================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,                       -- rich text (HTML from Tiptap)
  cover_image text,
  type public.post_type not null default 'news',
  category text,
  status public.pub_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_status_published_idx on public.posts (status, published_at desc);
create index posts_type_idx on public.posts (type);
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  cover_image text,
  category public.event_category not null default 'SK Programs',
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  organizer text,
  capacity int,                    -- null = unlimited
  registration_open boolean not null default true,
  status public.pub_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_status_starts_idx on public.events (status, starts_at);
create index events_category_idx on public.events (category);
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index event_registrations_event_idx on public.event_registrations (event_id);
create index event_registrations_user_idx on public.event_registrations (user_id);

create table public.legislation (
  id uuid primary key default gen_random_uuid(),
  kind public.legislation_kind not null,
  number text not null,
  title text not null,
  summary text,
  pdf_url text,
  date_approved date,
  status public.pub_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index legislation_kind_idx on public.legislation (kind, date_approved desc);
create index legislation_status_idx on public.legislation (status);
create trigger legislation_updated_at before update on public.legislation
  for each row execute function public.set_updated_at();

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category public.document_category not null,
  office text,                     -- issuing office / department name
  file_url text,
  year int,
  status public.pub_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index documents_category_idx on public.documents (category, year desc);
create trigger documents_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  head_name text,
  description text,
  location text,
  phone text,
  email text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger departments_updated_at before update on public.departments
  for each row execute function public.set_updated_at();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  steps text[] not null default '{}',   -- plain-language how-to steps
  department_id uuid references public.departments(id) on delete set null,
  form_url text,                          -- downloadable form (Storage)
  fee text,
  processing_time text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index services_department_idx on public.services (department_id);
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

create table public.officials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  photo_url text,
  grouping text not null default 'City Officials',  -- e.g. City Officials / Sangguniang Panlungsod / SK Federation
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger officials_updated_at before update on public.officials
  for each row execute function public.set_updated_at();

create table public.hotlines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  numbers text[] not null default '{}',
  category text not null default 'Emergency',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger hotlines_updated_at before update on public.hotlines
  for each row execute function public.set_updated_at();

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  pdf_url text,
  proposal_status public.proposal_status not null default 'open',
  comments_close_at timestamptz,
  status public.pub_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index proposals_status_idx on public.proposals (status, proposal_status);
create trigger proposals_updated_at before update on public.proposals
  for each row execute function public.set_updated_at();

create table public.proposal_comments (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
create index proposal_comments_proposal_idx on public.proposal_comments (proposal_id, approved);
create index proposal_comments_user_idx on public.proposal_comments (user_id);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Rule of thumb:
--   * anon/public: SELECT only published rows
--   * citizens: manage their own RSVPs & comments
--   * editors: create/edit drafts (cannot publish or delete)
--   * admins: everything
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.legislation enable row level security;
alter table public.documents enable row level security;
alter table public.departments enable row level security;
alter table public.services enable row level security;
alter table public.officials enable row level security;
alter table public.hotlines enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_comments enable row level security;
alter table public.contact_messages enable row level security;
alter table public.subscribers enable row level security;

-- profiles (no emails stored here — names/avatars are shown on public comments)
create policy "profiles: public read" on public.profiles
  for select using (true);
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- Generic policies for status-gated content tables
-- posts
create policy "posts: public reads published" on public.posts
  for select using (status = 'published' or public.is_staff());
create policy "posts: staff insert (editors draft only)" on public.posts
  for insert with check (public.is_admin() or (public.is_staff() and status = 'draft'));
create policy "posts: staff update (editors draft only)" on public.posts
  for update using (public.is_staff())
  with check (public.is_admin() or status = 'draft');
create policy "posts: admin delete" on public.posts
  for delete using (public.is_admin());

-- events
create policy "events: public reads published" on public.events
  for select using (status = 'published' or public.is_staff());
create policy "events: staff insert (editors draft only)" on public.events
  for insert with check (public.is_admin() or (public.is_staff() and status = 'draft'));
create policy "events: staff update (editors draft only)" on public.events
  for update using (public.is_staff())
  with check (public.is_admin() or status = 'draft');
create policy "events: admin delete" on public.events
  for delete using (public.is_admin());

-- event_registrations
create policy "rsvp: read own or staff" on public.event_registrations
  for select using (user_id = auth.uid() or public.is_staff());
create policy "rsvp: insert own" on public.event_registrations
  for insert with check (user_id = auth.uid());
create policy "rsvp: delete own or admin" on public.event_registrations
  for delete using (user_id = auth.uid() or public.is_admin());

-- legislation
create policy "legislation: public reads published" on public.legislation
  for select using (status = 'published' or public.is_staff());
create policy "legislation: staff insert (editors draft only)" on public.legislation
  for insert with check (public.is_admin() or (public.is_staff() and status = 'draft'));
create policy "legislation: staff update (editors draft only)" on public.legislation
  for update using (public.is_staff())
  with check (public.is_admin() or status = 'draft');
create policy "legislation: admin delete" on public.legislation
  for delete using (public.is_admin());

-- documents
create policy "documents: public reads published" on public.documents
  for select using (status = 'published' or public.is_staff());
create policy "documents: staff insert (editors draft only)" on public.documents
  for insert with check (public.is_admin() or (public.is_staff() and status = 'draft'));
create policy "documents: staff update (editors draft only)" on public.documents
  for update using (public.is_staff())
  with check (public.is_admin() or status = 'draft');
create policy "documents: admin delete" on public.documents
  for delete using (public.is_admin());

-- departments / services / officials / hotlines (directory data, no draft state)
create policy "departments: public read" on public.departments for select using (true);
create policy "departments: staff write" on public.departments for insert with check (public.is_staff());
create policy "departments: staff update" on public.departments for update using (public.is_staff());
create policy "departments: admin delete" on public.departments for delete using (public.is_admin());

create policy "services: public read" on public.services for select using (true);
create policy "services: staff write" on public.services for insert with check (public.is_staff());
create policy "services: staff update" on public.services for update using (public.is_staff());
create policy "services: admin delete" on public.services for delete using (public.is_admin());

create policy "officials: public read" on public.officials for select using (true);
create policy "officials: staff write" on public.officials for insert with check (public.is_staff());
create policy "officials: staff update" on public.officials for update using (public.is_staff());
create policy "officials: admin delete" on public.officials for delete using (public.is_admin());

create policy "hotlines: public read" on public.hotlines for select using (true);
create policy "hotlines: staff write" on public.hotlines for insert with check (public.is_staff());
create policy "hotlines: staff update" on public.hotlines for update using (public.is_staff());
create policy "hotlines: admin delete" on public.hotlines for delete using (public.is_admin());

-- proposals
create policy "proposals: public reads published" on public.proposals
  for select using (status = 'published' or public.is_staff());
create policy "proposals: staff insert (editors draft only)" on public.proposals
  for insert with check (public.is_admin() or (public.is_staff() and status = 'draft'));
create policy "proposals: staff update (editors draft only)" on public.proposals
  for update using (public.is_staff())
  with check (public.is_admin() or status = 'draft');
create policy "proposals: admin delete" on public.proposals
  for delete using (public.is_admin());

-- proposal_comments (moderated: hidden until approved)
create policy "comments: read approved, own, or staff" on public.proposal_comments
  for select using (approved or user_id = auth.uid() or public.is_staff());
create policy "comments: citizens insert own unapproved" on public.proposal_comments
  for insert with check (user_id = auth.uid() and approved = false);
create policy "comments: admin moderates" on public.proposal_comments
  for update using (public.is_admin());
create policy "comments: delete own or admin" on public.proposal_comments
  for delete using (user_id = auth.uid() or public.is_admin());

-- contact_messages
create policy "contact: anyone can send" on public.contact_messages
  for insert with check (true);
create policy "contact: staff read" on public.contact_messages
  for select using (public.is_staff());
create policy "contact: staff mark read" on public.contact_messages
  for update using (public.is_staff());
create policy "contact: admin delete" on public.contact_messages
  for delete using (public.is_admin());

-- subscribers
create policy "subscribers: anyone can subscribe" on public.subscribers
  for insert with check (true);
create policy "subscribers: admin read" on public.subscribers
  for select using (public.is_admin());
create policy "subscribers: admin delete" on public.subscribers
  for delete using (public.is_admin());

-- ============================================================
-- STORAGE — buckets `images` (public) and `documents` (public)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true), ('documents', 'documents', true)
on conflict (id) do nothing;

create policy "storage: public read images/documents" on storage.objects
  for select using (bucket_id in ('images','documents'));
create policy "storage: staff upload" on storage.objects
  for insert with check (bucket_id in ('images','documents') and public.is_staff());
create policy "storage: staff update" on storage.objects
  for update using (bucket_id in ('images','documents') and public.is_staff());
create policy "storage: staff delete" on storage.objects
  for delete using (bucket_id in ('images','documents') and public.is_staff());
