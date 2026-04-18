import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-[#333] text-8xl font-bold mb-6">404</p>
      <h1 className="text-2xl font-semibold text-white mb-3">Page not found</h1>
      <p className="text-[#555] mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
