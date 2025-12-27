import axios from 'axios';

// 1. Base Setup
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// 2. Interceptor: Auto-attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken'); 
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// --- API SERVICES ---

// 1. AUTHENTICATION
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    getProfile: () => api.get('/auth/profile'),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
};

// 2. ADMIN DASHBOARD & USER MANAGEMENT
export const adminService = {
    getDashboardStats: () => api.get('/admin/dashboard'),
    
    // User CRUD
    getAllUsers: () => api.get('/admin/users'),
    updateUserStatus: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    // Team CRUD
    getAllTeams: () => api.get('/admin/teams'),
    createTeam: (data) => api.post('/admin/teams', data),
    updateTeam: (id, data) => api.put(`/admin/teams/${id}`, data),
    deleteTeam: (id) => api.delete(`/admin/teams/${id}`),
    
    // Work Center CRUD (Consolidated here for Organization Management)
    getAllWorkCenters: () => api.get('/resources/work-centers'),
    createWorkCenter: (data) => api.post('/resources/work-centers', data),
    updateWorkCenter: (id, data) => api.put(`/resources/work-centers/${id}`, data),
    deleteWorkCenter: (id) => api.delete(`/resources/work-centers/${id}`),
};

// 3. MASTER DATA (Resources)
export const resourceService = {
    // Type: 'companies', 'departments', 'categories'
    getAll: (type) => api.get(`/resources/${type}`), 
    
    create: (type, data) => api.post(`/resources/${type}`, data),
    delete: (type, id) => api.delete(`/resources/${type}/${id}`),
    // Assuming generic update exists, otherwise handle individually
    update: (type, id, data) => api.put(`/resources/${type}/${id}`, data), 
};

// 4. MAINTENANCE REQUESTS
export const maintenanceService = {
    getAll: () => api.get('/maintenance/requests'),
    getById: (id) => api.get(`/maintenance/requests/${id}`),
    create: (data) => api.post('/maintenance/requests', data),
    update: (id, data) => api.put(`/maintenance/requests/${id}`, data),
    delete: (id) => api.delete(`/maintenance/requests/${id}`),
};

export default api;