import Link from "next/link";

const LINKS = {
  Product: [
    { label: "How it works", href: "/docs#what-is-linqe" },
    { label: "Examples", href: "/examples" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
  ],
  Company: [
    { label: "Blog", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Status", href: "#" },
    { label: "Contact", href: "mailto:hello@linqe.app" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "Cookie policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#0f0f0f] bg-black">
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              href="/"
              className="text-white font-bold text-xl tracking-tight inline-flex items-center gap-0.5 select-none mb-3"
            >
              Linqe
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginBottom: 8 }}>
                <path d="M6 0L6.55 4.8L12 6L6.55 7.2L6 12L5.45 7.2L0 6L5.45 4.8Z" fill="#C9A84C" />
              </svg>
            </Link>
            <p className="text-[#333] text-sm leading-relaxed max-w-xs">
              AI-powered project planning. Describe your idea and get a full plan, cost estimates, and launch checklist — in seconds.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://x.com/linqeapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] flex items-center justify-center text-[#333] hover:text-white hover:border-[#2a2a2a] transition-all"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/linqeapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] flex items-center justify-center text-[#333] hover:text-white hover:border-[#2a2a2a] transition-all"
                aria-label="GitHub"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-white text-xs font-semibold mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#333] text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8 border-t border-[#0f0f0f]">
          <p className="text-[#222] text-xs">
            © {new Date().getFullYear()} Linqe. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span className="text-[#222] text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
