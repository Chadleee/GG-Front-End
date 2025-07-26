import { createContext, useContext, useState, useEffect } from 'react';
import characterAPI from '../api/characters';

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
      setCharacters(data);
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      setError('Failed to load characters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new character
  const createCharacter = async (characterData) => {
    try {
      setError(null);
      const newCharacter = await characterAPI.create(characterData);
      setCharacters(prev => [...prev, newCharacter]);
      return newCharacter;
    } catch (err) {
      console.error('Failed to create character:', err);
      setError('Failed to create character. Please try again.');
      throw err;
    }
  };

  // Update a character
  const updateCharacter = async (id, characterData) => {
    try {
      setError(null);
      const updatedCharacter = await characterAPI.update(id, characterData);
      setCharacters(prev => 
        prev.map(char => char.id === id ? updatedCharacter : char)
      );
      return updatedCharacter;
    } catch (err) {
      console.error('Failed to update character:', err);
      setError('Failed to update character. Please try again.');
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
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacterById,
    getCharactersByMemberId,
    clearError,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export default CharacterProvider; 