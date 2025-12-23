export const API_URL =
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

  addProfileEducation: (data: any) =>
    apiRequest("/profiles/me/education", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeProfileEducation: (id: string) =>
    apiRequest(`/profiles/me/education/${id}`, { method: "DELETE" }),

  addProfileExperience: (data: any) =>
    apiRequest("/profiles/me/experience", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeProfileExperience: (id: string) =>
    apiRequest(`/profiles/me/experience/${id}`, { method: "DELETE" }),

  addProfileProject: (data: any) =>
    apiRequest("/profiles/me/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeProfileProject: (id: string) =>
    apiRequest(`/profiles/me/projects/${id}`, { method: "DELETE" }),

  addProfileVolunteering: (data: any) =>
    apiRequest("/profiles/me/volunteering", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeProfileVolunteering: (id: string) =>
    apiRequest(`/profiles/me/volunteering/${id}`, { method: "DELETE" }),

  getLeaderboard: () => apiRequest("/profiles/leaderboard"),

  // Follows
  followUser: (userId: string) => apiRequest(`/follows/${userId}`, { method: "POST" }),
  unfollowUser: (userId: string) => apiRequest(`/follows/${userId}`, { method: "DELETE" }),
  getFollowStatus: (userId: string) => apiRequest(`/follows/${userId}/status`),
  getFollowers: (userId: string) => apiRequest(`/follows/${userId}/followers`),
  getFollowing: (userId: string) => apiRequest(`/follows/${userId}/following`),

  // Search
  search: (query: string) => apiRequest(`/search?q=${encodeURIComponent(query)}`),

  // Colleges
  getColleges: () => apiRequest("/colleges"),

  getCollege: (id: string) => apiRequest(`/colleges/id/${id}`),

  getCollegeBySlug: (slug: string) => apiRequest(`/colleges/${slug}`),

  getCollegeStats: (slug: string) => apiRequest(`/colleges/${slug}/stats`),

  updateCollege: (id: string, data: any) =>
    apiRequest(`/colleges/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Clubs
  getClubs: (params?: { collegeSlug?: string; type?: "CLUB" | "COMMUNITY" }) => {
    const queryParams = new URLSearchParams();
    if (params?.collegeSlug) queryParams.append("collegeSlug", params.collegeSlug);
    if (params?.type) queryParams.append("type", params.type);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return apiRequest(`/clubs${queryString}`);
  },

  getClub: (id: string) => apiRequest(`/clubs/${id}`),

  createClub: (data: any) =>
    apiRequest("/clubs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateClub: (id: string, data: any) =>
    apiRequest(`/clubs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  joinClub: (id: string) => apiRequest(`/clubs/${id}/join`, { method: "POST" }),

  leaveClub: (id: string) =>
    apiRequest(`/clubs/${id}/leave`, { method: "POST" }),

  getClubMembers: (id: string) => apiRequest(`/clubs/${id}/members`),

  updateClubMember: (clubId: string, userId: string, data: { role: string }) =>
    apiRequest(`/clubs/${clubId}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeClubMember: (clubId: string, userId: string) =>
    apiRequest(`/clubs/${clubId}/members/${userId}`, { method: "DELETE" }),

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
    type?: "PRODUCT" | "SERVICE" | "JOB",
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (collegeSlug) params.append("collegeSlug", collegeSlug);
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());
    if (type) params.append("type", type);
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
  getPosts: (collegeSlug?: string, page: number = 1, limit: number = 20) => {
    const query = new URLSearchParams();
    if (collegeSlug) query.append("collegeSlug", collegeSlug);
    query.append("page", page.toString());
    query.append("limit", limit.toString());
    return apiRequest(`/posts?${query.toString()}`);
  },

  getPost: (id: string) => apiRequest(`/posts/${id}`),

  createPost: (data: any) =>
    apiRequest("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  likePost: (id: string) => apiRequest(`/posts/${id}/like`, { method: "POST" }),

  unlikePost: (id: string) =>
    apiRequest(`/posts/${id}/like`, { method: "DELETE" }),

  votePoll: (postId: string, optionId: string) =>
    apiRequest(`/posts/${postId}/vote`, {
      method: "POST",
      body: JSON.stringify({ optionId })
    }),

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

  createConversation: (participantId: string, listingId?: string) =>
    apiRequest("/messaging/conversations", {
      method: "POST",
      body: JSON.stringify({ participantId, listingId }),
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

  // User Activity
  getUserPosts: (userId: string) => apiRequest(`/users/${userId}/posts`),

  getUserEvents: (userId: string) => apiRequest(`/users/${userId}/events`),

  getUserClubs: (userId: string) => apiRequest(`/users/${userId}/clubs`),

  // Notifications
  getNotifications: () => apiRequest("/notifications"),

  markNotificationAsRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllNotificationsAsRead: () =>
    apiRequest("/notifications/read-all", { method: "PATCH" }),

  // Admin - College Admin
  getPendingEvents: () => apiRequest("/admin/events/pending"),

  getReports: () => apiRequest("/admin/reports"),

  approveEvent: (eventId: string) =>
    apiRequest(`/admin/events/${eventId}/approve`, { method: "POST" }),

  rejectEvent: (eventId: string, reason?: string) =>
    apiRequest(`/admin/events/${eventId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  dismissReport: (reportId: string) =>
    apiRequest(`/admin/reports/${reportId}/dismiss`, { method: "POST" }),

  hideContent: (reportId: string) =>
    apiRequest(`/admin/reports/${reportId}/hide`, { method: "POST" }),

  resolveReport: (reportId: string, action: string) =>
    apiRequest(`/admin/reports/${reportId}/resolve`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),

  createReport: (data: { targetType: string; targetId: string; reason: string; description?: string }) =>
    apiRequest("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // User Blocking
  getBlockedUsers: () => apiRequest("/users/blocked"),

  blockUser: (userId: string) =>
    apiRequest(`/users/${userId}/block`, { method: "POST" }),

  unblockUser: (userId: string) =>
    apiRequest(`/users/${userId}/block`, { method: "DELETE" }),

  // Admin - Platform Admin
  getAllUsers: () => apiRequest("/admin/users"),

  updateUserRole: (userId: string, role: string) =>
    apiRequest(`/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  banUser: (userId: string, ban: boolean, reason?: string) =>
    apiRequest(`/admin/users/${userId}/${ban ? 'ban' : 'unban'}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  getPlatformStats: () => apiRequest("/admin/stats"),

  getFeatureFlags: () => apiRequest("/admin/feature-flags"),

  updateFeatureFlag: (flag: string, enabled: boolean) =>
    apiRequest(`/admin/feature-flags/${flag}`, {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    }),

  createAnnouncement: (data: { title: string; message: string }) =>
    apiRequest("/admin/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    }),

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

  // Saved Items
  getSavedItems: () => apiRequest("/saved"),

  saveItem: (data: { type: "POST" | "EVENT" | "LISTING" | "NOTE"; postId?: string; eventId?: string; listingId?: string; noteId?: string }) =>
    apiRequest("/saved", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removeItem: (id: string) =>
    apiRequest(`/saved/${id}`, { method: "DELETE" }),
};
