// API service for handling change requests data from JSON Server
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

// Change Request API functions
export const changeRequestAPI = {
  // Get all change requests
  getAll: async () => {
    return await apiCall('/change_requests');
  },

  // Get a single change request by ID
  getById: async (id) => {
    return await apiCall(`/change_requests/${id}`);
  },

  // Get change requests by user ID
  getByUserId: async (userId) => {
    return await apiCall(`/change_requests?userId=${userId}`);
  },

  // Get change requests by status
  getByStatus: async (status) => {
    return await apiCall(`/change_requests?status=${status}`);
  },

  // Create a new change request
  create: async (changeRequestData) => {
    return await apiCall('/change_requests', {
      method: 'POST',
      body: JSON.stringify(changeRequestData),
    });
  },

  // Update a change request
  update: async (id, changeRequestData) => {
    return await apiCall(`/change_requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changeRequestData),
    });
  },

  // Delete a change request
  delete: async (id) => {
    return await apiCall(`/change_requests/${id}`, {
      method: 'DELETE',
    });
  },

  // Approve a change request
  approve: async (id, approvedBy) => {
    return await apiCall(`/change_requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'approved',
        approvedBy,
        approvedAt: new Date().toISOString(),
      }),
    });
  },

  // Reject a change request
  reject: async (id, rejectedBy, reason) => {
    return await apiCall(`/change_requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'rejected',
        rejectedBy,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      }),
    });
  },
};

export default changeRequestAPI; 