const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  // Convert headers to a plain object
  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge existing headers if provided
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headersObj[key] = value;
      });
    } else {
      Object.assign(headersObj, options.headers);
    }
  }

  // Add authorization token if available
  if (token) {
    headersObj.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: headersObj,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiRequest<{ success: boolean; data: { user: any; token: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; role: string; location?: any; phone?: string }) =>
    apiRequest<{ success: boolean; data: { user: any; token: string } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    }),

  getMe: () =>
    apiRequest<{ success: boolean; data: { user: any } }>("/auth/me", {
      method: "GET",
    }),

  updatePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<{ success: boolean; message: string; token: string }>("/auth/updatepassword", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Donations
  getDonations: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    return apiRequest<{ success: boolean; data: { donations: any[] } }>(`/donations?${query}`);
  },

  createDonation: (data: any) =>
    apiRequest<{ success: boolean; data: { donation: any } }>("/donations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getDonation: (id: string) =>
    apiRequest<{ success: boolean; data: { donation: any } }>(`/donations/${id}`, {
      method: "GET",
    }),

  // Users
  getUsers: (params?: { role?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.role) query.append("role", params.role);
    if (params?.status) query.append("status", params.status);
    return apiRequest<{ success: boolean; data: { users: any[] } }>(`/users?${query}`);
  },

  getUser: (id: string) =>
    apiRequest<{ success: boolean; data: { user: any } }>(`/users/${id}`, {
      method: "GET",
    }),

  updateUser: (id: string, data: any) =>
    apiRequest<{ success: boolean; data: { user: any } }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};


