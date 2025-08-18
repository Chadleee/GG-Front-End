import { useState } from 'react';
import { Box, Typography, IconButton, Button, Collapse, useTheme, Card, CardContent } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import { useChangeRequests } from '../../contexts/ChangeRequestContext';
import { getPendingChanges, compareArrays, getArrayChangeText } from '../../utils/changeDetection';
import MuiRichTextEditor from '../shared/editableComponents/MuiRichTextEditor';

function CharacterQuotes({ character, canEdit, onCharacterUpdate }) {
  const { updateCharacter } = useCharacters();
  const { getChangeRequestsByCharacterId } = useChangeRequests();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showPendingChanges, setShowPendingChanges] = useState(false);

  // Get pending changes for quotes
  const quotesPendingChanges = (() => {
    if (!character?.id) return [];
    const requests = getChangeRequestsByCharacterId(character.id);
    return getPendingChanges(requests, 'character', character.id, 'quotes');
  })();

  // Get the latest change request for quotes
  const latestQuotesChange = quotesPendingChanges.length > 0 ? quotesPendingChanges[quotesPendingChanges.length - 1] : null;
  const quotesArrayChanges = latestQuotesChange ? compareArrays(latestQuotesChange.oldValue, latestQuotesChange.newValue) : null;
  const hasPendingChanges = quotesArrayChanges ? (quotesArrayChanges.added.length > 0 || quotesArrayChanges.removed.length > 0 || quotesArrayChanges.modified.length > 0) : false;

  const handleQuotesUpdate = async (newQuotes) => {
    try {
      // Parse the new quotes string into an array
      const quotesArray = newQuotes.split('\n').filter(quote => quote.trim() !== '');
      
      const updatedCharacter = {
        ...character,
        quotes: quotesArray
      };
      
      await updateCharacter(character.id, updatedCharacter);
      onCharacterUpdate(updatedCharacter);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update character quotes:', err);
    }
  };

  const handleEdit = () => {
    const quotesString = character.quotes ? character.quotes.join('\n') : '';
    setEditValue(quotesString);
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    handleQuotesUpdate(editValue);
  };

  // Convert quotes array to string for editing
  const quotesString = character.quotes ? character.quotes.join('\n') : '';
  
  // Check if there are any changes
  const hasChanges = editValue !== quotesString;

  return (
    <Card 
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
      }}
    >
      <CardContent>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: isEditing ? 'default' : 'pointer',
            '&:hover': isEditing ? {} : {
              backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            },
            borderRadius: 1,
            p: 0.5,
            transition: 'background-color 0.2s ease-in-out'
          }}
          onClick={isEditing ? undefined : () => setIsExpanded(!isExpanded)}
        >
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              flex: 1
            }}
          >
            Quotes
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {canEdit && !isEditing && (
              <Button
                startIcon={<EditIcon />}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent header click when clicking edit button
                  handleEdit();
                }}
                sx={{
                  color: hasPendingChanges ? theme.palette.warning.main : (theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary),
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                  }
                }}
              >
                Edit
              </Button>
            )}
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent header click when clicking the icon
                if (!isEditing) {
                  setIsExpanded(!isExpanded);
                }
              }}
              disabled={isEditing}
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease-in-out',
                color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                opacity: isEditing ? 0.5 : 1,
                cursor: isEditing ? 'not-allowed' : 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                }
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ 
            borderTop: `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
            pt: 2 
          }}>
          {isEditing ? (
            <Box>
              <MuiRichTextEditor
                value={editValue}
                onChange={(newValue) => setEditValue(newValue)}
                placeholder="Enter character quotes (one per line)..."
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  onClick={handleCancel}
                  sx={{ 
                    backgroundColor: '#d32f2f',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#b71c1c',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                    },
                    '&:disabled': {
                      backgroundColor: '#9e9e9e',
                    }
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {!character.quotes || character.quotes.length === 0 ? (
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                  No quotes available.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {character.quotes.map((quote, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography 
                        component="span" 
                        sx={{ 
                          fontSize: '1.2rem', 
                          lineHeight: 1,
                          color: 'inherit',
                          mt: 0.5
                        }}
                      >
                        •
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontStyle: 'italic',
                          flex: 1
                        }}
                      >
                        "{quote}"
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Pending Changes Display */}
              {hasPendingChanges && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    onClick={() => setShowPendingChanges(!showPendingChanges)}
                    startIcon={<ExpandMoreIcon sx={{
                      transform: showPendingChanges ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }} />}
                    sx={{
                      color: '#3d2c02',
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto'
                    }}
                  >
                    Pending Changes: {getArrayChangeText(quotesArrayChanges)}
                  </Button>
                  
                  <Collapse in={showPendingChanges}>
                    <Box sx={{
                      mt: 1,
                      p: 1,
                      backgroundColor: '#3d2c02',
                      border: `1px solid #3d2c02`,
                      borderRadius: 1
                    }}>
                      {quotesArrayChanges.added.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ color: '#3d2c02', mb: 1 }}>
                            Added ({quotesArrayChanges.added.length}):
                          </Typography>
                          {quotesArrayChanges.added.map((quote, index) => (
                            <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5, color: '#3d2c02' }}>
                              • "{quote}"
                            </Typography>
                          ))}
                        </Box>
                      )}
                      
                      {quotesArrayChanges.removed.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ color: '#3d2c02', mb: 1 }}>
                            Removed ({quotesArrayChanges.removed.length}):
                          </Typography>
                          {quotesArrayChanges.removed.map((quote, index) => (
                            <Typography key={index} variant="body2" sx={{ ml: 2, mb: 0.5, textDecoration: 'line-through', color: '#3d2c02' }}>
                              • "{quote}"
                            </Typography>
                          ))}
                        </Box>
                      )}
                      
                      {quotesArrayChanges.modified.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#3d2c02', mb: 1 }}>
                            Modified ({quotesArrayChanges.modified.length}):
                          </Typography>
                          {quotesArrayChanges.modified.map((change, index) => (
                            <Box key={index} sx={{ ml: 2, mb: 1 }}>
                              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#3d2c02' }}>
                                • "{change.old}"
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#3d2c02' }}>
                                → "{change.new}"
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              )}
            </Box>
          )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default CharacterQuotes; 