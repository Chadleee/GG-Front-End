import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Button, 
  Chip,
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
import Portrait from '../Portrait';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';
import Grid from '@mui/material/Grid';
import { useUser } from '../../contexts/UserContext';

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

  const getCharacterImage = (characterName, imageUrl) => {
    switch (characterName) {
      case 'Shabammabop':
        return shabammabop;
      case 'Crazy Girl':
        return crazyGirl;
      case 'Joe Biden':
        return joeBiden;
      case 'Jigsaw':
        return jigsaw;
      case 'Roflgator':
        return roflgator;
      case 'Steven':
        return steven;
      case 'Gas Station Employee':
        return gasStationEmployee;
      case 'Marcus':
        return marcus;
      default:
        return imageUrl;
    }
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };

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
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'right', mb: 2, justifyContent: 'right' }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/characters')}
          sx={{ color: theme.palette.primary.main }}
        >
          Back to Characters
        </Button>
      </Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {character.name}
        </Typography>
        {canEdit && (
        <Button 
          startIcon={<EditIcon />}
          onClick={() => setEditDialog(true)}
          sx={{ mr: 2, color: theme.palette.primary.main }}
        >
          Edit
        </Button>
        )}
        {canDelete && (
        <Button 
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          sx={{ mr: 2, color: theme.palette.primary.main }}
        >
          Delete
        </Button>
        )}
      </Box>

      {/* Character Details */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card 
            sx={{
              backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box sx={{mb: 2}}>
                  <Portrait 
                    src={getCharacterImage(character.name, character.image)}
                    alt={character.name}
                    size={120}
                  />
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'row' }}>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                    Played by:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'column' }}>
                      <Typography
                        key={character.memberId}
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          cursor: 'pointer',
                          textDecoration: 'none',
                          width: 'fit-content',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={() => navigate(`/members/${character.memberId}`)}
                      >
                        {getMemberName(character.memberId)}
                      </Typography>
                  </Box>
                </Box>

                {character.affiliations && character.affiliations.map((affiliation) => (
                  <Chip 
                    key={affiliation}
                    label={affiliation}
                    sx={{ 
                      mb: 2,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontSize: '1.1rem',
                      padding: '8px 16px'
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
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