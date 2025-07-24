import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Button, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMembers } from '../../contexts/MemberContext';
import { useCharacters } from '../../contexts/CharacterContext';
import CharacterCard from '../characters/CharacterCard';

function MemberDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMemberById, updateMember, deleteMember } = useMembers();
  const { getCharactersByMemberId } = useCharacters();
  
  const [member, setMember] = useState(null);
  const [memberCharacters, setMemberCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    avatar: ''
  });

  useEffect(() => {
    const memberData = getMemberById(parseInt(id));
    if (memberData) {
      setMember(memberData);
      setEditForm({
        name: memberData.name,
        avatar: memberData.avatar
      });
      
      // Get characters for this member
      const characters = getCharactersByMemberId(parseInt(id));
      setMemberCharacters(characters);
    }
    setLoading(false);
  }, [id, getMemberById, getCharactersByMemberId]);

  const handleEdit = async () => {
    if (editForm.name) {
      try {
        const updatedMember = {
          ...member,
          name: editForm.name,
          avatar: editForm.avatar
        };
        
        await updateMember(member.id, updatedMember);
        setMember(updatedMember);
        setEditDialog(false);
      } catch (err) {
        console.error('Failed to update member:', err);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(member.id);
      navigate('/members');
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading member...</Typography>
      </Box>
    );
  }

  if (!member) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography color="error">Member not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/members')}
          sx={{ mr: 2, color: theme.palette.primary.main }}
        >
          Back to Members
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Member Details
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

      {/* Member Details */}
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
                  src={member.avatar} 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    border: `3px solid ${theme.palette.primary.main}`
                  }}
                />
                <Typography variant="h4" component="h2" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }} gutterBottom>
                  {member.name}
                </Typography>
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
                Member Information
              </Typography>
              


              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Join Date
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
                  {member.joinDate}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Characters Played
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
                  {memberCharacters.length} character{memberCharacters.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Member's Characters */}
      {memberCharacters.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom color="text.primary">
            {member.name}'s Characters
          </Typography>
          <Grid container spacing={3}>
            {memberCharacters.map((character) => (
              <Grid item xs={12} sm={6} md={4} key={character.id}>
                <CharacterCard character={character} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

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
          Edit Member
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Member Name"
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

export default MemberDetail; 