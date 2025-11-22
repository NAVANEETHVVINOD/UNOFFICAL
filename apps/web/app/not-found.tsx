"use client";
export const dynamic = "force-dynamic";
export const revalidate = false;

export default function NotFound() {
    return (
        <div style={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            color: "#1a1a1a"
        }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>🛑 404 — Page Missing</h1>
            <p>Either the page doesn't exist…</p>
            <p>…or someone deleted it on purpose because chaos.</p>
            <a href="/" style={{ marginTop: "20px", textDecoration: "underline", color: "#2D5BFF", fontWeight: "bold" }}>
                Go Home
            </a>
        </div>
    );
}
