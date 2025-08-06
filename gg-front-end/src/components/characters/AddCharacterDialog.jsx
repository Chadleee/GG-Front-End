import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  useTheme
} from '@mui/material';
import { useCharacters } from '../../contexts/CharacterContext';

function AddCharacterDialog({ open, onClose, members }) {
  const theme = useTheme();
  const { createCharacter } = useCharacters();
  
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    affiliations: [],
    memberId: '',
    image: 'https://via.placeholder.com/150'
  });

  const handleAddCharacter = async () => {
    if (newCharacter.name && newCharacter.affiliations && newCharacter.memberId) {
      try {
        const characterData = {
          ...newCharacter,
          memberId: parseInt(newCharacter.memberId)
        };
        
        await createCharacter(characterData);
        setNewCharacter({ name: '', affiliations: [], memberId: '', image: 'https://via.placeholder.com/150' });
        onClose();
      } catch (err) {
        // Error is handled by the context
        console.error('Failed to create character:', err);
      }
    }
  };

  const handleClose = () => {
    setNewCharacter({ name: '', affiliations: '', memberId: '', image: 'https://via.placeholder.com/150' });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
        Add New Character
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Character Name"
            value={newCharacter.name}
            onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
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
            value={newCharacter.affiliations}
            onChange={(e) => setNewCharacter({...newCharacter, affiliations: e.target.value})}
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
              <InputLabel>Member</InputLabel>
              <Select
                value={newCharacter.memberId}
                label="Member"
                onChange={(e) => setNewCharacter({...newCharacter, memberId: e.target.value})}
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
                {members
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Image URL"
              value={newCharacter.image}
              onChange={(e) => setNewCharacter({...newCharacter, image: e.target.value})}
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
          onClick={handleClose}
          sx={{ color: theme.palette.text.secondary }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAddCharacter} 
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          Add Character
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCharacterDialog; 