import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/token', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Store the token
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      
      // Get user profile
      const profileResponse = await api.get('/users/me/profile');
      return {
        ...response.data,
        profile: profileResponse.data
      };
    }
    
    return response.data;
  },
  register: async (email: string, username: string, password: string) => {
    const response = await api.post('/users/', { email, username, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/users/me/profile');
    return response.data;
  },
  updateProfile: async (data: { username: string; email: string }) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },
  getLoans: async () => {
    const response = await api.get('/users/me/loans');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Users API
export const users = {
  getAll: async () => {
    const response = await api.get('/users/');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (userData: { email: string; username: string; password: string; role?: string }) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },
  update: async (id: number, userData: { email?: string; username?: string; role?: string }) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  updateStatus: async (id: number, isActive: boolean) => {
    const response = await api.put(`/users/${id}/status`, { is_active: isActive });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Books API
export const books = {
  getAll: async (params?: { 
    search?: string; 
    genre_id?: number; 
    available_only?: boolean;
    skip?: number;
    limit?: number;
  }) => {
    const response = await api.get('/books/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  create: async (bookData: any) => {
    const response = await api.post('/books/', bookData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

// Loans API
export const loans = {
  getAll: async (params?: { active_only?: boolean }) => {
    const response = await api.get('/loans/', { params });
    return response.data;
  },
  create: async (bookId: number) => {
    const response = await api.post('/loans/', { book_id: bookId });
    return response.data;
  },
  returnBook: async (loanId: number) => {
    const response = await api.put(`/loans/${loanId}/return`);
    return response.data;
  },
};

// Reviews API
export const reviews = {
  getBookReviews: async (bookId: number) => {
    const response = await api.get(`/books/${bookId}/reviews`);
    return response.data;
  },
  create: async (bookId: number, rating: number, comment: string) => {
    const response = await api.post('/reviews/', {
      book_id: bookId,
      rating,
      comment,
    });
    return response.data;
  },
};

// Genres API
export const genres = {
  getAll: async () => {
    const response = await api.get('/genres/');
    return response.data;
  },
  create: async (name: string) => {
    const response = await api.post('/genres/', { name });
    return response.data;
  },
};

// Settings API
export const settings = {
  get: async () => {
    const response = await api.get('/settings/');
    return response.data;
  },
  update: async (settingsData: {
    library_name?: string;
    admin_email?: string;
    max_books_per_user?: number;
    loan_period_days?: number;
    allow_reservations?: boolean;
    auto_renewals_enabled?: boolean;
    two_factor_required?: boolean;
    force_password_reset_days?: number;
    log_admin_activity?: boolean;
    session_timeout_minutes?: number;
    email_notifications_enabled?: boolean;
    notification_settings?: {
      due_date?: boolean;
      overdue?: boolean;
      availability?: boolean;
      news?: boolean;
    };
    reminder_days?: number;
  }) => {
    const response = await api.put('/settings/', settingsData);
    return response.data;
  },
};

export default api; 