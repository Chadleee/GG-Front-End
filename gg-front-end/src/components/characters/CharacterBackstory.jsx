import { Box } from '@mui/material';
import EditableExpandableCard from '../../shared/editableComponents/EditableExpandableCard';
import { useCharacters } from '../../contexts/CharacterContext';

function CharacterBackstory({ character, canEdit, onCharacterUpdate }) {
  const { updateCharacter } = useCharacters();

  const handleBackstoryUpdate = async (newBackstory) => {
    try {
      const updatedCharacter = {
        ...character,
        backstory: newBackstory
      };
      
      await updateCharacter(character.id, updatedCharacter);
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
      defaultExpanded={false}
      canEdit={canEdit}
    />
  );
}

export default CharacterBackstory; 