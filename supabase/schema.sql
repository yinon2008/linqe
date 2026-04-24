-- ============================================================
-- Linqe — Full Schema
-- Run this entire file in your Supabase SQL Editor
-- Safe to re-run (uses IF NOT EXISTS / IF EXISTS guards)
-- ============================================================

-- ── Projects ────────────────────────────────────────────────
create table if not exists projects (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users on delete cascade,
  title           text        not null default 'Untitled',
  description     text        default '',
  raw_prompt      text        not null default '',
  ai_response     jsonb,
  status          text        not null default 'draft'
                              check (status in ('draft', 'building', 'live')),
  is_public       boolean     not null default false,
  budget_usd      numeric,
  design_settings jsonb,
  created_at      timestamptz not null default now()
);

-- ── Tasks ────────────────────────────────────────────────────
-- NOTE: id is text (not uuid) because Claude generates IDs like "task_1"
create table if not exists tasks (
  id                  text        primary key,
  project_id          uuid        not null references projects(id) on delete cascade,
  title               text        not null,
  description         text        default '',
  status              text        not null default 'pending'
                                  check (status in ('pending', 'connecting', 'connected', 'failed')),
  automation_type     text        not null default 'none',
  estimated_cost_usd  numeric     not null default 0,
  completed_at        timestamptz
);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists projects_user_id_idx  on projects(user_id);
create index if not exists tasks_project_id_idx  on tasks(project_id);

-- ── Row Level Security ────────────────────────────────────────
alter table projects enable row level security;
alter table tasks     enable row level security;

-- Drop existing policies before recreating (idempotent)
drop policy if exists "Users see own projects"                on projects;
drop policy if exists "Users insert own projects"             on projects;
drop policy if exists "Users update own projects"             on projects;
drop policy if exists "Service role full access to projects"  on projects;
drop policy if exists "Allow null user_id project insert"     on projects;
drop policy if exists "Public projects are visible"           on projects;
drop policy if exists "Anyone can view public projects"       on projects;
drop policy if exists "Users see own tasks"                   on tasks;
drop policy if exists "Service role full access to tasks"     on tasks;

-- Projects policies
create policy "Users see own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users insert own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users update own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Allow null user_id project insert" on projects
  for insert with check (user_id is null);

create policy "Public projects are visible" on projects
  for select using (is_public = true or user_id is null or auth.uid() = user_id);

create policy "Service role full access to projects" on projects
  for all using (true)
  with check (true);

-- Tasks policies
create policy "Users see own tasks" on tasks
  for select using (
    exists (
      select 1 from projects
      where projects.id = tasks.project_id
        and projects.user_id = auth.uid()
    )
  );

create policy "Service role full access to tasks" on tasks
  for all using (true)
  with check (true);

-- ============================================================
-- Migration (for existing databases — safe to run again)
-- ============================================================
alter table projects add column if not exists is_public       boolean not null default false;
alter table projects add column if not exists budget_usd      numeric;
alter table projects add column if not exists design_settings jsonb;

-- Catalog / publishing columns
alter table projects add column if not exists category        text    default 'Other';
alter table projects add column if not exists published_at    timestamptz;
alter table projects add column if not exists views           integer not null default 0;
alter table projects add column if not exists remixes         integer not null default 0;
alter table projects add column if not exists author_name     text    default '';

-- Index for fast catalog queries
create index if not exists projects_catalog_idx on projects(is_public, published_at desc)
  where is_public = true;
