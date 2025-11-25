export default function DashboardLoading() {
    return (
        <div className="container mx-auto p-8 space-y-8 animate-pulse min-h-screen">
            <div className="h-20 w-1/3 bg-gray-200 rounded-lg"></div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 h-96 bg-gray-200 rounded-xl border-2 border-black"></div>
                <div className="h-96 bg-gray-200 rounded-xl border-2 border-black"></div>
            </div>
        </div>
    );
}
