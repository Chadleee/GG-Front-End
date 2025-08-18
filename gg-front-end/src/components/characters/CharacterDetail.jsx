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
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import Grid from '@mui/material/Grid';
import { useUser } from '../../contexts/UserContext';
import CharacterDescription from './CharacterDescription';
import CharacterBackstory from './CharacterBackstory';
import CharacterQuotes from './CharacterQuotes';
import CharacterProfileCard from './CharacterProfileCard';
import CharacterRelationships from './CharacterRelationships';
import ClipsCarousel from '../shared/ClipsCarousel';
import GalleryCarousel from '../shared/GalleryCarousel';
import AvatarInfo from './AvatarInfo';
import AvatarEditDialog from './AvatarEditDialog';
import ExpandableCard from '../shared/ExpandableCard';
import { useChangeRequests } from '../../contexts/ChangeRequestContext';
import characterAPI from '../../api/characters';
import { getPendingChanges, formatValue } from '../../utils/changeDetection';
import { Collapse, Chip } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

function CharacterDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacterById, deleteCharacter, fetchCharacters } = useCharacters();
  const { user } = useUser();
  
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [avatarEditDialogOpen, setAvatarEditDialogOpen] = useState(false);
  const [showAvatarChanges, setShowAvatarChanges] = useState(false);
  const canEdit = user?.id.toString() === character?.memberId.toString() || user?.role === 'admin';
  const canDelete = user?.role === 'admin';
  
  // Check if there are pending changes for this character
  const { getChangeRequestsByCharacterId } = useChangeRequests();
  const hasPendingChanges = (() => {
    if (!character?.id) return false;
    const requests = getChangeRequestsByCharacterId(character.id);
    return requests.filter(req => req.status === 'pending').length > 0;
  })();

  // Get pending changes for avatar info
  const avatarPendingChanges = (() => {
    if (!character?.id) return [];
    const requests = getChangeRequestsByCharacterId(character.id);
    return getPendingChanges(requests, 'character', character.id, 'avatarInfo');
  })();


  useEffect(() => {
    const characterData = getCharacterById(id);
    if (characterData) {
      setCharacter(characterData);
    }
    setLoading(false);
  }, [id, getCharacterById]);





  const handleDelete = async () => {
    try {
      await deleteCharacter(character.id);
      navigate('/characters');
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setDeleteConfirmation('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.toLowerCase() === 'delete character') {
      setDeleteDialogOpen(false);
      setDeleteConfirmation('');
      await handleDelete();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteConfirmation('');
  };

  const renderAvatarPendingChanges = () => {
    if (avatarPendingChanges.length === 0) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          onClick={() => setShowAvatarChanges(!showAvatarChanges)}
          startIcon={<ExpandMoreIcon sx={{
            transform: showAvatarChanges ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />}
          sx={{
            color: theme.palette.warning.main,
            textTransform: 'none',
            p: 0,
            minWidth: 'auto'
          }}
        >
          Pending Changes ({avatarPendingChanges.length})
        </Button>

        <Collapse in={showAvatarChanges}>
          <Box sx={{
            mt: 1,
            p: 1,
            backgroundColor: '#3d2c02',
            border: `1px solid ${theme.palette.warning.main}`,
            borderRadius: 1
          }}>
                         {avatarPendingChanges.map((change, index) => (
               <Box key={change.id || index} sx={{ mb: index < avatarPendingChanges.length - 1 ? 1 : 0 }}>
                 <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                   {formatValue(change.newValue)}
                 </Typography>
               </Box>
             ))}
          </Box>
        </Collapse>
      </Box>
    );
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
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, ml: 2 }}>
            {character.name}
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
            onClick={() => navigate('/characters')}
            sx={{ color: theme.palette.primary.main }}
          >
            Back to Characters
          </Button>
        </Box>
      </Box>

      {/* Character Details */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CharacterProfileCard 
            character={character} 
            canEdit={canEdit}
            onCharacterUpdate={setCharacter}
          />
        </Grid>
        
        {/* Character Description and Backstory */}
        <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
          <CharacterDescription 
            character={character}
            canEdit={canEdit}
            onCharacterUpdate={setCharacter}
          />
          
          <Box sx={{ mt: 2 }}>
            <CharacterBackstory 
              character={character}
              canEdit={canEdit}
              onCharacterUpdate={setCharacter}
            />
          </Box>
        </Grid>
        
        {/* Character Quotes - Full Width */}
        <Grid size={{ xs: 12 }}>
          <CharacterQuotes 
            character={character}
            canEdit={canEdit}
            onCharacterUpdate={setCharacter}
          />
        </Grid>
        
        {/* Avatar Info - Full Width */}
        <Grid size={{ xs: 12 }}>
          <ExpandableCard 
            title="Avatar Info"
            defaultExpanded={false}
            collapsible={true}
            headerActions={
              canEdit ? (
                <Button 
                  startIcon={<EditIcon />}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent header click when clicking edit button
                    setAvatarEditDialogOpen(true);
                  }}
                  sx={{ 
                    mr: 0, 
                    color: avatarPendingChanges.length > 0 ? '#FFD700' : (theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary),
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                    }
                  }}
                >
                  Edit
                </Button>
              ) : null
            }
          >
            <AvatarInfo character={character} />
            {renderAvatarPendingChanges()}
          </ExpandableCard>
        </Grid>
        
        {/* Character Relationships - Full Width */}
        <Grid size={{ xs: 12 }}>
          <CharacterRelationships 
            character={character}
            theme={theme}
            canEdit={canEdit}
            onCharacterUpdate={setCharacter}
          />
        </Grid>


        
        {/* Character Clips - Full Width */}
        <Grid size={{ xs: 12 }}>
          <ClipsCarousel 
            title={`${character.name}'s Clips`}
            clips={character.clips || []}
            defaultExpanded={false}
            collapsible={true}
            seeAllUrl={`/characters/${character.id}/videos`}
            canEdit={canEdit}
            entityType="character"
            entityId={character.id}
            onClipsUpdate={async (updatedClips) => {
              try {
                await character.update(updatedClips, 'clips');
                await fetchCharacters();
                const updatedCharacter = getCharacterById(character.id);
                setCharacter(updatedCharacter);
              } catch (error) {
                console.error('Failed to update character clips:', error);
                // You might want to show an error message to the user here
              }
            }}
          />
        </Grid>
        
        {/* Character Gallery - Full Width */}
        <Grid size={{ xs: 12 }}>
          <GalleryCarousel 
            title={`${character.name}'s Gallery`}
            gallery={character.gallery || []}
            defaultExpanded={false}
            collapsible={true}
            seeAllUrl={`/characters/${character.id}/galleries`}
            canEdit={canEdit}
            entityType="character"
            entityId={character.id}
            onGalleryUpdate={async (updatedGallery) => {
              try {
                await character.update(updatedGallery, 'gallery');
                await fetchCharacters();
                const updatedCharacter = getCharacterById(character.id);
                setCharacter(updatedCharacter);
              } catch (error) {
                console.error('Failed to update character gallery:', error);
                // You might want to show an error message to the user here
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Avatar Edit Dialog */}
      <AvatarEditDialog
        open={avatarEditDialogOpen}
        onClose={() => setAvatarEditDialogOpen(false)}
        avatarData={{
          avatarName: character.avatarName,
          avatarDescription: character.avatarDescription,
          avatarUrl: character.avatarUrl,
          avatarReferenceImage: character.avatarReferenceImage
        }}
        onSave={async (updatedAvatar) => {
          try {
            await character.update(updatedAvatar, 'avatarInfo');
            await fetchCharacters();
            const updatedCharacter = getCharacterById(character.id);
            setCharacter(updatedCharacter);
            setAvatarEditDialogOpen(false);
          } catch (error) {
            console.error('Failed to update character avatar:', error);
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Character
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete "{character.name}"? This action cannot be undone.
          </Typography>
          <Typography sx={{ mb: 1 }}>
            To confirm deletion, please type "delete character" below:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type 'delete character' to confirm"
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
            disabled={deleteConfirmation.toLowerCase() !== 'delete character'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default CharacterDetail; 