import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import Grid from '@mui/material/Grid';
import { useUser } from '../../contexts/UserContext';
import CharacterDescription from './CharacterDescription';
import CharacterBackstory from './CharacterBackstory';
import CharacterQuotes from './CharacterQuotes';
import CharacterProfileCard from './CharacterProfileCard';
import CharacterRelationships from './CharacterRelationships';
import ClipsCarousel from '../../shared/ClipsCarousel';
import GalleryCarousel from '../../shared/GalleryCarousel';

function CharacterDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacterById, deleteCharacter } = useCharacters();
  const { user } = useUser();
  
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const canEdit = user?.id.toString() === character?.memberId.toString();
  const canDelete = user?.role === 'admin';


  useEffect(() => {
    const characterData = getCharacterById(id);
    if (characterData) {
      setCharacter(characterData);
    }
    setLoading(false);
  }, [id, getCharacterById]);





  const handleDelete = async () => {
    try {
      await deleteCharacter(character.id);
      navigate('/characters');
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading character...</Typography>
      </Box>
    );
  }

  if (!character) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography color="error">Character not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, ml: 2 }}>
            {character.name}
          </Typography>
          {canDelete && (
          <Button 
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{ ml: 2, color: theme.palette.primary.main }}
          >
            Delete
          </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/characters')}
            sx={{ color: theme.palette.primary.main }}
          >
            Back to Characters
          </Button>
        </Box>
      </Box>

      {/* Character Details */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CharacterProfileCard character={character} />
        </Grid>
        
        {/* Character Description and Backstory */}
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
          <CharacterDescription 
            character={character}
            canEdit={canEdit}
            onCharacterUpdate={setCharacter}
          />
          
          <Box sx={{ mt: 2 }}>
            <CharacterBackstory 
              character={character}
              canEdit={canEdit}
              onCharacterUpdate={setCharacter}
            />
          </Box>
        </Grid>
        
        {/* Character Quotes - Full Width */}
        <Grid size={{ xs: 12 }}>
          <CharacterQuotes 
            character={character}
            canEdit={canEdit}
            onCharacterUpdate={setCharacter}
          />
        </Grid>
        
        {/* Character Relationships - Full Width */}
        <Grid size={{ xs: 12 }}>
          <CharacterRelationships 
            character={character}
            theme={theme}
          />
        </Grid>
        
        {/* Character Clips - Full Width */}
        <Grid size={{ xs: 12 }}>
          <ClipsCarousel 
            title={`${character.name}'s Clips`}
            clips={character.clips || []}
            defaultExpanded={false}
            collapsible={true}
            seeAllUrl={`/characters/${character.id}/videos`}
          />
        </Grid>
        
        {/* Character Gallery - Full Width */}
        <Grid size={{ xs: 12 }}>
          <GalleryCarousel 
            title={`${character.name}'s Gallery`}
            gallery={character.gallery || []}
            defaultExpanded={false}
            collapsible={true}
            seeAllUrl={`/characters/${character.id}/galleries`}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CharacterDetail; 