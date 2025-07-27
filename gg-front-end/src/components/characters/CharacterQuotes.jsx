import { useState } from 'react';
import { Box, Typography, IconButton, TextField, Button, Collapse, useTheme } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import MuiRichTextEditor from '../../shared/editableComponents/MuiRichTextEditor';

function CharacterQuotes({ character, canEdit, onCharacterUpdate }) {
  const { updateCharacter } = useCharacters();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editValue, setEditValue] = useState('');

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

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
        }}
      >
        <Typography variant="h6">Quotes</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {canEdit && !isEditing && (
            <Button
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                }
              }}
            >
              Edit
            </Button>
          )}
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ color: theme.palette.text.primary }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
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
                  onClick={handleCancel}
                  sx={{ color: theme.palette.error.main }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Save
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
            </Box>
                      )}
          </Box>
        </Collapse>
      </Box>
    );
  }

export default CharacterQuotes; 