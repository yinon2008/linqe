-- Run this in your Supabase SQL editor

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null default 'Untitled',
  description text default '',
  raw_prompt text not null default '',
  ai_response jsonb,
  status text not null default 'draft' check (status in ('draft', 'building', 'live')),
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text default '',
  status text not null default 'pending' check (status in ('pending', 'connecting', 'connected', 'failed')),
  automation_type text not null default 'none',
  estimated_cost_usd numeric not null default 0,
  completed_at timestamptz
);

-- Indexes
create index if not exists projects_user_id_idx on projects(user_id);
create index if not exists tasks_project_id_idx on tasks(project_id);

-- Row Level Security
alter table projects enable row level security;
alter table tasks enable row level security;

-- Projects: users see their own; service role sees all
create policy "Users see own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users insert own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users update own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Service role full access to projects" on projects
  for all using (auth.role() = 'service_role');

-- Tasks: access via project ownership
create policy "Users see own tasks" on tasks
  for select using (
    exists (select 1 from projects where projects.id = tasks.project_id and projects.user_id = auth.uid())
  );

create policy "Service role full access to tasks" on tasks
  for all using (auth.role() = 'service_role');

-- Also allow anonymous project creation (for unauthenticated users)
create policy "Allow null user_id project insert" on projects
  for insert with check (user_id is null);

create policy "Public projects are visible" on projects
  for select using (user_id is null or auth.uid() = user_id);

-- ─── Migration: community features ───────────────────────────────────────────
-- Run this block in Supabase SQL editor if the columns don't exist yet:
--
--   alter table projects add column if not exists is_public boolean not null default false;
--   alter table projects add column if not exists budget_usd numeric;
--   alter table projects add column if not exists design_settings jsonb;
--
--   create policy if not exists "Anyone can view public projects" on projects
--     for select using (is_public = true);
-- ─────────────────────────────────────────────────────────────────────────────
