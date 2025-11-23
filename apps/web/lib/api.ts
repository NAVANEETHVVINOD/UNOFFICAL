const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
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

    // Marketplace
    getMarketplaceListings: (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return apiRequest(`/marketplace${query}`);
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
    getNotes: (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return apiRequest(`/notes${query}`);
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
};
