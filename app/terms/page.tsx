import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service – Sparkio",
  description: "Read Sparkio's terms of service and user agreement.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-4 text-sm text-white/70">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-12 space-y-8 text-white/80">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
              <p className="mt-4">
                By accessing and using Sparkio, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">2. Use License</h2>
              <p className="mt-4">
                Permission is granted to temporarily use Sparkio for personal, non-commercial transitory viewing only.
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on Sparkio</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
              <p className="mt-4">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept
                responsibility for all activities that occur under your account or password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">4. Earnings and Payouts</h2>
              <p className="mt-4">
                Earnings are calculated based on completed tasks and verified submissions. Payouts are processed via UPI
                and may take 24-48 hours to reflect in your account. Minimum withdrawal amount is ₹500.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">5. Prohibited Activities</h2>
              <p className="mt-4">You agree not to:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Use automated scripts or bots to complete tasks</li>
                <li>Submit false or fraudulent information</li>
                <li>Create multiple accounts to circumvent limits</li>
                <li>Engage in any activity that violates applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">6. Limitation of Liability</h2>
              <p className="mt-4">
                In no event shall Sparkio or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use Sparkio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">7. Changes to Terms</h2>
              <p className="mt-4">
                Sparkio may revise these terms of service at any time without notice. By using this website you are
                agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">8. Contact Information</h2>
              <p className="mt-4">
                If you have any questions about these Terms of Service, please contact us through our support center.
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

