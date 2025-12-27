'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'December 27, 2025';

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link 
          href="/settings" 
          className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6"
        >
          ← Back to Settings
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-6 text-[var(--color-text-secondary)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">1. Introduction</h2>
            <p>
              Welcome to LINKER ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our 
              campus community platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, college affiliation)</li>
              <li>Profile information (bio, profile picture, social links)</li>
              <li>Content you create (posts, comments, messages)</li>
              <li>Event participation and attendance data</li>
              <li>Marketplace listings and transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Connect you with your campus community</li>
              <li>Send notifications about events, messages, and updates</li>
              <li>Ensure platform safety and prevent abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Other users as part of the platform's social features</li>
              <li>College administrators for campus-related activities</li>
              <li>Service providers who assist in operating our platform</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or 
              destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">6. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">7. Push Notifications</h2>
            <p>
              We may send push notifications to keep you informed about campus activities. 
              You can disable notifications at any time through your device settings or 
              within the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">8. Children's Privacy</h2>
            <p>
              LINKER is intended for users aged 13 and older. We do not knowingly collect 
              personal information from children under 13. If you believe we have collected 
              information from a child under 13, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@linker.app" className="text-[var(--color-accent)] hover:underline">
                privacy@linker.app
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
          <Link 
            href="/legal/terms" 
            className="text-[var(--color-accent)] hover:underline"
          >
            View Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
