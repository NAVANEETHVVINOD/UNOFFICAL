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
  } catch (error: any) {
    // Handle network errors gracefully
    if (error.name === 'TypeError' && error.message.includes('network')) {
      console.error(`[API] Network error for ${fullUrl}. Server may be unavailable.`);
      throw new Error("Unable to connect to server. Please try again in a moment.");
    }
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
  /**
   * Get follower and following counts for a user.
   * 
   * **Validates: Requirements 28.3, 28.4**
   */
  getFollowCounts: (userId: string) => apiRequest(`/follows/${userId}/counts`),

  /**
   * Connect with a user via QR code scan.
   * This follows the user and optionally starts a conversation.
   */
  connectViaQR: (userId: string, startConversation?: boolean) =>
    apiRequest(`/follows/${userId}/connect`, {
      method: "POST",
      body: JSON.stringify({ startConversation }),
    }),

  /**
   * Get user profile by ID (for QR scan result).
   */
  getUserById: (userId: string) => apiRequest(`/users/${userId}`),

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
  getEvents: (params?: {
    scope?: 'campus' | 'global';
    dateRange?: 'today' | 'week' | 'month' | 'all';
    priceType?: 'free' | 'paid' | 'all';
    category?: string;
    search?: string;
    collegeSlug?: string;
    cursor?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.scope) searchParams.append("scope", params.scope);
    if (params?.dateRange) searchParams.append("dateRange", params.dateRange);
    if (params?.priceType) searchParams.append("priceType", params.priceType);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.collegeSlug) searchParams.append("collegeSlug", params.collegeSlug);
    if (params?.cursor) searchParams.append("cursor", params.cursor);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    return apiRequest(`/events?${searchParams.toString()}`);
  },

  getEventsByScope: (scope: 'campus' | 'global') =>
    apiRequest(`/events/scope/${scope}`),

  getEvent: (id: string) => apiRequest(`/events/${id}`),

  createEvent: (data: any) =>
    apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEvent: (id: string, data: any) =>
    apiRequest(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string) =>
    apiRequest(`/events/${id}`, { method: "DELETE" }),

  publishEvent: (id: string) =>
    apiRequest(`/events/${id}/publish`, { method: "POST" }),

  cancelEvent: (id: string, reason?: string) =>
    apiRequest(`/events/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  archiveEvent: (id: string) =>
    apiRequest(`/events/${id}/archive`, { method: "POST" }),

  // Ticket and Registration APIs
  getTicketAvailability: (eventId: string) =>
    apiRequest(`/events/${eventId}/tickets`),

  registerForEvent: (eventId: string, data: {
    ticketId: string;
    formResponses?: Record<string, unknown>;
    noRefundConsent?: boolean;
  }) =>
    apiRequest(`/events/${eventId}/register`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getUserRegistration: (eventId: string) =>
    apiRequest(`/events/${eventId}/my-registration`),

  cancelRegistration: (eventId: string) =>
    apiRequest(`/events/${eventId}/registration`, { method: "DELETE" }),

  getEventRegistrations: (eventId: string, status?: string, cursor?: string) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (cursor) params.append("cursor", cursor);
    return apiRequest(`/events/${eventId}/registrations?${params.toString()}`);
  },

  getMyRegisteredEvents: () =>
    apiRequest("/events/user/my-events"),

  getFeaturedEvents: () => apiRequest("/events?featured=true&limit=5"),

  getTrendingEvents: () => apiRequest("/events?trending=true&limit=5"),

  saveEvent: (id: string) =>
    apiRequest(`/saved`, {
      method: "POST",
      body: JSON.stringify({ type: "EVENT", eventId: id }),
    }),

  unsaveEvent: (id: string) =>
    apiRequest(`/saved/event/${id}`, { method: "DELETE" }),

  getMyEventRole: (id: string) =>
    apiRequest(`/events/${id}/my-role`),

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
  getNotes: (search?: string, collegeSlug?: string, subject?: string, uploaderId?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (collegeSlug) params.append("collegeSlug", collegeSlug);
    if (subject) params.append("subject", subject);
    if (uploaderId) params.append("uploader", uploaderId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
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
  getPosts: (collegeSlug?: string, page: number = 1, limit: number = 20, filter?: 'all' | 'college', isOfficial?: boolean) => {
    const query = new URLSearchParams();
    if (collegeSlug) query.append("collegeSlug", collegeSlug);
    query.append("page", page.toString());
    query.append("limit", limit.toString());
    if (filter) query.append("filter", filter);
    if (isOfficial) query.append("isOfficial", "true");
    return apiRequest(`/posts?${query.toString()}`);
  },

  /**
   * Cursor-based pagination for posts feed.
   * More efficient than offset pagination for infinite scroll.
   * 
   * **Validates: Requirements 26.1, 26.2, 26.3**
   */
  getPostsCursor: (options: {
    cursor?: string;
    limit?: number;
    collegeSlug?: string;
    filter?: 'all' | 'college';
    isOfficial?: boolean;
  } = {}) => {
    const query = new URLSearchParams();
    if (options.cursor) query.append("cursor", options.cursor);
    if (options.limit) query.append("limit", options.limit.toString());
    if (options.collegeSlug) query.append("collegeSlug", options.collegeSlug);
    if (options.filter) query.append("filter", options.filter);
    if (options.isOfficial) query.append("isOfficial", "true");
    return apiRequest(`/posts/feed/cursor?${query.toString()}`);
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

  /**
   * Save a post for the authenticated user.
   * 
   * **Validates: Requirements 27.1, 27.2**
   */
  savePost: (postId: string) =>
    apiRequest(`/posts/${postId}/save`, { method: "POST" }),

  /**
   * Unsave a post for the authenticated user.
   * 
   * **Validates: Requirements 27.1, 27.2**
   */
  unsavePost: (postId: string) =>
    apiRequest(`/posts/${postId}/save`, { method: "DELETE" }),

  /**
   * Check if a post is saved by the authenticated user.
   * 
   * **Validates: Requirements 27.3**
   */
  isPostSaved: (postId: string) =>
    apiRequest(`/posts/${postId}/saved`),

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

  /**
   * Create or get a direct conversation with another user.
   * 
   * **Validates: Requirements 29.1, 29.2**
   */
  createDirectConversation: (participantId: string, initialMessage?: string) =>
    apiRequest("/messages/direct", {
      method: "POST",
      body: JSON.stringify({ participantId, initialMessage }),
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

  /**
   * Search users by name or email.
   * 
   * **Validates: Requirements 29.1**
   */
  searchUsers: (query: string) =>
    apiRequest(`/users/search?q=${encodeURIComponent(query)}`),

  // User Activity
  getUserPosts: (userId: string) => apiRequest(`/users/${userId}/posts`),

  getUserEvents: (userId: string) => apiRequest(`/users/${userId}/events`),

  getUserClubs: (userId: string) => apiRequest(`/users/${userId}/clubs`),

  /**
   * Get all saved items for the authenticated user.
   * Supports filtering by type (POST, EVENT, LISTING, NOTE).
   * 
   * **Validates: Requirements 27.4**
   */
  getMySavedItems: (type?: 'POST' | 'EVENT' | 'LISTING' | 'NOTE') => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/users/me/saved${queryString}`);
  },

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

  /**
   * Delete the authenticated user's account.
   * This permanently removes the user and all associated data.
   */
  deleteAccount: () =>
    apiRequest("/users/me", { method: "DELETE" }),

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

  // Classrooms (LMS)
  getClassrooms: () => apiRequest("/classrooms"),

  getClassroom: (id: string) => apiRequest(`/classrooms/${id}`),

  createClassroom: (data: { name: string; description?: string; subject?: string; collegeId: string }) =>
    apiRequest("/classrooms", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  joinClassroom: (code: string) =>
    apiRequest("/classrooms/join", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  createAssignment: (classroomId: string, data: any) =>
    apiRequest(`/classrooms/${classroomId}/assignments`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAssignments: (classroomId: string) =>
    apiRequest(`/classrooms/${classroomId}/assignments`),

  submitAssignment: (assignmentId: string, fileUrl: string) =>
    apiRequest(`/classrooms/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: JSON.stringify({ fileUrl }),
    }),

  getSubmissions: (assignmentId: string) =>
    apiRequest(`/classrooms/assignments/${assignmentId}/submissions`),

  gradeSubmission: (submissionId: string, grade: number, feedback?: string) =>
    apiRequest(`/classrooms/submissions/${submissionId}/grade`, {
      method: "POST",
      body: JSON.stringify({ grade, feedback }),
    }),

  /**
   * Mark attendance for a classroom.
   * 
   * **Validates: Requirements 2.1, 2.2**
   */
  markAttendance: (classroomId: string, date: string, records: Record<string, string>) =>
    apiRequest(`/classrooms/${classroomId}/attendance`, {
      method: "POST",
      body: JSON.stringify({ date, records }),
    }),

  /**
   * Get attendance records for a classroom with optional date range.
   * 
   * **Validates: Requirements 2.4**
   */
  getAttendance: (classroomId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/classrooms/${classroomId}/attendance${queryString}`);
  },

  /**
   * Get attendance for a specific date.
   */
  getAttendanceByDate: (classroomId: string, date: string) =>
    apiRequest(`/classrooms/${classroomId}/attendance/${date}`),

  /**
   * Get attendance summary for all students in a classroom.
   */
  getAttendanceSummary: (classroomId: string) =>
    apiRequest(`/classrooms/${classroomId}/attendance-summary`),

  /**
   * Get attendance percentage for a specific student.
   * 
   * **Validates: Requirements 2.3**
   */
  getStudentAttendance: (classroomId: string, studentId: string) =>
    apiRequest(`/classrooms/${classroomId}/attendance/student/${studentId}`),

  /**
   * Verify assignment completion and award karma.
   * 
   * **Validates: Requirements 1.6, 1.7**
   */
  verifySubmission: (submissionId: string, verified: boolean, karmaPoints?: number) =>
    apiRequest(`/classrooms/submissions/${submissionId}/verify`, {
      method: "POST",
      body: JSON.stringify({ verified, karmaPoints }),
    }),

  /**
   * Get classroom analytics for teacher dashboard.
   * 
   * **Validates: Requirements 1.1**
   */
  getClassroomAnalytics: (classroomId: string) =>
    apiRequest(`/classrooms/${classroomId}/analytics`),

  // Payment APIs (Razorpay Integration)
  /**
   * Calculate fee breakdown for a ticket price.
   * 
   * **Validates: Requirements 4.1, 4.2**
   */
  calculateFees: (price: number, passFeesToBuyer: boolean = true) =>
    apiRequest("/events/payments/calculate-fees", {
      method: "POST",
      body: JSON.stringify({ price, passFeesToBuyer }),
    }),

  /**
   * Create a Razorpay payment order for a registration.
   * 
   * **Validates: Requirements 4.3, 4.4**
   */
  createPaymentOrder: (registrationId: string, passFeesToBuyer: boolean = true) =>
    apiRequest("/events/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ registrationId, passFeesToBuyer }),
    }),

  /**
   * Verify payment after Razorpay checkout completion.
   * 
   * **Validates: Requirements 4.5**
   */
  verifyPayment: (orderId: string, paymentId: string, signature: string) =>
    apiRequest("/events/payments/verify", {
      method: "POST",
      body: JSON.stringify({ orderId, paymentId, signature }),
    }),

  /**
   * Manual payment verification for failed frontend callbacks.
   * 
   * **Validates: Requirements 4.6**
   */
  manualVerifyPayment: (orderId: string) =>
    apiRequest("/events/payments/manual-verify", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  /**
   * Get payment details for a registration.
   */
  getPaymentDetails: (registrationId: string) =>
    apiRequest(`/events/payments/${registrationId}`),

  // Role Management APIs
  /**
   * Get all roles for an event.
   * 
   * **Validates: Requirements 7.9**
   */
  getEventRoles: (eventId: string) =>
    apiRequest(`/events/${eventId}/roles`),

  /**
   * Assign a role to a user for an event.
   * 
   * **Validates: Requirements 7.9, 7.10, 7.11**
   */
  assignEventRole: (eventId: string, userId: string, role: 'CO_ORGANIZER' | 'HEAD' | 'VOLUNTEER') =>
    apiRequest(`/events/${eventId}/roles`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    }),

  /**
   * Remove a role from a user for an event.
   * 
   * **Validates: Requirements 19.2, 19.6**
   */
  removeEventRole: (eventId: string, userId: string, reason?: string) =>
    apiRequest(`/events/${eventId}/roles/${userId}`, {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    }),

  /**
   * Transfer event ownership to another user.
   * 
   * **Validates: Requirement 19.6**
   */
  transferEventOwnership: (eventId: string, newOwnerId: string) =>
    apiRequest(`/events/${eventId}/transfer-ownership`, {
      method: "POST",
      body: JSON.stringify({ newOwnerId }),
    }),

  /**
   * Search users for role assignment.
   * 
   * **Validates: Requirement 7.9**
   */
  searchUsersForRole: (eventId: string, query: string) =>
    apiRequest(`/events/${eventId}/roles/search?q=${encodeURIComponent(query)}`),

  /**
   * Check if user has permission for an action on an event.
   */
  checkEventPermission: (eventId: string, action: string) =>
    apiRequest(`/events/${eventId}/permissions/${action}`),

  // ============ Check-In APIs ============

  /**
   * Process QR code check-in scan.
   * 
   * **Validates: Requirements 6.2-6.5**
   */
  scanCheckIn: (eventId: string, token: string) =>
    apiRequest(`/events/${eventId}/checkin/scan`, {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  /**
   * Manual check-in (for Heads when QR fails).
   * 
   * **Validates: Requirements 6.6, 6.7**
   */
  manualCheckIn: (eventId: string, registrationId: string, reason: string) =>
    apiRequest(`/events/${eventId}/checkin/manual`, {
      method: "POST",
      body: JSON.stringify({ registrationId, reason }),
    }),

  /**
   * Check out (for entry/exit mode).
   * 
   * **Validates: Requirements 17.1, 17.2**
   */
  checkOut: (eventId: string, registrationId: string) =>
    apiRequest(`/events/${eventId}/checkin/checkout`, {
      method: "POST",
      body: JSON.stringify({ registrationId }),
    }),

  /**
   * Get check-in statistics for an event.
   */
  getCheckInStats: (eventId: string) =>
    apiRequest(`/events/${eventId}/checkin/stats`),

  /**
   * Get recent check-ins (scan history).
   */
  getCheckInHistory: (eventId: string, limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    return apiRequest(`/events/${eventId}/checkin/history?${params.toString()}`);
  },

  /**
   * Search attendees for manual check-in.
   */
  searchAttendeesForCheckIn: (eventId: string, query: string) =>
    apiRequest(`/events/${eventId}/checkin/search?q=${encodeURIComponent(query)}`),

  /**
   * Get QR code for a registration.
   */
  getRegistrationQr: (eventId: string, registrationId: string) =>
    apiRequest(`/events/${eventId}/registration/${registrationId}/qr`),

  // ============ Analytics APIs ============

  /**
   * Get comprehensive analytics summary for an event.
   * 
   * **Validates: Requirements 10.3-10.8**
   */
  getEventAnalytics: (eventId: string) =>
    apiRequest(`/events/${eventId}/analytics`),

  /**
   * Get key metrics for an event.
   */
  getEventMetrics: (eventId: string) =>
    apiRequest(`/events/${eventId}/analytics/metrics`),

  /**
   * Get registration timeline data.
   */
  getRegistrationTimeline: (eventId: string, days?: number) => {
    const params = new URLSearchParams();
    if (days) params.append("days", days.toString());
    return apiRequest(`/events/${eventId}/analytics/timeline?${params.toString()}`);
  },

  /**
   * Get ticket type breakdown.
   */
  getTicketBreakdown: (eventId: string) =>
    apiRequest(`/events/${eventId}/analytics/tickets`),

  /**
   * Get drop-off funnel data.
   */
  getDropOffFunnel: (eventId: string) =>
    apiRequest(`/events/${eventId}/analytics/funnel`),

  // ============ Waitlist APIs ============

  /**
   * Join waitlist for a ticket.
   * 
   * **Validates: Requirements 15.1, 15.2**
   */
  joinWaitlist: (eventId: string, ticketId: string) =>
    apiRequest(`/events/${eventId}/waitlist/${ticketId}/join`, {
      method: "POST",
    }),

  /**
   * Leave waitlist for a ticket.
   * 
   * **Validates: Requirements 15.1**
   */
  leaveWaitlist: (eventId: string, ticketId: string) =>
    apiRequest(`/events/${eventId}/waitlist/${ticketId}/leave`, {
      method: "DELETE",
    }),

  /**
   * Get user's waitlist position for a ticket.
   * 
   * **Validates: Requirements 15.7**
   */
  getWaitlistPosition: (eventId: string, ticketId: string) =>
    apiRequest(`/events/${eventId}/waitlist/${ticketId}/position`),

  /**
   * Get user's waitlist status for all tickets in an event.
   * 
   * **Validates: Requirements 15.7**
   */
  getMyWaitlistStatus: (eventId: string) =>
    apiRequest(`/events/${eventId}/waitlist/my-status`),

  /**
   * Claim ticket from waitlist.
   * 
   * **Validates: Requirements 15.4, 15.5**
   */
  claimWaitlistTicket: (eventId: string, ticketId: string) =>
    apiRequest(`/events/${eventId}/waitlist/${ticketId}/claim`, {
      method: "POST",
    }),

  /**
   * Get waitlist statistics for an event (organizer only).
   */
  getWaitlistStats: (eventId: string) =>
    apiRequest(`/events/${eventId}/waitlist/stats`),

  // ============ Form Schema APIs ============

  /**
   * Get form schema for an event.
   * 
   * **Validates: Requirements 9.6**
   */
  getEventFormSchema: (eventId: string) =>
    apiRequest(`/events/${eventId}/form-schema`),

  // ============ Export APIs ============

  /**
   * Export event attendees as CSV.
   * 
   * **Validates: Requirements 10.1, 10.2**
   */
  exportEventAttendees: async (eventId: string, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/events/${eventId}/export?format=${format}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Export failed");
    }

    return response.blob();
  },

  // ============ Certificate APIs ============

  /**
   * Get available certificate templates.
   * 
   * **Validates: Requirements 8.1**
   */
  getCertificateTemplates: () =>
    apiRequest("/events/certificates/templates"),

  /**
   * Get all certificates for an event.
   * 
   * **Validates: Requirements 8.7**
   */
  getEventCertificates: (eventId: string) =>
    apiRequest(`/events/${eventId}/certificates`),

  /**
   * Issue certificate to a specific attendee.
   * 
   * **Validates: Requirements 8.3, 8.4, 8.9**
   */
  issueCertificate: (eventId: string, userId: string, reason?: string) =>
    apiRequest(`/events/${eventId}/certificates/issue`, {
      method: "POST",
      body: JSON.stringify({ userId, reason }),
    }),

  /**
   * Batch issue certificates to all eligible attendees.
   * 
   * **Validates: Requirements 8.3, 8.7**
   */
  batchIssueCertificates: (eventId: string) =>
    apiRequest(`/events/${eventId}/certificates/batch-issue`, {
      method: "POST",
    }),

  /**
   * Check if user is eligible for certificate.
   * 
   * **Validates: Requirements 8.3, 8.4**
   */
  checkCertificateEligibility: (eventId: string, userId: string) =>
    apiRequest(`/events/${eventId}/certificates/eligibility/${userId}`),

  /**
   * Get user's certificate for an event.
   * 
   * **Validates: Requirements 8.6**
   */
  getMyCertificate: (eventId: string) =>
    apiRequest(`/events/${eventId}/certificates/my-certificate`),

  /**
   * Get all certificates for the current user.
   * 
   * **Validates: Requirements 8.8**
   */
  getMyAllCertificates: () =>
    apiRequest("/events/user/my-certificates"),
};
