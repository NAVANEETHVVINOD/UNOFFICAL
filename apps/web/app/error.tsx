"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Error() {
    return (
        <main style={{ padding: "2rem" }}>
            <h1>500 — Server Error</h1>
            <p>Relax. The server is just having a meltdown.</p>
        </main>
    );
}
