import { NewspaperCard } from "../components/ui/NewspaperUI";
import Navbar from "../components/Navbar";
import { Users } from "lucide-react";

export default function CommunitiesPage() {
    return (
        <div className="min-h-screen bg-paper bg-[url('/doodles/grid.png')]">
            <Navbar />
            <div className="max-w-4xl mx-auto p-8 pt-24 text-center">
                <NewspaperCard rotate={-2}>
                    <div className="flex justify-center mb-6">
                        <Users className="w-24 h-24 text-accent-blue" />
                    </div>
                    <h1 className="font-display font-black text-6xl uppercase mb-4">Communities</h1>
                    <p className="font-serif text-2xl mb-8">Group chats on steroids. Coming soon.</p>
                </NewspaperCard>
            </div>
        </div>
    )
}
