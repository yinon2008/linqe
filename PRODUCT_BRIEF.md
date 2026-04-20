# Linqe — Product Brief

---

## The Problem

Starting a new project is chaos. Founders, freelancers, and product teams spend hours — sometimes days — trying to figure out what to build, how much it will cost, what tools to use, and what order to do things in. Most people either skip the planning phase entirely, or get stuck in endless research before writing a single line of code.

There's no fast, reliable way to go from "I have an idea" to "here's exactly what to build, what it will cost, and how to launch it."

---

## The Solution

**Linqe** is an AI-powered project planning platform. You describe what you want to build in plain language — one sentence or a full paragraph — and Linqe generates a complete, structured project plan in under 30 seconds.

Every plan includes:
- **Deliverables** — the key outputs of the project (landing page, web app, database, API, etc.)
- **Task breakdown** — individual actionable steps for each deliverable
- **Cost estimate** — monthly recurring costs and one-time setup costs for every tool and service
- **Launch checklist** — step-by-step setup guide (domain, hosting, payments, email, database)

---

## Who It's For

| Audience | Use case |
|---|---|
| **Freelancers & agencies** | Brief clients, scope projects, generate proposals in minutes |
| **Non-technical founders** | Understand what it actually takes to build their idea |
| **Product managers** | Rapid project scoping before sprint planning |
| **Indie hackers / builders** | Go from idea to execution plan without hours of research |

---

## How It Works

1. **Describe** — User types a project idea in the text box (e.g., "A SaaS tool for freelancers to track time and send invoices automatically")
2. **Generate** — Claude AI (Anthropic) analyzes the prompt and streams a structured JSON project plan
3. **Review** — User sees their full plan: deliverables, tasks, costs, and checklist
4. **Build** — User launches directly from the dashboard or exports the plan

---

## Key Features

- AI generation powered by **Claude Opus / Claude Sonnet** (user's choice)
- 12 built-in **project templates** (SaaS, landing page, mobile app, e-commerce, automation, etc.)
- **Real-time streaming** generation with live progress logs
- **Auto-connect** for integrations (domain, database, payments, email)
- **Dashboard** to save, manage, and revisit all projects
- **Export** to PDF / Notion (Pro)
- Full auth system via Supabase (email/password)

---

## Business Model

| Plan | Price | Limit |
|---|---|---|
| **Free** | $0/month | 5 project plans/month |
| **Pro** | $19/month | Unlimited plans + exports + priority AI |
| **Team** | $49/month | Everything in Pro + team collaboration |

Currently free during early access.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes (serverless), Supabase (PostgreSQL + Auth)
- **AI:** Anthropic Claude API (`claude-opus-4-6`) with prompt caching + streaming
- **Payments:** Stripe (configured, not yet active)
- **Deployment:** Vercel-ready

---

## Current Status

- Full product built and running (production build passing)
- Authentication, project generation, dashboard, and streaming all functional
- Pricing, docs, and examples pages complete
- Early access phase — free for all users
- Ready for beta users and initial marketing

---

## Tagline Options

- *"From idea to plan in seconds."*
- *"Describe what you want to build. Get a complete plan — powered by AI."*
- *"Plan smarter. Build faster."*
