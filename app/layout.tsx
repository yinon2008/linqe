import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Linqe — Bring your ideas to life",
  description: "AI-powered project planning with cost estimation, task checklists, and one-click launch.",
  metadataBase: new URL("https://linqe.app"),
  openGraph: {
    title: "Linqe — Bring your ideas to life",
    description: "Describe what you want to build. Get a complete project plan, cost estimate, and launch checklist — powered by AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linqe — Bring your ideas to life",
    description: "AI-powered project planning with cost estimation and one-click launch.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-black text-white">
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
