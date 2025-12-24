import { Suspense } from "react";
import TeacherDashboardClient from "./TeacherDashboardClient";

export const metadata = {
    title: "Teacher Dashboard | Linker",
    description: "Manage your classrooms, assignments, and students.",
};

export default function TeacherDashboardPage() {
    return (
        <div className="bg-paper dark:bg-dark-bg min-h-screen">
            <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
                <TeacherDashboardClient />
            </Suspense>
        </div>
    );
}
