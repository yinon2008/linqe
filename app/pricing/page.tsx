import Link from "next/link";

export const metadata = {
  title: "Pricing — Linqe",
  description: "Linqe pricing plans — coming soon.",
};

export default function PricingPage() {
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
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Pricing</h1>
      <p className="text-[#555] text-base mb-2 max-w-sm leading-relaxed">
        Simple, transparent pricing is coming soon.
      </p>
      <p className="text-[#444] text-sm mb-8 max-w-sm">
        Linqe is currently free while in early access.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#38BDF8] text-black text-sm font-semibold hover:bg-[#7DD3FC] transition-colors"
      >
        Start building for free
      </Link>
    </div>
  );
}
