import React, { useState, useRef } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import twitter_logo from '../../assets/twitter_logo.png';
import youtube_logo from '../../assets/youtube_logo.png';
import tiktok_logo from '../../assets/tiktok_logo.png';
import kick_logo from '../../assets/kick_logo.png';
import discord_logo from '../../assets/discord_logo.png';
import instagram_logo from '../../assets/instagram_logo.png';
import twitch_logo from '../../assets/twitch_logo.png';

const SOCIAL_PLATFORMS = [
  'Twitch',
  'YouTube',
  'YouTube VODs',
  'YouTube Archives',
  'TikTok',
  'X',
  'Twitter',
  'Kick',
  'Discord',
  'Instagram'
];

const getSocialLogo = (socialName) => {
  switch (socialName) {
    case 'Twitter':
    case 'X':
      return twitter_logo;
    case 'YouTube VODs':
    case 'YouTube Archives':
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

function SocialsEditDialog({ open, onClose, onSave, socials = [], title = "Edit Social Links" }) {
  const [editedSocials, setEditedSocials] = useState([...socials]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
  const [editingSocial, setEditingSocial] = useState({ platform: '', url: '' });
  const contentRef = useRef(null);

  const handleAddSocial = () => {
    if (newSocial.platform && newSocial.url) {
      setEditedSocials([...editedSocials, { ...newSocial }]);
      setNewSocial({ platform: '', url: '' });
    }
  };

  const handleEditSocial = (index) => {
    setEditingIndex(index);
    setEditingSocial({ ...editedSocials[index] });
  };

  const handleSaveEdit = (index) => {
    if (editingSocial.platform && editingSocial.url) {
      const updatedSocials = [...editedSocials];
      updatedSocials[index] = { ...editingSocial };
      setEditedSocials(updatedSocials);
      setEditingIndex(-1);
      setEditingSocial({ platform: '', url: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingSocial({ platform: '', url: '' });
  };

  const handleDeleteSocial = (index) => {
    setEditedSocials(editedSocials.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(editedSocials);
    onClose();
  };

  const handleClose = () => {
    setEditedSocials([...socials]);
    setEditingIndex(-1);
    setNewSocial({ platform: '', url: '' });
    setEditingSocial({ platform: '', url: '' });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      
      <DialogContent 
        ref={contentRef}
        sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 1
        }}
      >
        {/* Social Links List */}
        <Box>
          <List>
            {editedSocials
              .sort((a, b) => a.platform.localeCompare(b.platform))
              .map((social, index) => (
              <ListItem
                key={index}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: 'background.paper'
                }}
              >
                {editingIndex === index ? (
                  // Inline Edit Form
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Grid container spacing={2} sx={{ flex: 1 }}>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Platform</InputLabel>
                          <Select
                            value={editingSocial.platform}
                            onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                            label="Platform"
                          >
                            {SOCIAL_PLATFORMS.map((platform) => (
                              <MenuItem key={platform} value={platform}>
                                {platform}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="URL"
                          value={editingSocial.url}
                          onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                          placeholder="https://..."
                        />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <Tooltip title="Save">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleSaveEdit(index)}
                          disabled={!editingSocial.platform || !editingSocial.url}
                        >
                          <SaveIcon color="success" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton
                          size="small"
                          onClick={handleCancelEdit}
                        >
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ) : (
                  // Display Mode
                  <>
                    <Box
                      component="img"
                      src={getSocialLogo(social.platform)}
                      sx={{ width: 30, height: 30, borderRadius: '20%', mr: 2 }}
                    />
                    
                    <ListItemText
                      primary={social.platform}
                      secondary={social.url}
                      secondaryTypographyProps={{
                        sx: { wordBreak: 'break-all' }
                      }}
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditSocial(index)}
                            disabled={editingIndex !== -1}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteSocial(index)}
                            disabled={editingIndex !== -1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
            
            {/* Add New Social Row */}
            <ListItem
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                backgroundColor: 'background.paper'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Grid container spacing={2} sx={{ flex: 1 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Platform</InputLabel>
                      <Select
                        value={newSocial.platform}
                        onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                        label="Platform"
                      >
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <MenuItem key={platform} value={platform}>
                            {platform}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 8, lg: 9 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="URL"
                      value={newSocial.url}
                      onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                  <Tooltip title="Add Social Link">
                    <IconButton
                      color="success"
                      size="small"
                      sx={{
                        '&:hover': {
                          color: 'success.dark',
                        },
                        '&:disabled': {
                          color: 'grey.400',
                        }
                      }}
                      onClick={handleAddSocial}
                      disabled={!newSocial.platform || !newSocial.url}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear Form">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setNewSocial({ platform: '', url: '' })}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </ListItem>
          </List>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SocialsEditDialog; 