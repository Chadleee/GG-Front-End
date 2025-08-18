import { createContext, useContext, useState, useEffect } from 'react';
import memberAPI from '../api/members';
import { Member } from '../models/Member';

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
      const memberInstances = data.map(memberData => Member.fromData(memberData));
      setMembers(memberInstances);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
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
    return members.find(member => member.id == id);
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