const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Add custom headers from options
    if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
            if (typeof value === 'string') {
                headers[key] = value;
            }
        });
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`[API] Requesting: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const body = await response.text();
            console.error("[API] Network Error:", {
                url: fullUrl,
                status: response.status,
                body,
            });
            let error;
            try {
                error = JSON.parse(body);
            } catch {
                error = { message: body || 'Request failed' };
            }
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`[API] Network/Server Error for ${fullUrl}:`, error);
        throw error;
    }
}

// Specific API calls
export const api = {
    // Auth
    login: (email: string, password: string) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (email: string, password: string, fullName: string, collegeId?: string) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, fullName, collegeId }),
        }),

    // Users
    getCurrentUser: () => apiRequest('/users/me'),

    // Profiles
    getProfile: () => apiRequest('/profiles/me'),

    updateProfile: (data: any) =>
        apiRequest('/profiles/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    // Colleges
    getColleges: () => apiRequest('/colleges'),

    getCollegeBySlug: (slug: string) => apiRequest(`/colleges/${slug}`),

    // Clubs
    getClubs: (collegeSlug?: string) => {
        const query = collegeSlug ? `?collegeSlug=${collegeSlug}` : '';
        return apiRequest(`/clubs${query}`);
    },

    getClub: (id: string) => apiRequest(`/clubs/${id}`),

    joinClub: (id: string) =>
        apiRequest(`/clubs/${id}/join`, { method: 'POST' }),

    leaveClub: (id: string) =>
        apiRequest(`/clubs/${id}/leave`, { method: 'POST' }),

    // Events
    getEvents: (collegeSlug?: string) => {
        const query = collegeSlug ? `?collegeSlug=${collegeSlug}` : '';
        return apiRequest(`/events${query}`);
    },

    getEvent: (id: string) => apiRequest(`/events/${id}`),

    createEvent: (data: any) =>
        apiRequest('/events', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    rsvpEvent: (id: string, status: 'GOING' | 'INTERESTED' | 'NOT_GOING') =>
        apiRequest(`/events/${id}/rsvp`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        }),

    generateQr: (id: string) => apiRequest(`/events/${id}/qr`, { method: 'POST' }),

    checkIn: (id: string, token: string) =>
        apiRequest(`/events/${id}/check-in`, {
            method: 'POST',
            body: JSON.stringify({ token }),
        }),

    // Marketplace
    getMarketplaceListings: (search?: string, collegeSlug?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (collegeSlug) params.append('collegeSlug', collegeSlug);
        return apiRequest(`/marketplace?${params.toString()}`);
    },

    getMarketplaceListing: (id: string) => apiRequest(`/marketplace/${id}`),

    createMarketplaceListing: (data: any) =>
        apiRequest('/marketplace', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateMarketplaceListing: (id: string, data: any) =>
        apiRequest(`/marketplace/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    // Notes
    getNotes: (search?: string, collegeSlug?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (collegeSlug) params.append('collegeSlug', collegeSlug);
        return apiRequest(`/notes?${params.toString()}`);
    },

    getNote: (id: string) => apiRequest(`/notes/${id}`),

    createNote: (data: any) =>
        apiRequest('/notes', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    likeNote: (id: string) =>
        apiRequest(`/notes/${id}/like`, { method: 'POST' }),

    unlikeNote: (id: string) =>
        apiRequest(`/notes/${id}/like`, { method: 'DELETE' }),

    // Posts (Community Feed)
    getPosts: (collegeSlug?: string) => {
        const query = collegeSlug ? `?collegeSlug=${collegeSlug}` : '';
        return apiRequest(`/posts${query}`);
    },

    getPost: (id: string) => apiRequest(`/posts/${id}`),

    createPost: (data: { content: string; imageUrl?: string; clubId?: string }) =>
        apiRequest('/posts', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    likePost: (id: string) =>
        apiRequest(`/posts/${id}/like`, { method: 'POST' }),

    unlikePost: (id: string) =>
        apiRequest(`/posts/${id}/like`, { method: 'DELETE' }),

    // Upload
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },
};
