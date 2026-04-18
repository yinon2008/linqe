import Link from "next/link";

export const metadata = {
  title: "Docs — Linqe",
  description: "Linqe documentation — coming soon.",
};

export default function DocsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center mb-6">
        <svg
          className="w-5 h-5 text-[#38BDF8]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Documentation</h1>
      <p className="text-[#555] text-base mb-2 max-w-sm leading-relaxed">
        Full documentation is being written right now.
      </p>
      <p className="text-[#444] text-sm mb-8 max-w-sm">
        In the meantime, Linqe is intuitive — just describe what you want to build.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#38BDF8] text-black text-sm font-semibold hover:bg-[#7DD3FC] transition-colors"
      >
        Try it now
      </Link>
    </div>
  );
}
