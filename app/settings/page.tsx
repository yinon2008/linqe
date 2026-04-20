"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email ?? "");
      setName(user.user_metadata?.full_name ?? "");
      setLoading(false);
    }
    load();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    setSavingPassword(true);
    setPasswordError("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) { setPasswordError(error.message); return; }
    setNewPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#38BDF8] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-[#444] text-sm">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Profile</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-xs text-[#444] mb-1.5 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-white placeholder-[#333] text-sm focus:outline-none focus:border-[#38BDF8]/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#444] mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-[#080808] border border-[#151515] rounded-xl text-[#444] text-sm cursor-not-allowed"
              />
              <p className="text-[10px] text-[#333] mt-1.5">Email cannot be changed</p>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-[#e5e5e5] disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin inline-block" />
              ) : saved ? (
                <>
                  <svg className="w-3.5 h-3.5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </>
              ) : "Save changes"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Change Password</h2>
          <form onSubmit={savePassword} className="space-y-4">
            <div>
              <label className="block text-xs text-[#444] mb-1.5 font-medium">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
                placeholder="Minimum 8 characters"
                minLength={8}
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-white placeholder-[#333] text-sm focus:outline-none focus:border-[#38BDF8]/30 transition-colors"
              />
            </div>
            {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
            <button
              type="submit"
              disabled={savingPassword || !newPassword}
              className="px-5 py-2.5 rounded-xl bg-[#111] border border-[#1e1e1e] text-white text-sm font-semibold hover:border-[#333] disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              {savingPassword ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
              ) : passwordSaved ? (
                <>
                  <svg className="w-3.5 h-3.5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Password updated
                </>
              ) : "Update password"}
            </button>
          </form>
        </div>

        {/* Account */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Account</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Sign out</p>
              <p className="text-xs text-[#444] mt-0.5">Sign out of your account on this device</p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-xl bg-[#111] border border-[#1e1e1e] text-[#666] text-sm hover:border-[#333] hover:text-white transition-all"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-[#0a0a0a] border border-red-500/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-400/70 mb-5">Danger zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Delete account</p>
              <p className="text-xs text-[#444] mt-0.5">Permanently delete your account and all data</p>
            </div>
            <button
              onClick={() => {
                if (confirm("Are you sure? This action cannot be undone.")) {
                  supabase.auth.admin?.deleteUser?.("");
                }
              }}
              className="px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400/70 text-sm hover:bg-red-500/10 hover:border-red-500/30 transition-all"
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
