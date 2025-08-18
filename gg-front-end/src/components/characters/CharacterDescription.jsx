import { Box } from '@mui/material';
import EditableExpandableCard from '../shared/editableComponents/EditableExpandableCard';
import { useCharacters } from '../../contexts/CharacterContext';

function CharacterDescription({ character, canEdit, onCharacterUpdate }) {
  const { fetchCharacters, getCharacterById } = useCharacters();

  const handleDescriptionUpdate = async (newDescription) => {
    try {
          await character.update(newDescription, 'description');
    await fetchCharacters();
    const updatedCharacter = getCharacterById(character.id);
    onCharacterUpdate(updatedCharacter);
    } catch (err) {
      console.error('Failed to update character description:', err);
    }
  };

  return (
    <EditableExpandableCard 
      title="Description"
      value={character.description}
      onSave={handleDescriptionUpdate}
      entityType="character"
      entityId={character.id}
      fieldType="description"
      placeholder="Enter character description..."
      defaultExpanded={true}
      canEdit={canEdit}
    />
  );
}

export default CharacterDescription; 