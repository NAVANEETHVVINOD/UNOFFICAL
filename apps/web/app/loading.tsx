import Doodle from './components/ui/Doodle';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-paper">
            <div className="text-center">
                <Doodle src="/doodles/sun.jpg" className="w-24 h-24 mx-auto animate-spin-slow mb-4" />
                <h2 className="font-display text-2xl font-black animate-pulse">LOADING...</h2>
            </div>
        </div>
    );
}
