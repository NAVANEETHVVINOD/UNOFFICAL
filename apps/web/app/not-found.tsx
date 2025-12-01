import { NewspaperCard, RetroButton } from "./components/ui/NewspaperUI";
import Doodle from "./components/ui/Doodle";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <NewspaperCard className="max-w-lg w-full text-center p-12 rotate-1">
        <Doodle src="/doodles/sparkle.svg" className="w-32 h-32 mx-auto mb-6" />
        <h1 className="font-display text-6xl font-black mb-2">404</h1>
        <h2 className="font-bold text-2xl mb-6 uppercase">Page Not Found</h2>
        <p className="font-serif text-lg text-gray-600 mb-8">
          &quot;Looks like this page got lost in the archives. Or maybe the
          aliens took it.&quot;
        </p>
        <Link href="/dashboard">
          <RetroButton className="bg-black text-white">
            RETURN TO REALITY
          </RetroButton>
        </Link>
      </NewspaperCard>
    </div>
  );
}
