import { Box } from '@mui/material';
import EditableExpandableCard from '../shared/editableComponents/EditableExpandableCard';
import { useCharacters } from '../../contexts/CharacterContext';

function CharacterBackstory({ character, canEdit, onCharacterUpdate }) {
  const { fetchCharacters, getCharacterById } = useCharacters();

  const handleBackstoryUpdate = async (newBackstory) => {
    try {
          await character.update(newBackstory, 'backstory');
    await fetchCharacters();
    const updatedCharacter = getCharacterById(character.id);
    onCharacterUpdate(updatedCharacter);
    } catch (err) {
      console.error('Failed to update character backstory:', err);
    }
  };

  return (
    <EditableExpandableCard 
      title="Backstory"
      value={character.backstory}
      onSave={handleBackstoryUpdate}
      entityType="character"
      entityId={character.id}
      fieldType="backstory"
      placeholder="Enter character backstory..."
      defaultExpanded={true}
      canEdit={canEdit}
    />
  );
}

export default CharacterBackstory; 