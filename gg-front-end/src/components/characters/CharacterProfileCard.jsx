import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  useTheme,
  Divider,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../../contexts/MemberContext';
import { useCharacters } from '../../contexts/CharacterContext';
import { useChangeRequests } from '../../contexts/ChangeRequestContext';
import { getPendingChanges, formatValue, compareArrays, getArrayChangeText, aggregateArrayChanges } from '../../utils/changeDetection';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useState } from 'react';
import Portrait from '../Portrait';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';
import { seasons } from '../../shared/lists/seasons';

function CharacterProfileCard({ character, canEdit = false, onCharacterUpdate }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { members } = useMembers();
  const { updateCharacter } = useCharacters();
  const { getChangeRequestsByCharacterId } = useChangeRequests();
  const [editingMemberId, setEditingMemberId] = useState(false);
  const [memberIdValue, setMemberIdValue] = useState(character.memberId);
  const [affiliationsDialogOpen, setAffiliationsDialogOpen] = useState(false);
  const [editedAffiliations, setEditedAffiliations] = useState(character.affiliations || []);
  const [newAffiliation, setNewAffiliation] = useState('');
  const [seasonsDialogOpen, setSeasonsDialogOpen] = useState(false);
  const [editedSeasons, setEditedSeasons] = useState(character.seasons || []);
  const [showMemberIdChanges, setShowMemberIdChanges] = useState(false);
  const [showAffiliationsChanges, setShowAffiliationsChanges] = useState(false);
  const [showSeasonsChanges, setShowSeasonsChanges] = useState(false);

  // Get pending changes for this character
  const memberIdPendingChanges = (() => {
    if (!character?.id) return [];
    const requests = getChangeRequestsByCharacterId(character.id);
    return getPendingChanges(requests, 'character', character.id, 'memberId');
  })();
  const affiliationsPendingChanges = (() => {
    if (!character?.id) return [];
    const requests = getChangeRequestsByCharacterId(character.id);
    return getPendingChanges(requests, 'character', character.id, 'affiliations');
  })();
  const seasonsPendingChanges = (() => {
    if (!character?.id) return [];
    const requests = getChangeRequestsByCharacterId(character.id);
    return getPendingChanges(requests, 'character', character.id, 'seasons');
  })();

  // Aggregate all pending changes for arrays
  const affiliationsArrayChanges = affiliationsPendingChanges.length > 0 ? aggregateArrayChanges(affiliationsPendingChanges) : null;
  const latestSeasonsChange = seasonsPendingChanges.length > 0 ? seasonsPendingChanges[seasonsPendingChanges.length - 1] : null;
  const seasonsArrayChanges = latestSeasonsChange ? compareArrays(latestSeasonsChange.oldValue, latestSeasonsChange.newValue) : null;

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

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id == memberId);
    return member ? member.name : 'Unknown Member';
  };

  const handleEditMemberId = () => {
    setEditingMemberId(true);
    setMemberIdValue(character.memberId);
  };

  const handleSaveMemberId = async () => {
    try {
      const updatedCharacter = { ...character, memberId: memberIdValue };
      await updateCharacter(character.id, updatedCharacter);
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacter);
      }
      setEditingMemberId(false);
    } catch (error) {
      console.error('Failed to update character member ID:', error);
    }
  };

  const handleCancelMemberId = () => {
    setEditingMemberId(false);
    setMemberIdValue(character.memberId);
  };

  const handleEditAffiliations = () => {
    setAffiliationsDialogOpen(true);
    setEditedAffiliations(character.affiliations || []);
  };

  const handleCloseAffiliationsDialog = () => {
    setAffiliationsDialogOpen(false);
    setEditedAffiliations(character.affiliations || []);
    setNewAffiliation('');
  };

  const handleSaveAffiliations = async () => {
    try {
      const updatedCharacter = { ...character, affiliations: editedAffiliations };
      await updateCharacter(character.id, updatedCharacter);
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacter);
      }
      setAffiliationsDialogOpen(false);
    } catch (error) {
      console.error('Failed to update character affiliations:', error);
    }
  };

  const handleAddAffiliation = () => {
    if (newAffiliation.trim() && !editedAffiliations.includes(newAffiliation.trim())) {
      setEditedAffiliations([...editedAffiliations, newAffiliation.trim()]);
      setNewAffiliation('');
    }
  };

  const handleRemoveAffiliation = (index) => {
    setEditedAffiliations(editedAffiliations.filter((_, i) => i !== index));
  };

  // Seasons handlers
  const handleEditSeasons = () => {
    setSeasonsDialogOpen(true);
    setEditedSeasons(character.seasons || []);
  };

  const handleCloseSeasonsDialog = () => {
    setSeasonsDialogOpen(false);
    setEditedSeasons(character.seasons || []);
  };

  const handleSaveSeasons = async () => {
    try {
      const updatedCharacter = { ...character, seasons: editedSeasons };
      await updateCharacter(character.id, updatedCharacter);
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacter);
      }
      setSeasonsDialogOpen(false);
    } catch (error) {
      console.error('Failed to update character seasons:', error);
    }
  };

  const handleSeasonToggle = (season) => {
    const updatedSeasons = editedSeasons.includes(season)
      ? editedSeasons.filter(s => s !== season)
      : [...editedSeasons, season];
    setEditedSeasons(updatedSeasons);
  };

  const renderMemberIdPendingChanges = () => {
    if (memberIdPendingChanges.length === 0) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          onClick={() => setShowMemberIdChanges(!showMemberIdChanges)}
          startIcon={<ExpandMoreIcon sx={{
            transform: showMemberIdChanges ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />}
          sx={{
            color: theme.palette.warning.main,
            textTransform: 'none',
            p: 0,
            minWidth: 'auto'
          }}
        >
          Pending Changes ({memberIdPendingChanges.length})
        </Button>

        <Collapse in={showMemberIdChanges}>
          <Box sx={{
            mt: 1,
            p: 1,
            backgroundColor: '#3d2c02',
            border: `1px solid ${theme.palette.warning.main}`,
            borderRadius: 1
          }}>
            {memberIdPendingChanges.map((change, index) => (
              <Box key={change.id || index} sx={{ mb: index < memberIdPendingChanges.length - 1 ? 1 : 0 }}>
                <Typography variant="body2" sx={{ color: '#3d2c02', fontWeight: 'medium' }}>
                  {formatValue(change.newValue)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  const renderAffiliationsPendingChanges = () => {
    if (affiliationsPendingChanges.length === 0 || !affiliationsArrayChanges) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          onClick={() => setShowAffiliationsChanges(!showAffiliationsChanges)}
          startIcon={<ExpandMoreIcon sx={{
            transform: showAffiliationsChanges ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />}
          sx={{
            color: theme.palette.warning.main,
            textTransform: 'none',
            p: 0,
            minWidth: 'auto'
          }}
        >
          Pending Changes: {getArrayChangeText(affiliationsArrayChanges)}
        </Button>
        
        <Collapse in={showAffiliationsChanges}>
          <Box sx={{
            mt: 1,
            p: 1,
            backgroundColor: '#3d2c02',
            border: `1px solid ${theme.palette.warning.main}`,
            borderRadius: 1
          }}>
            {affiliationsArrayChanges.added.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#3d2c02', mb: 1 }}>
                  Added ({affiliationsArrayChanges.added.length}):
                </Typography>
                {affiliationsArrayChanges.added.map((affiliation, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5, color: '#3d2c02' }}>
                    • {affiliation}
                  </Typography>
                ))}
              </Box>
            )}
            
            {affiliationsArrayChanges.removed.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#3d2c02', mb: 1 }}>
                  Removed ({affiliationsArrayChanges.removed.length}):
                </Typography>
                {affiliationsArrayChanges.removed.map((affiliation, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5, textDecoration: 'line-through', color: '#3d2c02' }}>
                    • {affiliation}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  };

  const renderSeasonsPendingChanges = () => {
    if (seasonsPendingChanges.length === 0 || !seasonsArrayChanges) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          onClick={() => setShowSeasonsChanges(!showSeasonsChanges)}
          startIcon={<ExpandMoreIcon sx={{
            transform: showSeasonsChanges ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />}
          sx={{
            color: theme.palette.warning.main,
            textTransform: 'none',
            p: 0,
            minWidth: 'auto'
          }}
        >
          Pending Changes: {getArrayChangeText(seasonsArrayChanges)}
        </Button>
        
        <Collapse in={showSeasonsChanges}>
          <Box sx={{
            mt: 1,
            p: 1,
            backgroundColor: '#3d2c02',
            border: `1px solid ${theme.palette.warning.main}`,
            borderRadius: 1
          }}>
            {seasonsArrayChanges.added.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#3d2c02', mb: 1 }}>
                  Added ({seasonsArrayChanges.added.length}):
                </Typography>
                {seasonsArrayChanges.added.map((season, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5, color: '#3d2c02' }}>
                    • {season}
                  </Typography>
                ))}
              </Box>
            )}
            
            {seasonsArrayChanges.removed.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#3d2c02', mb: 1 }}>
                  Removed ({seasonsArrayChanges.removed.length}):
                </Typography>
                {seasonsArrayChanges.removed.map((season, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5, textDecoration: 'line-through', color: '#3d2c02' }}>
                    • {season}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <Card 
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ my: 2, p: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Portrait 
              src={getCharacterImage(character.name, character.image)}
              alt={character.name}
              size={160}
            />
          </Box>
          <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
          <Box sx={{ 
            mx: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1, 
            justifyContent: 'flex-start',
            minHeight: '40px'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary,
                fontSize: '1.2rem'
              }}
            >
              Played by:
            </Typography>
            {editingMemberId ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                maxWidth: '100%'
              }}>
                <FormControl size="small" sx={{ 
                  minWidth: 150,
                  maxWidth: 'calc(100% - 100px)', // More space for buttons
                  flex: 1
                }}>
                  <Select
                    value={memberIdValue}
                    onChange={(e) => setMemberIdValue(e.target.value)}
                    sx={{
                      color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'light' ? '#888888' : '#333333',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'light' ? '#ffffff' : '#666666',
                      },
                      '& .MuiSelect-icon': {
                        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
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
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                  <IconButton
                    size="small"
                    onClick={handleSaveMemberId}
                    sx={{ 
                      color: 'success.main',
                      '&:hover': {
                        backgroundColor: 'success.main',
                        color: 'white',
                      }
                    }}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleCancelMemberId}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.main',
                        color: 'white',
                      }
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    '&:hover': {
                      opacity: 0.8,
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => navigate(`/members/${character.memberId}`)}
                >
                  {getMemberName(character.memberId)}
                </Typography>
                {canEdit && (
                  <IconButton
                    size="small"
                    onClick={handleEditMemberId}
                    sx={{ 
                      color: memberIdPendingChanges.length > 0 ? theme.palette.warning.main : (theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary),
                      '&:hover': {
                        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )}
            {renderMemberIdPendingChanges()}
          </Box>
          <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
          <Box sx={{ mx: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                Affiliations:
              </Typography>
              {canEdit && (
                <IconButton
                  size="small"
                  onClick={handleEditAffiliations}
                  sx={{ 
                    color: affiliationsPendingChanges.length > 0 ? theme.palette.warning.main : (theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary),
                    '&:hover': {
                      color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            {character.affiliations && character.affiliations
              .sort((a, b) => a.localeCompare(b))
              .map((affiliation) => (
              <Chip 
                key={affiliation}
                label={affiliation}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/search?q=${encodeURIComponent(affiliation)}`);
                }}
                sx={{ 
                  alignSelf: 'flex-start',
                  backgroundColor: '#d3d3d3',
                  color: '#000000',
                  fontSize: '1.1rem',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#b0b0b0',
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              />
            ))}
            {renderAffiliationsPendingChanges()}
          </Box>
          
          <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
          <Box sx={{ mx: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                Seasons:
              </Typography>
              {canEdit && (
                <IconButton
                  size="small"
                  onClick={handleEditSeasons}
                  sx={{ 
                    color: seasonsPendingChanges.length > 0 ? theme.palette.warning.main : (theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary),
                    '&:hover': {
                      color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            {character.seasons && character.seasons.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {character.seasons
                  .sort((a, b) => a.localeCompare(b))
                  .map((season) => (
                  <Chip 
                    key={season}
                    label={season}
                    sx={{ 
                      backgroundColor: '#d3d3d3',
                      color: '#000000',
                      fontSize: '1.1rem',
                      padding: '8px 16px'
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ 
                color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : theme.palette.text.secondary,
                fontStyle: 'italic'
              }}>
                No seasons assigned
              </Typography>
            )}
            {renderSeasonsPendingChanges()}
          </Box>
          

        </Box>
      </CardContent>

      {/* Affiliations Edit Dialog */}
      <Dialog
        open={affiliationsDialogOpen}
        onClose={handleCloseAffiliationsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Affiliations
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Add new affiliation:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={newAffiliation}
                onChange={(e) => setNewAffiliation(e.target.value)}
                placeholder="Enter affiliation name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddAffiliation();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddAffiliation}
                disabled={!newAffiliation.trim()}
              >
                Add
              </Button>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            Current affiliations:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {editedAffiliations
              .sort((a, b) => a.localeCompare(b))
              .map((affiliation, index) => (
              <Chip
                key={index}
                label={affiliation}
                onDelete={() => handleRemoveAffiliation(index)}
                sx={{
                  backgroundColor: '#d3d3d3',
                  color: '#000000',
                  '& .MuiChip-deleteIcon': {
                    color: '#666666',
                    '&:hover': {
                      color: '#000000',
                    }
                  }
                }}
              />
            ))}
            {editedAffiliations.length === 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                No affiliations added yet
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAffiliationsDialog}>
            Cancel
          </Button>
          <Button onClick={handleSaveAffiliations} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Seasons Edit Dialog */}
      <Dialog
        open={seasonsDialogOpen}
        onClose={handleCloseSeasonsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Seasons
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {seasons.map((season) => (
              <FormControlLabel
                key={season}
                control={
                  <Checkbox
                    checked={editedSeasons.includes(season)}
                    onChange={() => handleSeasonToggle(season)}
                    sx={{
                      color: theme.palette.mode === 'light' ? '#888888' : '#666666',
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={season}
                sx={{
                  color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '1rem',
                  },
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSeasonsDialog}>
            Cancel
          </Button>
          <Button onClick={handleSaveSeasons} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default CharacterProfileCard; 