"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-2xl font-semibold text-white mb-3">Something went wrong</h1>
      <p className="text-[#555] mb-8 max-w-sm">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-full bg-[#111] border border-[#222] text-white text-sm font-medium hover:border-[#444] transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
