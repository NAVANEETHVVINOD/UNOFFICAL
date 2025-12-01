import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getServerProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (e) {
    console.error("Error fetching server profile:", e);
    return null;
  }
}
