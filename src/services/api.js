const API_BASE_URL = 'http://localhost:8080/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Get auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
});

// Generic API request handler
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    // Handle unauthorized
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),

  getById: (id) => apiRequest(`/events/${id}`),

  create: (eventData) =>
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  update: (id, eventData) =>
    apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  delete: (id) =>
    apiRequest(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// Guests API
export const guestsAPI = {
  getAll: () => apiRequest('/guests'),

  getById: (id) => apiRequest(`/guests/${id}`),

  create: (guestData) =>
    apiRequest('/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    }),

  update: (id, guestData) =>
    apiRequest(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guestData),
    }),

  delete: (id) =>
    apiRequest(`/guests/${id}`, {
      method: 'DELETE',
    }),
};
