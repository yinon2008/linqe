export const metadata = {
  title: "Privacy Policy — Linqe",
  description: "How Linqe collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "April 21, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-xs text-[#38BDF8] font-medium tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-[#444] text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-[#666] text-sm leading-relaxed">

          <section className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
            <p>
              Linqe (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the website linqe.xyz and related services (the &ldquo;Service&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By using Linqe, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {[
            {
              title: "1. Information We Collect",
              content: [
                "Account Information: When you register, we collect your email address and any profile information you provide (such as your name).",
                "Usage Data: We automatically collect information about how you interact with the Service, including pages visited, features used, and actions taken.",
                "Project Data: We store the project prompts you submit and the AI-generated plans produced in response. This data is stored on your account.",
                "Payment Information: If you subscribe to a paid plan, payment information is processed by Stripe, Inc. We do not store your full card number or banking details.",
                "Cookies and Tracking: We use cookies and similar tracking technologies to maintain your session and improve our Service. See our Cookie Policy for details.",
                "Third-Party OAuth: If you sign in via Google or GitHub, we receive basic profile information (name, email, avatar) from those providers.",
              ],
            },
            {
              title: "2. How We Use Your Information",
              content: [
                "To provide, maintain, and improve the Service.",
                "To authenticate you and secure your account.",
                "To process payments and manage subscriptions.",
                "To send transactional emails (e.g., confirmation, password reset).",
                "To generate AI-powered project plans using the prompts you submit.",
                "To monitor usage patterns and fix bugs.",
                "To comply with legal obligations.",
              ],
            },
            {
              title: "3. Third-Party Services",
              content: [
                "Anthropic (Claude AI): Your project prompts are sent to Anthropic's API to generate plans. Anthropic may process this data in accordance with their own privacy policy. We recommend not including personal or sensitive data in prompts.",
                "Supabase: Your account data and project data are stored in Supabase-managed databases.",
                "Stripe: Payment processing is handled by Stripe, Inc. Stripe is PCI-DSS compliant.",
                "Resend: Transactional emails are delivered via Resend.",
                "Vercel: The Service is hosted on Vercel's infrastructure.",
                "We are not responsible for the privacy practices of these third parties.",
              ],
            },
            {
              title: "4. Data Retention",
              content: [
                "We retain your data for as long as your account is active or as needed to provide the Service.",
                "You may request deletion of your account and associated data at any time from your Settings page.",
                "Some data may be retained for a limited period as required by law or for legitimate business purposes (e.g., fraud prevention, legal claims).",
              ],
            },
            {
              title: "5. Your Rights",
              content: [
                "Access: You may request a copy of the personal data we hold about you.",
                "Correction: You may update your account information at any time via Settings.",
                "Deletion: You may delete your account and request erasure of your data.",
                "Portability: You may request an export of your project data.",
                "Opt-out: You may opt out of non-essential communications at any time.",
                "To exercise these rights, email us at privacy@linqe.app.",
              ],
            },
            {
              title: "6. Security",
              content: [
                "We implement industry-standard measures to protect your data, including encryption in transit (TLS) and at rest.",
                "No method of transmission over the internet is 100% secure. We cannot guarantee absolute security.",
                "You are responsible for maintaining the confidentiality of your account credentials.",
              ],
            },
            {
              title: "7. Children's Privacy",
              content: [
                "The Service is not directed to individuals under the age of 16. We do not knowingly collect personal data from minors. If we become aware that a minor has provided personal information, we will delete it promptly.",
              ],
            },
            {
              title: "8. International Users",
              content: [
                "The Service is operated from Israel. If you access it from outside Israel, your information may be transferred to and processed in Israel or other countries where our service providers operate. By using the Service, you consent to such transfers.",
              ],
            },
            {
              title: "9. Changes to This Policy",
              content: [
                "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Your continued use of the Service after changes constitutes acceptance.",
              ],
            },
            {
              title: "10. Contact",
              content: [
                "For privacy-related inquiries, contact us at: privacy@linqe.app",
              ],
            },
          ].map((section) => (
            <section key={section.title} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
              <h2 className="text-white font-semibold text-base mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#333] flex-shrink-0 mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
