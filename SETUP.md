# Linqe — Setup Guide

## Prerequisites

Install [Node.js LTS](https://nodejs.org) (v18+), then restart your terminal.

## 1. Install dependencies

```bash
cd C:\Linqe
npm install
```

## 2. Configure environment

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Required keys:
- **ANTHROPIC_API_KEY** — from [console.anthropic.com](https://console.anthropic.com)
- **NEXT_PUBLIC_SUPABASE_URL** — from your Supabase project settings
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** — from your Supabase project settings
- **SUPABASE_SERVICE_ROLE_KEY** — from your Supabase project settings (secret)
- **STRIPE_SECRET_KEY** — from your Stripe dashboard

## 3. Set up Supabase database

1. Create a [Supabase](https://supabase.com) project
2. Go to **SQL Editor** and paste the contents of `supabase/schema.sql`
3. Run the SQL
4. Enable Google OAuth in **Authentication > Providers**

## 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Deploy to Vercel

```bash
npx vercel
```

Add all environment variables in the Vercel dashboard under **Settings > Environment Variables**.

---

## Project Structure

```
app/
  page.tsx              # Homepage with hero input
  project/[id]/         # AI-generated project dashboard
  dashboard/            # User's projects grid
  examples/             # Example prompts
  login/ & signup/      # Auth pages
  api/generate/         # Claude API route (server-side)
  api/tasks/[id]/connect/ # Task auto-connect simulation

components/
  home/                 # HeroInput, ModelSelector, QuickActions
  project/              # TaskCard, CostSummary, DeliverableList
  layout/               # Navbar, Footer
  ui/                   # Button, Card, Badge, Spinner, Skeleton

lib/
  anthropic.ts          # Claude client + system prompt
  supabase.ts           # Supabase browser/server clients
  types.ts              # TypeScript interfaces
```
