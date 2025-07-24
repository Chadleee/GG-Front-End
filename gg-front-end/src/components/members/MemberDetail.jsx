import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMembers } from '../../contexts/MemberContext';
import { useCharacters } from '../../contexts/CharacterContext';
import CharacterCard from '../characters/CharacterCard';
import Portrait from '../Portrait';

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
    image: ''
  });

  useEffect(() => {
    const memberData = getMemberById(parseInt(id));
    if (memberData) {
      setMember(memberData);
      setEditForm({
        name: memberData.name,
        image: memberData.image
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
          image: editForm.image
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
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'right', mb: 2, justifyContent: 'right' }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/members')}
          sx={{ color: theme.palette.primary.main }}
        >
          Back to Members
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {member.displayName || member.name}
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
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Card 
            sx={{
              backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Portrait 
                  src={member.image}
                  alt={member.name}
                  size={120}
                />
              </Box>

              <Box sx={{ mb: 1, display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'row' }}>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Join Date:
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
                  {member.joinDate}
                </Typography>
              </Box>

              <Box sx={{ mb: 1, display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'row' }}>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Characters Played:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'column' }}>
                  {memberCharacters.map((character) => (
                    <Typography
                      key={character.id}
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
                      onClick={() => navigate(`/characters/${character.id}`)}
                    >
                      {character.name}
                    </Typography>
                  ))}
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Member's Characters */}
      {memberCharacters.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom color="text.primary">
            {member.displayName || member.name}'s Characters
          </Typography>
          <Grid spacing={3}>
            {memberCharacters.map((character) => (
              <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4 }}>
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

export default MemberDetail; 