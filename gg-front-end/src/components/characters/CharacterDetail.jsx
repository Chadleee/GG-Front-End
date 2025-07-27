import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import { useMembers } from '../../contexts/MemberContext';
import Grid from '@mui/material/Grid';
import { useUser } from '../../contexts/UserContext';
import CharacterDescription from './CharacterDescription';
import CharacterBackstory from './CharacterBackstory';
import CharacterQuotes from './CharacterQuotes';
import CharacterProfileCard from './CharacterProfileCard';
import ClipsCarousel from '../../shared/ClipsCarousel';
import GalleryCarousel from '../../shared/GalleryCarousel';

function CharacterDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacterById, updateCharacter, deleteCharacter } = useCharacters();
  const { members } = useMembers();
  const { user } = useUser();
  
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    affiliations: [],
    memberId: '',
    image: ''
  });
  const canEdit = user?.id.toString() === character?.memberId.toString();
  const canDelete = user?.role === 'admin';


  useEffect(() => {
    const characterData = getCharacterById(id);
    if (characterData) {
      setCharacter(characterData);
      setEditForm({
        name: characterData.name,
        affiliations: characterData.affiliations,
        memberId: characterData.memberId.toString(),
        image: characterData.image
      });
    }
    setLoading(false);
  }, [id, getCharacterById]);



  const handleEdit = async () => {
    if (editForm.name && editForm.affiliations && editForm.memberId) {
      try {
        const updatedCharacter = {
          ...character,
          name: editForm.name,
          affiliations: editForm.affiliations,
          memberId: parseInt(editForm.memberId),
          image: editForm.image
        };
        
        await updateCharacter(character.id, updatedCharacter);
        setCharacter(updatedCharacter);
        setEditDialog(false);
      } catch (err) {
        console.error('Failed to update character:', err);
      }
    }
  };

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
        
        {/* Character Clips - Full Width */}
        <Grid size={{ xs: 12 }}>
          <ClipsCarousel 
            title={`${character.name}'s Clips`}
            clips={character.clips || []}
            defaultExpanded={false}
            collapsible={true}
          />
        </Grid>
        
        {/* Character Gallery - Full Width */}
        <Grid size={{ xs: 12 }}>
          <GalleryCarousel 
            title={`${character.name}'s Gallery`}
            gallery={character.gallery || []}
            defaultExpanded={false}
            collapsible={true}
          />
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
          }
        }}
      >
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          Edit Character
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Character Name"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              label="Affiliations"
              value={editForm.affiliations}
              onChange={(e) => setEditForm({...editForm, affiliations: e.target.value})}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Owner</InputLabel>
              <Select
                value={editForm.memberId}
                label="Owner"
                onChange={(e) => setEditForm({...editForm, memberId: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                {members.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Image URL"
              value={editForm.image}
              onChange={(e) => setEditForm({...editForm, image: e.target.value})}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialog(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEdit} 
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CharacterDetail; 