// API service for handling data from JSON Server
const API_BASE_URL = 'http://localhost:3001';

// Generic API helper function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Member API functions
export const memberAPI = {
  // Get all members
  getAll: async () => {
    return await apiCall('/members');
  },

  // Get a single member by ID
  getById: async (id) => {
    return await apiCall(`/members/${id}`);
  },

  // Create a new member
  create: async (memberData) => {
    return await apiCall('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  // Update a member
  update: async (id, memberData) => {
    return await apiCall(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  // Delete a member
  delete: async (id) => {
    return await apiCall(`/members/${id}`, {
      method: 'DELETE',
    });
  },
};

export default memberAPI;