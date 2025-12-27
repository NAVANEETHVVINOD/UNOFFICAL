'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
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
        
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-6 text-[var(--color-text-secondary)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LINKER ("the Service"), you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use LINKER. By using the Service, you 
              represent that you meet this age requirement and have the legal capacity to 
              enter into these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">3. Account Registration</h2>
            <p className="mb-3">When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post content that is illegal, harmful, or offensive</li>
              <li>Harass, bully, or intimidate other users</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Share spam, malware, or unauthorized advertising</li>
              <li>Attempt to access accounts or data without authorization</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">5. User Content</h2>
            <p>
              You retain ownership of content you post on LINKER. By posting content, you 
              grant us a non-exclusive, worldwide, royalty-free license to use, display, 
              and distribute your content in connection with the Service. You are solely 
              responsible for the content you post.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">6. Marketplace</h2>
            <p>
              LINKER provides a marketplace for campus community members. We are not a party 
              to transactions between users. Buyers and sellers are responsible for their 
              own transactions, including payment, delivery, and dispute resolution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">7. Events</h2>
            <p>
              Event organizers are responsible for the accuracy of event information and 
              compliance with applicable laws. LINKER is not responsible for the conduct 
              of events or the actions of event participants.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">8. Content Moderation</h2>
            <p>
              We reserve the right to remove content that violates these Terms or is 
              otherwise objectionable. We may also suspend or terminate accounts that 
              repeatedly violate our policies. Users can report content through our 
              reporting mechanisms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">9. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned 
              by LINKER and are protected by international copyright, trademark, and other 
              intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">10. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT 
              GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LINKER SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING 
              FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">12. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these 
              Terms. You may also delete your account at any time through the app settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users 
              of significant changes. Continued use of the Service after changes constitutes 
              acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable 
              laws, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">15. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@linker.app" className="text-[var(--color-accent)] hover:underline">
                legal@linker.app
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
          <Link 
            href="/legal/privacy" 
            className="text-[var(--color-accent)] hover:underline"
          >
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
