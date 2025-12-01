export default function CollegeLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 h-[600px] bg-gray-200 rounded-xl border-2 border-black"></div>
        <div className="md:col-span-4 space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl border-2 border-black"></div>
          <div className="h-64 bg-gray-200 rounded-xl border-2 border-black"></div>
        </div>
      </div>
    </div>
  );
}
