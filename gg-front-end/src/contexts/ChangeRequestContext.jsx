import { createContext, useContext, useState, useEffect } from 'react';
import changeRequestAPI from '../api/changeRequests';

const ChangeRequestContext = createContext();

export const useChangeRequests = () => {
  const context = useContext(ChangeRequestContext);
  if (!context) {
    throw new Error('useChangeRequests must be used within a ChangeRequestProvider');
  }
  return context;
};

export const ChangeRequestProvider = ({ children }) => {
  const [changeRequests, setChangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all change requests
  const fetchChangeRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await changeRequestAPI.getAll();
      setChangeRequests(data);
    } catch (err) {
      console.error('Failed to fetch change requests:', err);
      setError('Failed to load change requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get change requests by character ID
  const getChangeRequestsByCharacterId = (characterId) => {
    return changeRequests.filter(request => 
      request.entity === 'character' && request.entityId == characterId
    );
  };

  // Get change requests by member ID
  const getChangeRequestsByMemberId = (memberId) => {
    return changeRequests.filter(request => 
      request.entity === 'member' && request.entityId == memberId
    );
  };

  // Get change request by ID
  const getChangeRequestById = (id) => {
    return changeRequests.find(request => request.id == id);
  };

  // Get change requests by status
  const getChangeRequestsByStatus = (status) => {
    return changeRequests.filter(request => request.status === status);
  };

  // Get change requests by user ID
  const getChangeRequestsByUserId = (userId) => {
    return changeRequests.filter(request => request.userId == userId);
  };

  // Create a new change request
  const createChangeRequest = async (changeRequestData) => {
    try {
      setError(null);
      const newChangeRequest = await changeRequestAPI.create(changeRequestData);
      setChangeRequests(prev => [...prev, newChangeRequest]);
      return newChangeRequest;
    } catch (err) {
      console.error('Failed to create change request:', err);
      setError('Failed to create change request. Please try again.');
      throw err;
    }
  };

  // Update a change request
  const updateChangeRequest = async (id, changeRequestData) => {
    try {
      setError(null);
      const updatedChangeRequest = await changeRequestAPI.update(id, changeRequestData);
      setChangeRequests(prev => 
        prev.map(request => request.id === id ? updatedChangeRequest : request)
      );
      return updatedChangeRequest;
    } catch (err) {
      console.error('Failed to update change request:', err);
      setError('Failed to update change request. Please try again.');
      throw err;
    }
  };

  // Delete a change request
  const deleteChangeRequest = async (id) => {
    try {
      setError(null);
      await changeRequestAPI.delete(id);
      setChangeRequests(prev => prev.filter(request => request.id !== id));
    } catch (err) {
      console.error('Failed to delete change request:', err);
      setError('Failed to delete change request. Please try again.');
      throw err;
    }
  };

  // Approve a change request
  const approveChangeRequest = async (id, approvedBy) => {
    try {
      setError(null);
      const approvedChangeRequest = await changeRequestAPI.approve(id, approvedBy);
      setChangeRequests(prev => 
        prev.map(request => request.id === id ? approvedChangeRequest : request)
      );
      return approvedChangeRequest;
    } catch (err) {
      console.error('Failed to approve change request:', err);
      setError('Failed to approve change request. Please try again.');
      throw err;
    }
  };

  // Reject a change request
  const rejectChangeRequest = async (id, rejectedBy, reason) => {
    try {
      setError(null);
      const rejectedChangeRequest = await changeRequestAPI.reject(id, rejectedBy, reason);
      setChangeRequests(prev => 
        prev.map(request => request.id === id ? rejectedChangeRequest : request)
      );
      return rejectedChangeRequest;
    } catch (err) {
      console.error('Failed to reject change request:', err);
      setError('Failed to reject change request. Please try again.');
      throw err;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load change requests on mount
  useEffect(() => {
    fetchChangeRequests();
  }, []);

  const value = {
    changeRequests,
    loading,
    error,
    fetchChangeRequests,
    getChangeRequestsByCharacterId,
    getChangeRequestsByMemberId,
    getChangeRequestById,
    getChangeRequestsByStatus,
    getChangeRequestsByUserId,
    createChangeRequest,
    updateChangeRequest,
    deleteChangeRequest,
    approveChangeRequest,
    rejectChangeRequest,
    clearError,
  };

  return (
    <ChangeRequestContext.Provider value={value}>
      {children}
    </ChangeRequestContext.Provider>
  );
};

export default ChangeRequestProvider;
