import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMembers } from '../../contexts/MemberContext';
import { useCharacters } from '../../contexts/CharacterContext';
import { useUser } from '../../contexts/UserContext';
import MemberBio from './MemberBio';
import MemberCharacters from './MemberCharacters';
import MemberProfileCard from './MemberProfileCard';
import ClipsCarousel from '../shared/ClipsCarousel';
import GalleryCarousel from '../shared/GalleryCarousel';
import { useChangeRequests } from '../../contexts/ChangeRequestContext';


function MemberDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMemberById, updateMember, deleteMember, updateMemberSocials, fetchMembers } = useMembers();
  const { getCharactersByMemberId } = useCharacters();
  const { user } = useUser();

  const [member, setMember] = useState(null);
  const [memberCharacters, setMemberCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const canEdit = user?.id.toString() === member?.id.toString() || user?.role === 'admin';
  const canDelete = user?.role === 'admin';
  
  // Check if there are pending changes for this member
  const { getChangeRequestsByMemberId } = useChangeRequests();
  const hasPendingChanges = (() => {
    if (!member?.id) return false;
    const requests = getChangeRequestsByMemberId(member.id);
    return requests.filter(req => req.status === 'pending').length > 0;
  })();

  useEffect(() => {
    const memberData = getMemberById(id);
    if (memberData) {
      setMember(memberData);
      
      // Get characters for this member
      const characters = getCharactersByMemberId(id);
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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setDeleteConfirmation('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.toLowerCase() === 'delete member') {
      setDeleteDialogOpen(false);
      setDeleteConfirmation('');
      await handleDelete();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteConfirmation('');
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
            onClick={handleDeleteClick}
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
            canEdit={canEdit}
            onSocialsUpdate={async (updatedSocials) => {
              try {
                await member.update(updatedSocials, 'socials');
                await fetchMembers();
                const updatedMember = getMemberById(member.id);
                setMember(updatedMember);
              } catch (error) {
                console.error('Failed to update member socials:', error);
                // You might want to show an error message to the user here
              }
            }}
            onJoinDateUpdate={async (updatedJoinDate) => {
              try {
                await member.update(updatedJoinDate, 'joinDate');
                await fetchMembers();
                const updatedMember = getMemberById(member.id);
                setMember(updatedMember);
              } catch (error) {
                console.error('Failed to update member join date:', error);
                // You might want to show an error message to the user here
              }
            }}
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
          seeAllUrl={`/members/${member.id}/videos`}
          canEdit={canEdit}
          entityType="member"
          entityId={member.id}
          onClipsUpdate={async (updatedClips) => {
            try {
              await member.update(updatedClips, 'clips');
              await fetchMembers();
              const updatedMember = getMemberById(member.id);
              setMember(updatedMember);
            } catch (error) {
              console.error('Failed to update member clips:', error);
              // You might want to show an error message to the user here
            }
          }}
        />
      </Box>

      {/* Member Gallery - Full Width */}
      <Box sx={{ mt: 4 }}>
        <GalleryCarousel 
          title={`${member.displayName || member.name}'s Gallery`}
          gallery={member.gallery || []}
          defaultExpanded={false}
          collapsible={true}
          seeAllUrl={`/members/${member.id}/galleries`}
          canEdit={canEdit}
          entityType="member"
          entityId={member.id}
          onGalleryUpdate={async (updatedGallery) => {
            try {
              await member.update(updatedGallery, 'gallery');
              await fetchMembers();
              const updatedMember = getMemberById(member.id);
              setMember(updatedMember);
            } catch (error) {
              console.error('Failed to update member gallery:', error);
              // You might want to show an error message to the user here
            }
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Member
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete "{member.displayName || member.name}"? This action cannot be undone.
          </Typography>
          <Typography sx={{ mb: 1 }}>
            To confirm deletion, please type "delete member" below:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type 'delete member' to confirm"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteConfirmation.toLowerCase() !== 'delete member'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default MemberDetail; 