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
  useTheme,
  Tooltip,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMembers } from '../../contexts/MemberContext';
import { useCharacters } from '../../contexts/CharacterContext';
import CharacterCard from '../characters/CharacterCard';
import Portrait from '../Portrait';
import { useUser } from '../../contexts/UserContext';
import EditableExpandableCard from '../../shared/editableComponents/EditableExpandableCard';
import twitter_logo from '../../assets/twitter_logo.png';
import youtube_logo from '../../assets/youtube_logo.png';
import tiktok_logo from '../../assets/tiktok_logo.png';
import kick_logo from '../../assets/kick_logo.png';
import discord_logo from '../../assets/discord_logo.png';
import instagram_logo from '../../assets/instagram_logo.png';
import twitch_logo from '../../assets/twitch_logo.png';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';

function MemberDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMemberById, updateMember, deleteMember } = useMembers();
  const { getCharactersByMemberId } = useCharacters();
  const { user } = useUser();

  const [member, setMember] = useState(null);
  const [memberCharacters, setMemberCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    image: ''
  });
  const canEdit = user?.id.toString() === member?.id.toString();
  const canDelete = user?.role === 'admin';



  useEffect(() => {
    const memberData = getMemberById(id);
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

  const handleBioUpdate = async (newBio) => {
    try {
      const updatedMember = {
        ...member,
        bio: newBio
      };
      
      await updateMember(member.id, updatedMember);
      setMember(updatedMember);
    } catch (err) {
      console.error('Failed to update member bio:', err);
    }
  };

  const getSocialLogo = (socialName) => {
    switch (socialName) {
      case 'Twitter':
        return twitter_logo;
      case 'X':
        return twitter_logo;
      case 'YouTube VODs':
        return youtube_logo;
      case 'YouTube Archives':
        return youtube_logo;
      case 'YouTube':
        return youtube_logo;
      case 'TikTok':
        return tiktok_logo;
      case 'Kick':
        return kick_logo;
      case 'Discord':
        return discord_logo;
      case 'Instagram':
        return instagram_logo;
      case 'Twitch':
        return twitch_logo;
      default:
        return null;
    }
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, ml: 2 }}>
            {member.displayName || member.name}
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
            onClick={() => navigate('/members')}
            sx={{ color: theme.palette.primary.main }}
          >
            Back to Members
          </Button>
        </Box>
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
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Portrait 
                  src={member.image}
                  alt={member.name}
                  size={160}
                />
              </Box>
              <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF' }} />
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', m: 2 }}>
                <Grid container spacing={2}>
                  {member.socials.map((social) => (
                    <Grid size={{ xs: 3 }} key={social.id}>
                      <Tooltip title={social.platform}>
                        <Box component="img" src={getSocialLogo(social.platform)} sx={{ width: 30, height: 30, mx: 1, cursor: 'pointer', borderRadius: '20%' }} onClick={() => window.open(social.url, '_blank')} />
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF' }} />
              <Box sx={{ m: 2, display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'row' }}>
                <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Join Date:
                </Typography>
                <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
                  {member.joinDate}
                </Typography>
              </Box>
              <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF' }} />
              <Box sx={{ m: 2, display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Characters Played:
                </Typography>
                  {memberCharacters.map((character) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', my: 1, textDecoration: 'underline', cursor: 'pointer' }} key={character.id} onClick={() => navigate(`/characters/${character.id}`)}>
                        <Avatar 
                          src={getCharacterImage(character.name, character.image)} 
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            mr: 2,
                            border: `2px solid ${theme.palette.primary.main}`
                          }}
                        />
                        <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                          {character.displayName || character.name}
                        </Typography>
                      </Box>
                  ))}
              </Box>

            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
          <EditableExpandableCard 
            title="Bio"
            value={member.bio}
            onSave={handleBioUpdate}
            entityType="member"
            entityId={member.id}
            fieldType="bio"
            placeholder="Enter member bio..."
            defaultExpanded={true}
            canEdit={canEdit}
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