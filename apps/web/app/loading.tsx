import Doodle from "./components/ui/Doodle";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper">
      <div className="text-center animate-pulse">
        <Doodle
          src="/doodles/CD.jpg"
          className="w-24 h-24 mx-auto mb-4 animate-spin-slow"
        />
        <h2 className="font-display text-2xl font-black tracking-widest">
          LOADING...
        </h2>
      </div>
    </div>
  );
}
