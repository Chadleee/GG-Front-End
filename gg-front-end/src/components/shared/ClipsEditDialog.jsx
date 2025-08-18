import { useState, useEffect, useRef } from 'react';
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
  useTheme,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DeleteForever as TrashIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';

function ClipsEditDialog({
  open,
  onClose,
  clips = [],
  onSave,
  title = "Edit Clips",
  canEdit = true
}) {
  const theme = useTheme();
  const [editedClips, setEditedClips] = useState([]);
  const [formItem, setFormItem] = useState({ title: '', source: '', url: '', publishedAt: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const dialogRef = useRef(null);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Source options for dropdown
  const sourceOptions = [
    'Facebook',
    'Instagram',
    'Other',
    'TikTok',
    'Twitter',
    'Twitch',
    'YouTube'
  ];

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    // Handle YouTube Shorts URLs
    if (url.includes('/shorts/')) {
      const regExp = /youtube\.com\/shorts\/([^#&?\/]*)/;
      const match = url.match(regExp);
      return (match && match[1].length === 11) ? match[1] : null;
    }
    
    // Handle standard YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper function to extract Twitch video ID
  const getTwitchVideoId = (url) => {
    const regExp = /twitch\.tv\/videos\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Helper function to extract Twitch clip ID
  const getTwitchClipId = (url) => {
    const regExp = /twitch\.tv\/\w+\/clip\/(\w+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Helper function to create embed URL
  const getEmbedUrl = (url, source) => {
    if (source === 'YouTube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = getYouTubeVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    if (source === 'Twitch' || url.includes('twitch.tv')) {
      const videoId = getTwitchVideoId(url);
      const clipId = getTwitchClipId(url);
      
      if (videoId) {
        return `https://player.twitch.tv/?video=v${videoId}&parent=localhost`;
      }
      if (clipId) {
        return `https://clips.twitch.tv/embed?clip=${clipId}&parent=localhost`;
      }
    }
    
    // For other platforms, return null to show fallback
    return null;
  };

  useEffect(() => {
    if (open) {
      setEditedClips([...clips]);
      setFormItem({ title: '', source: '', url: '', publishedAt: '' });
      setEditingIndex(null);
      setIsEditing(false);
    }
  }, [open, clips]);

  const handleSaveItem = () => {
    if (formItem.url.trim() && formItem.title.trim()) {
      if (isEditing) {
        // Update existing item
        const updatedClips = [...editedClips];
        updatedClips[editingIndex] = { ...formItem };
        setEditedClips(updatedClips);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        // Add new item with temporary ID
        const tempId = `temp_id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setEditedClips([...editedClips, { ...formItem, id: tempId }]);
      }
      setFormItem({ title: '', source: '', url: '', publishedAt: '' });
    }
  };

  const handleCancelEdit = () => {
    setFormItem({ title: '', source: '', url: '', publishedAt: '' });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleDeleteItem = (index) => {
    const updatedClips = editedClips.filter((_, i) => i !== index);
    setEditedClips(updatedClips);
  };

  const handleEditItem = (index) => {
    const item = editedClips[index];
    setFormItem({ 
      title: item.title || '', 
      source: item.source || '', 
      url: item.url || '', 
      publishedAt: item.publishedAt || '' 
    });
    setEditingIndex(index);
    setIsEditing(true);
    
    // Smooth scroll to top of dialog content
    setTimeout(() => {
      if (dialogRef.current) {
        dialogRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleSave = () => {
    onSave(editedClips);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original clips state
    setEditedClips([...clips]);
    // Reset form
    setFormItem({ title: '', source: '', url: '', publishedAt: '' });
    // Exit edit mode
    setEditingIndex(null);
    setIsEditing(false);
    // Close dialog
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.text.primary,
        py: 1
      }}>
        {title}
        <IconButton onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent ref={dialogRef} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
            {isEditing ? `Edit Clip ${editingIndex + 1}` : 'Add New Clip'}
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Clip Title"
                  value={formItem.title}
                  onChange={(e) => setFormItem({ ...formItem, title: e.target.value })}
                  placeholder="Enter clip title"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.background.paper,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                      },
                    },
                  }}
                />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background.paper,
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                    },
                  },
                }}>
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={formItem.source}
                    label="Source"
                    onChange={(e) => setFormItem({ ...formItem, source: e.target.value })}
                  >
                    {sourceOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Video URL"
                  value={formItem.url}
                  onChange={(e) => setFormItem({ ...formItem, url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.background.paper,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Published Date"
                  value={formItem.publishedAt}
                  onChange={(e) => setFormItem({ ...formItem, publishedAt: e.target.value })}
                  placeholder={getCurrentDate()}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.background.paper,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
            
            {/* Video Preview */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ 
                width: '100%',
                maxWidth: 200,
                height: 200, 
                border: `2px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`,
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#424242',
                mx: 'auto'
              }}>
                {formItem.url ? (
                  <>
                    {/* Embedded Video */}
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%',
                      position: 'relative'
                    }}>
                      <iframe
                        src={getEmbedUrl(formItem.url, formItem.source)}
                        title="Video Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback for invalid URLs */}
                      <Box sx={{ 
                        display: 'none', 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        p: 2,
                        backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#555555'
                      }}>
                        <PlayIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Video Preview
                        </Typography>
                        <Typography variant="caption">
                          Enter a valid video URL
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: theme.palette.text.secondary,
                    textAlign: 'center',
                    p: 2
                  }}>
                    <PlayIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Video Preview
                    </Typography>
                    <Typography variant="caption">
                      Enter a URL to see preview
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={isEditing ? <EditIcon /> : <AddIcon />}
              onClick={handleSaveItem}
              disabled={!formItem.url.trim() || !formItem.title.trim()}
            >
              {isEditing ? 'Update Clip' : 'Add Clip'}
            </Button>
            {isEditing && (
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
          Video Clips ({editedClips.length})
        </Typography>

        <Grid container spacing={2}>
          {editedClips.map((item, index) => (
            <Grid key={item.id || index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{
                backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#424242',
                border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#666666'}`
              }}>
                <Box sx={{ position: 'relative', height: 100 }}>
                  <Box
                    component="img"
                    src={`https://img.youtube.com/vi/${item.url.match(/[?&]v=([^&]+)/)?.[1] || 'default'}/mqdefault.jpg`}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'filter 0.2s ease-in-out'
                    }}
                    onClick={() => handleEditItem(index)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  
                  {/* Fallback for invalid URLs */}
                  <Box sx={{ 
                    display: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#555555',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <PlayIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />
                  </Box>
                  
                  {/* Hover Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 1,
                      }
                    }}
                    onClick={() => handleEditItem(index)}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }}
                    >
                      Edit
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ px: 2, py: 1, '&:last-child': { py: 1 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.text.primary, 
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.title || 'Untitled'}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: theme.palette.text.secondary,
                          fontSize: '0.6rem'
                        }}>
                          {item.source || 'Unknown source'}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(index)}
                        sx={{
                          color: theme.palette.error.main,
                          p: 0,
                          ml: 1,
                          '&:hover': {
                            backgroundColor: theme.palette.error.light,
                            color: 'white',
                          }
                        }}
                      >
                        <TrashIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {editedClips.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No clips available. Add some clips above.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ClipsEditDialog; 