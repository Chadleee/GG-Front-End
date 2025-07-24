import { createContext, useContext, useState, useEffect } from 'react';
import memberAPI from '../api/members';

const MemberContext = createContext();

export const useMembers = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
};

export const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await memberAPI.getAll();
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new member
  const createMember = async (memberData) => {
    try {
      setError(null);
      const newMember = await memberAPI.create(memberData);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      console.error('Failed to create member:', err);
      setError('Failed to create member. Please try again.');
      throw err;
    }
  };

  // Update a member
  const updateMember = async (id, memberData) => {
    try {
      setError(null);
      const updatedMember = await memberAPI.update(id, memberData);
      setMembers(prev => 
        prev.map(member => member.id === id ? updatedMember : member)
      );
      return updatedMember;
    } catch (err) {
      console.error('Failed to update member:', err);
      setError('Failed to update member. Please try again.');
      throw err;
    }
  };

  // Delete a member
  const deleteMember = async (id) => {
    try {
      setError(null);
      await memberAPI.delete(id);
      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      console.error('Failed to delete member:', err);
      setError('Failed to delete member. Please try again.');
      throw err;
    }
  };

  // Get member by ID
  const getMemberById = (id) => {
    return members.find(member => member.id === id);
  };

  // Get member by name
  const getMemberByName = (name) => {
    return members.find(member => member.name === name);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load members on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const value = {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    getMemberById,
    getMemberByName,
    clearError,
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider; 