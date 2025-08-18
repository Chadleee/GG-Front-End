import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import { useTheme } from '@mui/material/styles';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';

function RelationshipsEditDialog({ open, onClose, relationships = [], onSave, character }) {
  const [editedRelationships, setEditedRelationships] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { characters } = useCharacters();
  const theme = useTheme();

  // Relationship types for dropdown
  const relationshipTypes = [
    'Friend',
    'Rival',
    'Family',
    'Romantic',
    'Mentor',
    'Student',
    'Partner',
    'Enemy',
    'Acquaintance',
    'Colleague'
  ];

  useEffect(() => {
    if (open) {
      setEditedRelationships([...relationships]);
      setIsEditing(false);
      setEditingIndex(null);
    }
  }, [open, relationships]);

  const handleAddRelationship = () => {
    const tempId = `temp_id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRelationship = {
      id: tempId,
      character_id: '',
      relationship_type: 'Friend',
      description: ''
    };
    setEditedRelationships([...editedRelationships, newRelationship]);
    setIsEditing(true);
    setEditingIndex(editedRelationships.length);
  };

  const handleEditRelationship = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleDeleteRelationship = (index) => {
    const updatedRelationships = editedRelationships.filter((_, i) => i !== index);
    setEditedRelationships(updatedRelationships);
    if (editingIndex === index) {
      setIsEditing(false);
      setEditingIndex(null);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleUpdateRelationship = (index, field, value) => {
    const updatedRelationships = [...editedRelationships];
    updatedRelationships[index] = {
      ...updatedRelationships[index],
      [field]: value
    };
    setEditedRelationships(updatedRelationships);
  };

  const handleSaveRelationship = () => {
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleSave = () => {
    onSave(editedRelationships);
    onClose();
  };

  const handleCancel = () => {
    setEditedRelationships([...relationships]);
    setIsEditing(false);
    setEditingIndex(null);
    onClose();
  };

  const getCharacterName = (characterId) => {
    const character = characters.find(c => c.id == characterId);
    return character ? character.name : 'Unknown Character';
  };

  const getCharacterImage = (characterId) => {
    const character = characters.find(c => c.id == characterId);
    if (!character) return '';
    
    const characterName = character.name;
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
        return character.image || '';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.mode === 'light' ? '#2c2c2c' : theme.palette.background.paper,
          color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: 1
      }}>
        Edit Character Relationships
      </DialogTitle>

      <DialogContent sx={{ 
        pt: 2,
        overflow: 'auto',
        maxHeight: '70vh'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Add New Relationship */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            p: 2,
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: 1,
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'
          }}>
            <IconButton
              onClick={handleAddRelationship}
              sx={{
                color: theme.palette.success.main,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                }
              }}
            >
              <AddIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Add New Relationship
            </Typography>
          </Box>

          {/* Relationships List */}
          <List sx={{ p: 0 }}>
            {editedRelationships.map((relationship, index) => (
              <ListItem
                key={relationship.id || index}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.02)',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                {isEditing && editingIndex === index ? (
                  // Edit Mode
                  <Box sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Character</InputLabel>
                          <Select
                            value={relationship.character_id}
                            onChange={(e) => handleUpdateRelationship(index, 'character_id', e.target.value)}
                            label="Character"
                          >
                            {characters
                              .filter(c => c.id !== character?.id) // Exclude current character
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((char) => (
                                <MenuItem key={char.id} value={char.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar 
                                      src={getCharacterImage(char.id)} 
                                      sx={{ width: 24, height: 24 }}
                                    />
                                    {char.name}
                                  </Box>
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Relationship Type</InputLabel>
                          <Select
                            value={relationship.relationship_type}
                            onChange={(e) => handleUpdateRelationship(index, 'relationship_type', e.target.value)}
                            label="Relationship Type"
                          >
                            {relationshipTypes
                              .sort((a, b) => a.localeCompare(b))
                              .map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Description"
                          value={relationship.description}
                          onChange={(e) => handleUpdateRelationship(index, 'description', e.target.value)}
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        onClick={handleCancelEdit}
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
                        onClick={handleSaveRelationship}
                        sx={{
                          backgroundColor: '#FFFFFF',
                          color: '#000000',
                          '&:hover': {
                            backgroundColor: '#000000',
                            color: '#FFFFFF',
                          }
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // Display Mode
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar 
                        src={getCharacterImage(relationship.character_id)} 
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {getCharacterName(relationship.character_id)}
                        </Typography>
                        <Chip
                          label={relationship.relationship_type}
                          size="small"
                          sx={{
                            backgroundColor: '#d3d3d3',
                            color: '#000000',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditRelationship(index)}
                          sx={{
                            color: theme.palette.warning.main,
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteRelationship(index)}
                          sx={{
                            color: '#d32f2f',
                            '&:hover': {
                              backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    {relationship.description && (
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 6 }}>
                        {relationship.description}
                      </Typography>
                    )}
                  </Box>
                )}
              </ListItem>
            ))}
          </List>

          {editedRelationships.length === 0 && (
            <Typography variant="body2" sx={{ 
              color: theme.palette.text.secondary, 
              textAlign: 'center',
              py: 4
            }}>
              No relationships added yet. Click "Add New Relationship" to get started.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 1
      }}>
        <Button onClick={handleCancel} sx={{ color: theme.palette.text.secondary }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          sx={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#FFFFFF',
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RelationshipsEditDialog; 