export const metadata = {
  title: "Terms of Service — Linqe",
  description: "The terms and conditions governing your use of Linqe.",
};

const LAST_UPDATED = "April 21, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-xs text-[#38BDF8] font-medium tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-[#444] text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Important notice */}
        <div className="bg-amber-400/5 border border-amber-400/15 rounded-2xl p-5 mb-8 text-amber-400/80 text-sm leading-relaxed">
          Please read these Terms carefully before using Linqe. By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </div>

        <div className="space-y-6 text-[#666] text-sm leading-relaxed">
          {[
            {
              title: "1. Acceptance of Terms",
              items: [
                "These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;) and Linqe (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).",
                "By creating an account or using the Service in any way, you confirm that you are at least 16 years old, have the legal capacity to enter into binding contracts, and accept these Terms.",
                "We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance.",
              ],
            },
            {
              title: "2. Description of Service",
              items: [
                "Linqe provides an AI-powered project planning tool that generates project plans, cost estimates, and launch checklists based on user-submitted prompts.",
                "The Service is powered by third-party AI models (including Anthropic Claude). We do not guarantee the accuracy, completeness, or fitness for any particular purpose of AI-generated content.",
                "The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We may modify, suspend, or discontinue any aspect of the Service at any time without notice.",
              ],
            },
            {
              title: "3. User Accounts",
              items: [
                "You are responsible for maintaining the confidentiality of your account credentials.",
                "You are responsible for all activity that occurs under your account.",
                "You must not share your account with others or allow unauthorized access.",
                "We reserve the right to suspend or terminate accounts that violate these Terms.",
              ],
            },
            {
              title: "4. Acceptable Use",
              items: [
                "You agree not to use the Service for any unlawful purpose or in violation of any applicable law.",
                "You agree not to submit prompts containing personal data of third parties without their consent.",
                "You agree not to attempt to reverse-engineer, scrape, or misuse the Service.",
                "You agree not to submit content that is harmful, defamatory, harassing, or infringing on third-party rights.",
                "You agree not to use the Service to create competing products or services by misappropriating our proprietary systems.",
              ],
            },
            {
              title: "5. AI-Generated Content — Important Disclaimer",
              items: [
                "ALL AI-GENERATED CONTENT (including project plans, cost estimates, timelines, and checklists) IS PROVIDED FOR INFORMATIONAL PURPOSES ONLY.",
                "We make NO warranties or representations that AI-generated content is accurate, complete, current, or suitable for any particular use.",
                "Cost estimates are approximations and may not reflect actual market prices. You should independently verify all estimates before making financial decisions.",
                "We are NOT responsible for any decisions made based on AI-generated content, including but not limited to business decisions, financial commitments, or technical implementations.",
                "You assume full responsibility for evaluating and verifying any AI-generated content before acting on it.",
              ],
            },
            {
              title: "6. Intellectual Property",
              items: [
                "The Linqe platform, including its design, code, and branding, is owned by Linqe and protected by applicable intellectual property laws.",
                "AI-generated project plans created using your prompts are yours to use. However, we retain the right to use anonymized, aggregated data to improve the Service.",
                "You grant us a non-exclusive license to process and store your prompts and generated plans for the purpose of providing the Service.",
              ],
            },
            {
              title: "7. Payments and Refunds",
              items: [
                "Paid subscriptions are billed in advance on a monthly or annual basis.",
                "You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period; no partial refunds are issued for unused time.",
                "New subscribers on paid plans may request a full refund within 7 days of their first payment. No refunds are issued after this period.",
                "We reserve the right to change pricing at any time with at least 30 days&rsquo; notice.",
              ],
            },
            {
              title: "8. Limitation of Liability",
              items: [
                "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LINQE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AFFILIATES, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES.",
                "THIS INCLUDES BUT IS NOT LIMITED TO: LOSS OF PROFITS, LOSS OF DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
                "OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO LINQE IN THE 12 MONTHS PRECEDING THE CLAIM, OR $50 USD, WHICHEVER IS GREATER.",
                "SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR LIMITATION OF LIABILITY. IN SUCH CASES, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.",
              ],
            },
            {
              title: "9. Disclaimer of Warranties",
              items: [
                "THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.",
                "WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
                "WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.",
              ],
            },
            {
              title: "10. Indemnification",
              items: [
                "You agree to indemnify, defend, and hold harmless Linqe and its affiliates from any claims, damages, losses, and expenses (including reasonable legal fees) arising out of:",
                "Your use or misuse of the Service.",
                "Your violation of these Terms.",
                "Your violation of any third-party rights.",
                "Any content you submit through the Service.",
              ],
            },
            {
              title: "11. Governing Law & Dispute Resolution",
              items: [
                "These Terms shall be governed by and construed in accordance with the laws of the State of Israel, without regard to conflict of law provisions.",
                "Any dispute arising under these Terms shall be resolved exclusively in the competent courts located in Israel.",
                "Before initiating formal legal proceedings, you agree to first attempt to resolve any dispute by contacting us at legal@linqe.app.",
              ],
            },
            {
              title: "12. Termination",
              items: [
                "We may suspend or terminate your access to the Service at any time, for any reason, with or without notice.",
                "Upon termination, your right to use the Service ceases immediately.",
                "Sections 5, 8, 9, 10, and 11 survive termination.",
              ],
            },
            {
              title: "13. Contact",
              items: [
                "For legal inquiries: legal@linqe.app",
                "For general support: hello@linqe.app",
              ],
            },
          ].map((section) => (
            <section key={section.title} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
              <h2 className="text-white font-semibold text-base mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#333] flex-shrink-0 mt-0.5">—</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
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
