import { createContext, useContext, useState, useEffect } from 'react';
import characterAPI from '../api/characters';
import { Character } from '../models/Character';

const CharacterContext = createContext();

export const useCharacters = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  return context;
};

export const CharacterProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all characters
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await characterAPI.getAll();
      const characterInstances = data.map(characterData => Character.fromData(characterData));
      setCharacters(characterInstances);
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      setError('Failed to load characters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Upsert character (create or update)
  const upsertCharacter = async (characterData) => {
    try {
      setError(null);
      let result;
      
      if (characterData.id) {
        // Update existing character
        const updatedCharacterData = await characterAPI.update(characterData.id, characterData);
        result = Character.fromData(updatedCharacterData);
        setCharacters(prev => 
          prev.map(char => char.id === characterData.id ? result : char)
        );
      } else {
        // Create new character
        const newCharacterData = await characterAPI.create(characterData);
        result = Character.fromData(newCharacterData);
        setCharacters(prev => [...prev, result]);
      }
      
      return result;
    } catch (err) {
      console.error('Failed to upsert character:', err);
      setError('Failed to save character. Please try again.');
      throw err;
    }
  };

  // Delete a character
  const deleteCharacter = async (id) => {
    try {
      setError(null);
      await characterAPI.delete(id);
      setCharacters(prev => prev.filter(char => char.id !== id));
    } catch (err) {
      console.error('Failed to delete character:', err);
      setError('Failed to delete character. Please try again.');
      throw err;
    }
  };

  // Get character by ID
  const getCharacterById = (id) => {
    return characters.find(char => char.id == id);
  };

  // Get characters by member ID
  const getCharactersByMemberId = (memberId) => {
    return characters.filter(char => char.memberId === memberId);
  };

  // Update character gallery
  const updateCharacterGallery = async (id, gallery) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const result = await character.updateGallery(gallery);
      setCharacters(prev => 
        prev.map(char => char.id === id ? character : char)
      );
      return result;
    } catch (err) {
      console.error('Failed to update character gallery:', err);
      setError('Failed to update character gallery. Please try again.');
      throw err;
    }
  };

  // Add image to character gallery
  const addImageToCharacterGallery = async (id, imageData) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const currentGallery = character.gallery || [];
      const updatedGallery = [...currentGallery, imageData];
      return await updateCharacterGallery(id, updatedGallery);
    } catch (err) {
      console.error('Failed to add image to character gallery:', err);
      setError('Failed to add image to character gallery. Please try again.');
      throw err;
    }
  };

  // Update image in character gallery
  const updateImageInCharacterGallery = async (id, imageIndex, imageData) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const currentGallery = character.gallery || [];
      const updatedGallery = [...currentGallery];
      updatedGallery[imageIndex] = imageData;
      return await updateCharacterGallery(id, updatedGallery);
    } catch (err) {
      console.error('Failed to update image in character gallery:', err);
      setError('Failed to update image in character gallery. Please try again.');
      throw err;
    }
  };

  // Delete image from character gallery
  const deleteImageFromCharacterGallery = async (id, imageIndex) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const currentGallery = character.gallery || [];
      const updatedGallery = currentGallery.filter((_, index) => index !== imageIndex);
      return await updateCharacterGallery(id, updatedGallery);
    } catch (err) {
      console.error('Failed to delete image from character gallery:', err);
      setError('Failed to delete image from character gallery. Please try again.');
      throw err;
    }
  };

  // Update character clips
  const updateCharacterClips = async (id, clips) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const result = await character.updateClips(clips);
      setCharacters(prev => 
        prev.map(char => char.id === id ? character : char)
      );
      return result;
    } catch (err) {
      console.error('Failed to update character clips:', err);
      setError('Failed to update character clips. Please try again.');
      throw err;
    }
  };

  // Add clip to character clips
  const addClipToCharacterClips = async (id, clipData) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const result = await character.addClipToClips(clipData);
      setCharacters(prev => 
        prev.map(char => char.id === id ? character : char)
      );
      return result;
    } catch (err) {
      console.error('Failed to add clip to character clips:', err);
      setError('Failed to add clip to character clips. Please try again.');
      throw err;
    }
  };

  // Update clip in character clips
  const updateClipInCharacterClips = async (id, clipIndex, clipData) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const result = await character.updateClipInClips(clipIndex, clipData);
      setCharacters(prev => 
        prev.map(char => char.id === id ? character : char)
      );
      return result;
    } catch (err) {
      console.error('Failed to update clip in character clips:', err);
      setError('Failed to update clip in character clips. Please try again.');
      throw err;
    }
  };

  // Delete clip from character clips
  const deleteClipFromCharacterClips = async (id, clipIndex) => {
    try {
      setError(null);
      const character = getCharacterById(id);
      if (!character) {
        throw new Error('Character not found');
      }
      
      const result = await character.deleteClipFromClips(clipIndex);
      setCharacters(prev => 
        prev.map(char => char.id === id ? character : char)
      );
      return result;
    } catch (err) {
      console.error('Failed to delete clip from character clips:', err);
      setError('Failed to delete clip from character clips. Please try again.');
      throw err;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load characters on mount
  useEffect(() => {
    fetchCharacters();
  }, []);

  const value = {
    characters,
    loading,
    error,
    fetchCharacters,
    upsertCharacter,
    deleteCharacter,
    getCharacterById,
    getCharactersByMemberId,
    updateCharacterGallery,
    addImageToCharacterGallery,
    updateImageInCharacterGallery,
    deleteImageFromCharacterGallery,
    updateCharacterClips,
    addClipToCharacterClips,
    updateClipInCharacterClips,
    deleteClipFromCharacterClips,
    clearError,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export default CharacterProvider; 