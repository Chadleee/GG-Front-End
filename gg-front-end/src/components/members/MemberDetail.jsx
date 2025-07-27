import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMembers } from '../../contexts/MemberContext';
import { useCharacters } from '../../contexts/CharacterContext';
import { useUser } from '../../contexts/UserContext';
import MemberBio from './MemberBio';
import MemberCharacters from './MemberCharacters';
import MemberProfileCard from './MemberProfileCard';
import ClipsCarousel from '../../shared/ClipsCarousel';
import GalleryCarousel from '../../shared/GalleryCarousel';

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
  const canEdit = user?.id.toString() === member?.id.toString();
  const canDelete = user?.role === 'admin';

  useEffect(() => {
    const memberData = getMemberById(id);
    if (memberData) {
      setMember(memberData);
      
      // Get characters for this member
      const characters = getCharactersByMemberId(parseInt(id));
      setMemberCharacters(characters);
    }
    setLoading(false);
  }, [id, getMemberById, getCharactersByMemberId]);

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
          <MemberProfileCard 
            member={member}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
          <MemberBio 
            member={member}
            canEdit={canEdit}
            onMemberUpdate={setMember}
          />
        </Grid>
      </Grid>

      <MemberCharacters 
        memberCharacters={memberCharacters}
        theme={theme}
      />

      {/* Member Clips - Full Width */}
      <Box sx={{ mt: 4 }}>
        <ClipsCarousel 
          title={`${member.displayName || member.name}'s Clips`}
          clips={member.clips || []}
          defaultExpanded={false}
          collapsible={true}
        />
      </Box>

      {/* Member Gallery - Full Width */}
      <Box sx={{ mt: 4 }}>
        <GalleryCarousel 
          title={`${member.displayName || member.name}'s Gallery`}
          gallery={member.gallery || []}
          defaultExpanded={false}
          collapsible={true}
        />
      </Box>

    </Box>
  );
}

export default MemberDetail; 