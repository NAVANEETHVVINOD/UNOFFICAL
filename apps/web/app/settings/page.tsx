"use client";

import Container from "../components/ui/Container";
import Navbar from "../components/Navbar";
import { NewspaperCard, RetroButton } from "../components/ui/NewspaperUI";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-paper">
            <Navbar />
            <Container className="py-12">
                <NewspaperCard className="max-w-xl mx-auto p-8 text-center">
                    <h1 className="font-display text-4xl font-black mb-4">SETTINGS</h1>
                    <p className="font-serif text-lg mb-8">
                        Twiddle your knobs and dials here. (Coming Soon)
                    </p>
                    <RetroButton onClick={() => router.back()}>
                        GO BACK
                    </RetroButton>
                </NewspaperCard>
            </Container>
        </div>
    );
}
