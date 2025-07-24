import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useTheme
} from '@mui/material';
import { useMembers } from '../../contexts/MemberContext';

function AddMemberDialog({ open, onClose }) {
  const theme = useTheme();
  const { createMember } = useMembers();
  
  const [newMember, setNewMember] = useState({
    name: '',
    image: 'https://via.placeholder.com/150'
  });

  const handleAddMember = async () => {
    if (newMember.name) {
      try {
        const memberData = {
          ...newMember,
          joinDate: new Date().toISOString().split('T')[0]
        };
        
        await createMember(memberData);
        setNewMember({ name: '', image: 'https://via.placeholder.com/150' });
        onClose();
      } catch (err) {
        // Error is handled by the context
        console.error('Failed to create member:', err);
      }
    }
  };

  const handleClose = () => {
    setNewMember({ name: '', image: 'https://via.placeholder.com/150' });
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
        Add New Member
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Member Name"
            value={newMember.name}
            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
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
            label="Image URL"
            value={newMember.image}
            onChange={(e) => setNewMember({...newMember, image: e.target.value})}
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
          onClick={handleAddMember} 
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddMemberDialog; 