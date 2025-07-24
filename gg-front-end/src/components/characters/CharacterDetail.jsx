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
  Grid,
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
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';

function CharacterDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacterById, updateCharacter, deleteCharacter } = useCharacters();
  const { members } = useMembers();
  
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    race: '',
    memberId: '',
    avatar: ''
  });

  useEffect(() => {
    const characterData = getCharacterById(parseInt(id));
    if (characterData) {
      setCharacter(characterData);
      setEditForm({
        name: characterData.name,
        race: characterData.race,
        memberId: characterData.memberId.toString(),
        avatar: characterData.avatar
      });
    }
    setLoading(false);
  }, [id, getCharacterById]);

  const getCharacterAvatar = (characterName) => {
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
        return 'https://via.placeholder.com/150';
    }
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };

  const handleEdit = async () => {
    if (editForm.name && editForm.race && editForm.memberId) {
      try {
        const updatedCharacter = {
          ...character,
          name: editForm.name,
          race: editForm.race,
          memberId: parseInt(editForm.memberId),
          avatar: editForm.avatar
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
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/characters')}
          sx={{ mr: 2, color: theme.palette.primary.main }}
        >
          Back to Characters
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Character Details
        </Typography>
        <Button 
          startIcon={<EditIcon />}
          onClick={() => setEditDialog(true)}
          sx={{ mr: 2, color: theme.palette.primary.main }}
        >
          Edit
        </Button>
        <Button 
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          sx={{ mr: 2, color: theme.palette.primary.main }}
        >
          Delete
        </Button>
      </Box>

      {/* Character Details */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{
              backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={getCharacterAvatar(character.name)} 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    border: `3px solid ${theme.palette.primary.main}`
                  }}
                />
                <Typography variant="h4" component="h2" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }} gutterBottom>
                  {character.name}
                </Typography>
                <Chip 
                  label={character.race} 
                  sx={{ 
                    mb: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontSize: '1.1rem',
                    padding: '8px 16px'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            sx={{
              backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }} gutterBottom>
                Character Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Played by
                </Typography>
                <Button
                  onClick={() => navigate(`/members/${character.memberId}`)}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  {getMemberName(character.memberId)}
                </Button>
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
              label="Race"
              value={editForm.race}
              onChange={(e) => setEditForm({...editForm, race: e.target.value})}
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
              label="Avatar URL"
              value={editForm.avatar}
              onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
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