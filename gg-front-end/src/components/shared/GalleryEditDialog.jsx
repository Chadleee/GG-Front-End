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
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DeleteForever as TrashIcon
} from '@mui/icons-material';

function GalleryEditDialog({
  open,
  onClose,
  gallery = [],
  onSave,
  title = "Edit Gallery",
  canEdit = true
}) {
  const theme = useTheme();
  const [editedGallery, setEditedGallery] = useState([]);
  const [formItem, setFormItem] = useState({ url: '', description: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      setEditedGallery([...gallery]);
      setFormItem({ url: '', description: '' });
      setEditingIndex(null);
      setIsEditing(false);
    }
  }, [open, gallery]);

  const handleSaveItem = () => {
    if (formItem.url.trim()) {
      if (isEditing) {
        // Update existing item
        const updatedGallery = [...editedGallery];
        updatedGallery[editingIndex] = { ...formItem };
        setEditedGallery(updatedGallery);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        // Add new item with temporary ID
        const tempId = `temp_id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setEditedGallery([...editedGallery, { ...formItem, id: tempId }]);
      }
      setFormItem({ url: '', description: '' });
    }
  };

  const handleCancelEdit = () => {
    setFormItem({ url: '', description: '' });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleDeleteItem = (index) => {
    const updatedGallery = editedGallery.filter((_, i) => i !== index);
    setEditedGallery(updatedGallery);
  };

  const handleEditItem = (index) => {
    const item = editedGallery[index];
    setFormItem({ url: item.url, description: item.description });
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
    onSave(editedGallery);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original gallery state
    setEditedGallery([...gallery]);
    // Reset form
    setFormItem({ url: '', description: '' });
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
            {isEditing ? `Edit Image ${editingIndex + 1}` : 'Add New Image'}
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={formItem.url}
                  onChange={(e) => setFormItem({ ...formItem, url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
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
                  label="Description"
                  value={formItem.description}
                  onChange={(e) => setFormItem({ ...formItem, description: e.target.value })}
                  placeholder="Image description"
                  multiline
                  minRows={2}
                  maxRows={6}
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
            
            {/* Image Preview */}
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
                    <Box
                      component="img"
                      src={formItem.url}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <Box sx={{ 
                      display: 'none', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: theme.palette.text.secondary,
                      textAlign: 'center',
                      p: 2
                    }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Invalid Image URL
                      </Typography>
                      <Typography variant="caption">
                        Please check the URL and try again
                      </Typography>
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
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Image Preview
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
              disabled={!formItem.url.trim()}
            >
              {isEditing ? 'Update Image' : 'Add Image'}
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
          Gallery Images ({editedGallery.length})
        </Typography>

        <Grid container spacing={2}>
          {editedGallery.map((item, index) => (
            <Grid key={item.id || index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{
                backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#424242',
                border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#666666'}`
              }}>
                <Box sx={{ position: 'relative', height: 100 }}>
                  <Box
                    component="img"
                    src={item.url}
                    alt={item.description}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'filter 0.2s ease-in-out'
                    }}
                    onClick={() => handleEditItem(index)}
                  />
                  
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
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, flex: 1 }}>
                        {item.description || 'No description'}
                      </Typography>
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

        {editedGallery.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No images in gallery. Add some images above.
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

export default GalleryEditDialog; 