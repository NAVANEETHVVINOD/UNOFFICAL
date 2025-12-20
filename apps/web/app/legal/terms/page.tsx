import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | LINKER',
    description: 'Rules of the road.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-paper dark:bg-dark-bg p-8 md:p-20">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1 className="font-display text-4xl font-black mb-8">Terms of Service</h1>
                <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Acceptance</h3>
                <p>By using LINKER, you agree to these terms. Only verified students are allowed.</p>

                <h3>2. Code of Conduct</h3>
                <p>Zero tolerance for harassment, hate speech, or illegal activities. Violations result in immediate bans.</p>

                <h3>3. User Content</h3>
                <p>You own your content but grant us license to display it. You are responsible for what you post.</p>

                <h3>4. Marketplace</h3>
                <p>Transactions are between users. LINKER is not liable for disputes arising from marketplace or freelance activities.</p>

                <div className="mt-12">
                    <button className="px-6 py-3 bg-ink text-white font-bold rounded-lg hover:bg-primary hover:text-ink transition-colors">
                        I Agree
                    </button>
                </div>
            </div>
        </div>
    );
}
