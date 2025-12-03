import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy – Sparkio",
  description: "Read Sparkio's privacy policy and learn how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#040507] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#040507]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-orange-400">
              Sparkio
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-white/70 hover:text-white transition">
                About
              </Link>
              <Link href="/member/dashboard" className="text-sm text-white/70 hover:text-white transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-4 text-sm text-white/70">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-12 space-y-8 text-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
              <p className="mt-4">We collect information that you provide directly to us, including:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Phone number for account creation and OTP verification</li>
                <li>Email address (optional) for account recovery</li>
                <li>UPI ID for payout processing</li>
                <li>KYC documents when required for compliance</li>
                <li>Task completion proofs and submissions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
              <p className="mt-4">We use the information we collect to:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Process and verify task completions</li>
                <li>Calculate and track your earnings</li>
                <li>Process withdrawal requests via UPI</li>
                <li>Send important account notifications</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Improve our services and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">3. Data Security</h2>
              <p className="mt-4">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>OTP-based authentication for account access</li>
                <li>Regular security audits and updates</li>
                <li>Masking of sensitive information in dashboards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">4. Data Sharing</h2>
              <p className="mt-4">
                We do not sell your personal information. We may share your information only in the following
                circumstances:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>With payment processors (UPI providers) to facilitate payouts</li>
                <li>With KYC verification partners when required by law</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
              <p className="mt-4">You have the right to:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">6. Cookies and Tracking</h2>
              <p className="mt-4">
                We use cookies and similar technologies to maintain your session, remember your preferences, and analyze
                how you use our platform. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">7. Children's Privacy</h2>
              <p className="mt-4">
                Sparkio is not intended for users under the age of 18. We do not knowingly collect personal information
                from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">8. Changes to This Policy</h2>
              <p className="mt-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">9. Contact Us</h2>
              <p className="mt-4">
                If you have any questions about this Privacy Policy, please contact us through our support center or
                email us at privacy@sparkio.in
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040507]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold text-orange-400">Sparkio</h3>
              <p className="mt-2 text-sm text-white/70">Earn daily. No guesswork.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/member/support" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/member/dashboard" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Built in India</h4>
              <p className="mt-2 text-sm text-white/70">For India</p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; {new Date().getFullYear()} Sparkio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

