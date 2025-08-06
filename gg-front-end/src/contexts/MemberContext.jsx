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

  // Upsert member (create or update)
  const upsertMember = async (memberData) => {
    try {
      setError(null);
      let result;
      
      if (memberData.id) {
        // Update existing member
        const updatedMemberData = await memberAPI.update(memberData.id, memberData);
        result = Member.fromData(updatedMemberData);
        setMembers(prev => 
          prev.map(member => member.id === memberData.id ? result : member)
        );
      } else {
        // Create new member
        const newMemberData = await memberAPI.create(memberData);
        result = Member.fromData(newMemberData);
        setMembers(prev => [...prev, result]);
      }
      
      return result;
    } catch (err) {
      console.error('Failed to upsert member:', err);
      setError('Failed to save member. Please try again.');
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
    return members.find(member => member.id == id);
  };

  // Get member by name
  const getMemberByName = (name) => {
    return members.find(member => member.name === name);
  };

  // Update member gallery
  const updateMemberGallery = async (id, gallery) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.updateGallery(gallery);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to update member gallery:', err);
      setError('Failed to update member gallery. Please try again.');
      throw err;
    }
  };

  // Add image to member gallery
  const addImageToMemberGallery = async (id, imageData) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const currentGallery = member.gallery || [];
      const updatedGallery = [...currentGallery, imageData];
      return await updateMemberGallery(id, updatedGallery);
    } catch (err) {
      console.error('Failed to add image to member gallery:', err);
      setError('Failed to add image to member gallery. Please try again.');
      throw err;
    }
  };

  // Update image in member gallery
  const updateImageInMemberGallery = async (id, imageIndex, imageData) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const currentGallery = member.gallery || [];
      const updatedGallery = [...currentGallery];
      updatedGallery[imageIndex] = imageData;
      return await updateMemberGallery(id, updatedGallery);
    } catch (err) {
      console.error('Failed to update image in member gallery:', err);
      setError('Failed to update image in member gallery. Please try again.');
      throw err;
    }
  };

  // Delete image from member gallery
  const deleteImageFromMemberGallery = async (id, imageIndex) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const currentGallery = member.gallery || [];
      const updatedGallery = currentGallery.filter((_, index) => index !== imageIndex);
      return await updateMemberGallery(id, updatedGallery);
    } catch (err) {
      console.error('Failed to delete image from member gallery:', err);
      setError('Failed to delete image from member gallery. Please try again.');
      throw err;
    }
  };

  // Update member clips
  const updateMemberClips = async (id, clips) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.updateClips(clips);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to update member clips:', err);
      setError('Failed to update member clips. Please try again.');
      throw err;
    }
  };

  // Add clip to member clips
  const addClipToMemberClips = async (id, clipData) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.addClipToClips(clipData);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to add clip to member clips:', err);
      setError('Failed to add clip to member clips. Please try again.');
      throw err;
    }
  };

  // Update clip in member clips
  const updateClipInMemberClips = async (id, clipIndex, clipData) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.updateClipInClips(clipIndex, clipData);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to update clip in member clips:', err);
      setError('Failed to update clip in member clips. Please try again.');
      throw err;
    }
  };

  // Delete clip from member clips
  const deleteClipFromMemberClips = async (id, clipIndex) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.deleteClipFromClips(clipIndex);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to delete clip from member clips:', err);
      setError('Failed to delete clip from member clips. Please try again.');
      throw err;
    }
  };

  // Update member socials
  const updateMemberSocials = async (id, socials) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.updateSocials(socials);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to update member socials:', err);
      setError('Failed to update member socials. Please try again.');
      throw err;
    }
  };

  // Add social to member socials
  const addSocialToMemberSocials = async (id, socialData) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.addSocialToSocials(socialData);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to add social to member socials:', err);
      setError('Failed to add social to member socials. Please try again.');
      throw err;
    }
  };

  // Update social in member socials
  const updateSocialInMemberSocials = async (id, socialIndex, socialData) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.updateSocialInSocials(socialIndex, socialData);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to update social in member socials:', err);
      setError('Failed to update social in member socials. Please try again.');
      throw err;
    }
  };

  // Delete social from member socials
  const deleteSocialFromMemberSocials = async (id, socialIndex) => {
    try {
      setError(null);
      const member = getMemberById(id);
      if (!member) {
        throw new Error('Member not found');
      }
      
      const result = await member.deleteSocialFromSocials(socialIndex);
      setMembers(prev => 
        prev.map(m => m.id === id ? member : m)
      );
      return result;
    } catch (err) {
      console.error('Failed to delete social from member socials:', err);
      setError('Failed to delete social from member socials. Please try again.');
      throw err;
    }
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
    upsertMember,
    deleteMember,
    getMemberById,
    getMemberByName,
    updateMemberGallery,
    addImageToMemberGallery,
    updateImageInMemberGallery,
    deleteImageFromMemberGallery,
    updateMemberClips,
    addClipToMemberClips,
    updateClipInMemberClips,
    deleteClipFromMemberClips,
    updateMemberSocials,
    addSocialToMemberSocials,
    updateSocialInMemberSocials,
    deleteSocialFromMemberSocials,
    clearError,
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider; 