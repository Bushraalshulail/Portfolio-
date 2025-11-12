// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  ME: `${API_BASE_URL}/users/me`,
  UPDATE_NAME: `${API_BASE_URL}/users/me/name`,
  UPDATE_PASSWORD: `${API_BASE_URL}/users/me/password`,
  
  // Gym endpoints
  GYMS: `${API_BASE_URL}/gyms`,
  
  // Contact endpoints
  CONTACT_MESSAGES: `${API_BASE_URL}/contact-messages`,
  
  // Gym suggestions endpoints
  GYM_SUGGESTIONS: `${API_BASE_URL}/gym-suggestions`,
};

// API utility functions
export const apiRequest = async (url, options = {}) => {
  // Don't set Content-Type for FormData
  const headers = {};
  if (options.body && !(options.body instanceof FormData)) {
    if (!options.headers || !options.headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }
  
  const defaultOptions = {
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  console.log('API Request:', url, options.method || 'GET');
  
  try {
    // Prepare body - if it's already a string, use it; if it's an object, stringify it
    let requestBody = options.body;
    if (requestBody && !(requestBody instanceof FormData) && typeof requestBody !== 'string') {
      requestBody = JSON.stringify(requestBody);
    }
    
    const response = await fetch(url, { 
      ...defaultOptions, 
      ...options,
      body: requestBody
    });
    
    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return null;
    }
    
    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || errorDetail;
      } catch (e) {
        // If response is not JSON, use status text
        const text = await response.text().catch(() => '');
        if (text) errorDetail = text;
      }
      console.error('API Error Response:', response.status, errorDetail);
      throw new Error(errorDetail);
    }
    
    const data = await response.json();
    console.log('API Response:', url, 'Status:', response.status, 'Data length:', Array.isArray(data) ? data.length : 'not array');
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      console.error('Network error - Server may not be running:', error);
      throw new Error('لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم على http://127.0.0.1:8000');
    }
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (email, password) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  
  resetPassword: async (email, favoriteFood, newPassword) => {
    return apiRequest(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        favorite_food: favoriteFood, 
        new_password: newPassword 
      }),
    });
  },
  
  getMe: async (token) => {
    return apiRequest(API_ENDPOINTS.ME, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Gym API functions
export const gymAPI = {
  getAll: async () => {
    return apiRequest(API_ENDPOINTS.GYMS);
  },
  
  create: async (gymData, token) => {
    return apiRequest(API_ENDPOINTS.GYMS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(gymData),
    });
  },
};

// Contact API functions
export const contactAPI = {
  sendMessage: async (messageData) => {
    return apiRequest(API_ENDPOINTS.CONTACT_MESSAGES, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

export default API_BASE_URL;

