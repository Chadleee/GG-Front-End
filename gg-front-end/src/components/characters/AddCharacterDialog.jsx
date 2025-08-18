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
import { Character } from '../../models/Character';

function AddCharacterDialog({ open, onClose, members }) {
  const theme = useTheme();
  const { fetchCharacters } = useCharacters();
  
  const [characterName, setCharacterName] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const handleAddCharacter = async () => {
    if (characterName.trim() && selectedMemberId) {
      try {
        await Character.create(characterName.trim(), parseInt(selectedMemberId));
        await fetchCharacters(); // Refresh the characters list
        setCharacterName('');
        setSelectedMemberId('');
        onClose();
      } catch (err) {
        console.error('Failed to create character:', err);
      }
    }
  };

  const handleClose = () => {
    setCharacterName('');
    setSelectedMemberId('');
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
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            fullWidth
            required
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
          <FormControl fullWidth required>
            <InputLabel>Member</InputLabel>
            <Select
              value={selectedMemberId}
              label="Member"
              onChange={(e) => setSelectedMemberId(e.target.value)}
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