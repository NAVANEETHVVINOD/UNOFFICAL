import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | LINKER',
    description: 'How we handle your data.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-paper dark:bg-dark-bg p-8 md:p-20">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1 className="font-display text-4xl font-black mb-8">Privacy Policy</h1>
                <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Data Collection</h3>
                <p>We collect minimal data necessary for campus connectivity, including your name, college email, and profile details provided during onboarding.</p>

                <h3>2. Usage</h3>
                <p>Your data is used solely to facilitate interactions within the LINKER platform (Events, Clubs, Marketplace).</p>

                <h3>3. Data Sharing</h3>
                <p>We do not sell your data. Profile information is visible to other verified students on your campus.</p>

                <h3>4. Cookies</h3>
                <p>We use essential cookies for authentication and session management.</p>

                <div className="mt-12 p-4 bg-neutral-100 dark:bg-white/5 rounded-xl border border-ink/10">
                    <p className="text-sm font-bold">Contact Support</p>
                    <p className="text-sm">For privacy concerns, email privacy@linker.app</p>
                </div>
            </div>
        </div>
    );
}
