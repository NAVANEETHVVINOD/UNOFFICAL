const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : process.env.NEXT_PUBLIC_API_URL || "https://linker-g0lw.onrender.com";

async function refreshTokenFlow(): Promise<string | null> {
  try {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;
    if (!refreshToken) return null;

    console.log("[API] 🔄 Attempting token refresh...");
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.warn("[API] Refresh failed");
      return null;
    }

    const data = await response.json();
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      console.log("[API] ✅ Token refreshed successfully");
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error("[API] Refresh error:", error);
    return null;
  }
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getHeaders = (t: string | null) => {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === "string") h[key] = value;
      });
    }
    if (t) h["Authorization"] = `Bearer ${t}`;
    return h;
  };

  const fullUrl = `${API_URL}${endpoint}`;

  try {
    let response = await fetch(fullUrl, {
      ...options,
      headers: getHeaders(token),
      credentials: "omit",
    });

    // Handle 401 Unauthorized (Token Expired)
    if (response.status === 401) {
      console.warn(
        `[API] 401 Unauthorized for ${fullUrl}. Attempting refresh...`,
      );
      const newToken = await refreshTokenFlow();

      if (newToken) {
        // Retry with new token
        response = await fetch(fullUrl, {
          ...options,
          headers: getHeaders(newToken),
          credentials: "omit",
        });
      } else {
        // Refresh failed - redirect to login
        console.error("[API] Session expired. Redirecting to login.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          window.location.href = "/login";
        }
        throw new Error("Session expired");
      }
    }

    if (!response.ok) {
      const body = await response.text();
      let error;
      try {
        error = JSON.parse(body);
      } catch {
        error = { message: body || "Request failed" };
      }
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`[API] Request failed for ${fullUrl}:`, error);
    throw error;
  }
}

// Specific API calls
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (
    email: string,
    password: string,
    fullName: string,
    collegeId?: string,
    collegeSlug?: string,
  ) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        fullName,
        collegeId,
        collegeSlug,
      }),
    }),

  // Users
  getCurrentUser: () => apiRequest("/users/me"),

  // Profiles
  getProfile: () => apiRequest("/profiles/me"),

  updateProfile: (data: any) =>
    apiRequest("/profiles/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Colleges
  getColleges: () => apiRequest("/colleges"),

  getCollegeBySlug: (slug: string) => apiRequest(`/colleges/${slug}`),

  getCollegeStats: (slug: string) => apiRequest(`/colleges/${slug}/stats`),

  // Clubs
  getClubs: (collegeSlug?: string) => {
    const query = collegeSlug ? `?collegeSlug=${collegeSlug}` : "";
    return apiRequest(`/clubs${query}`);
  },

  getClub: (id: string) => apiRequest(`/clubs/${id}`),

  createClub: (data: any) =>
    apiRequest("/clubs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  joinClub: (id: string) => apiRequest(`/clubs/${id}/join`, { method: "POST" }),

  leaveClub: (id: string) =>
    apiRequest(`/clubs/${id}/leave`, { method: "POST" }),

  // Events
  getEvents: (collegeSlug?: string, cursor?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (collegeSlug) params.append("collegeSlug", collegeSlug);
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());
    return apiRequest(`/events?${params.toString()}`);
  },

  getEvent: (id: string) => apiRequest(`/events/${id}`),

  createEvent: (data: any) =>
    apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  rsvpEvent: (id: string, status: "GOING" | "INTERESTED" | "NOT_GOING") =>
    apiRequest(`/events/${id}/rsvp`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),

  generateQr: (id: string) =>
    apiRequest(`/events/${id}/qr`, { method: "POST" }),

  checkIn: (id: string, token: string) =>
    apiRequest(`/events/${id}/check-in`, {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  // Marketplace
  getMarketplaceListings: (
    search?: string,
    collegeSlug?: string,
    cursor?: string,
    limit?: number,
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (collegeSlug) params.append("collegeSlug", collegeSlug);
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());
    return apiRequest(`/marketplace?${params.toString()}`);
  },

  getMarketplaceListing: (id: string) => apiRequest(`/marketplace/${id}`),

  createMarketplaceListing: (data: any) =>
    apiRequest("/marketplace", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMarketplaceListing: (id: string, data: any) =>
    apiRequest(`/marketplace/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Notes
  getNotes: (search?: string, collegeSlug?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (collegeSlug) params.append("collegeSlug", collegeSlug);
    return apiRequest(`/notes?${params.toString()}`);
  },

  getNote: (id: string) => apiRequest(`/notes/${id}`),

  createNote: (data: any) =>
    apiRequest("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  likeNote: (id: string) => apiRequest(`/notes/${id}/like`, { method: "POST" }),

  unlikeNote: (id: string) =>
    apiRequest(`/notes/${id}/like`, { method: "DELETE" }),

  // Posts (Community Feed)
  getPosts: (collegeSlug?: string) => {
    const query = collegeSlug ? `?collegeSlug=${collegeSlug}` : "";
    return apiRequest(`/posts${query}`);
  },

  getPost: (id: string) => apiRequest(`/posts/${id}`),

  createPost: (data: { content: string; imageUrl?: string; clubId?: string }) =>
    apiRequest("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  likePost: (id: string) => apiRequest(`/posts/${id}/like`, { method: "POST" }),

  unlikePost: (id: string) =>
    apiRequest(`/posts/${id}/like`, { method: "DELETE" }),

  // Messages
  sendMessage: (data: {
    listingId?: string;
    receiverId?: string;
    content: string;
  }) =>
    apiRequest("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  replyToConversation: (conversationId: string, content: string) =>
    apiRequest(`/messages/${conversationId}/reply`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  getConversations: () => apiRequest("/messages"),

  getMessages: (conversationId: string) =>
    apiRequest(`/messages/${conversationId}`),

  markAsSeen: (conversationId: string) =>
    apiRequest(`/messages/${conversationId}/seen`, { method: "PATCH" }),

  // Upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  },
};
