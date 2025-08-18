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
import { Member } from '../../models/Member';

function AddMemberDialog({ open, onClose }) {
  const theme = useTheme();
  const { fetchMembers } = useMembers();
  
  const [memberName, setMemberName] = useState('');

  const handleAddMember = async () => {
    if (memberName.trim()) {
      try {
        await Member.create(memberName.trim());
        await fetchMembers(); // Refresh the members list
        setMemberName('');
        onClose();
      } catch (err) {
        console.error('Failed to create member:', err);
      }
    }
  };

  const handleClose = () => {
    setMemberName('');
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
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
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