"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GlobalError({ error }: { error: Error }) {
    return (
        <main style={{ padding: "2rem" }}>
            <h1>Something exploded.</h1>
            <p>{error?.message ?? "Unknown error."}</p>
        </main>
    );
}
