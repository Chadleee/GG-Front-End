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

// Character API functions
export const characterAPI = {
  // Get all characters
  getAll: async () => {
    return await apiCall('/characters');
  },

  // Get a single character by ID
  getById: async (id) => {
    return await apiCall(`/characters/${id}`);
  },

  // Create a new character
  create: async (characterData) => {
    return await apiCall('/characters', {
      method: 'POST',
      body: JSON.stringify(characterData),
    });
  },

  // Update a character
  update: async (id, characterData) => {
    return await apiCall(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(characterData),
    });
  },

  // Delete a character
  delete: async (id) => {
    return await apiCall(`/characters/${id}`, {
      method: 'DELETE',
    });
  },
};

export default characterAPI;