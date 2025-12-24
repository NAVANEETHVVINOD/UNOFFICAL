import { Suspense } from "react";
import ClassroomClient from "./ClassroomClient";

export const metadata = {
    title: "Classroom | Linker",
};

export default async function ClassroomPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    return (
        <div className="bg-paper dark:bg-dark-bg min-h-screen">
            <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold">Loading Classroom...</div>}>
                <ClassroomClient id={id} />
            </Suspense>
        </div>
    );
}
