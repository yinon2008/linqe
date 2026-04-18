import { createBrowserClient } from "@supabase/ssr";

// NEXT_PUBLIC_ vars are baked at build time — fallback to real values so the
// app works even when the env var wasn't present during the Vercel build.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vzghsowipsnghiucwsok.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Z2hzb3dpcHNuZ2hpdWN3c29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzQxMDUsImV4cCI6MjA5MjExMDEwNX0.H-BMKslvJ3sxCgKpU6x4tTufhBK9IJpyPL5TM8f8c2U";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
