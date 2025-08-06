import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  useTheme,
  IconButton,
  Tooltip,
  Modal
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

function AvatarEditDialog({ open = false, onClose, avatarData = {}, onSave }) {
  const theme = useTheme();
  const [editedAvatar, setEditedAvatar] = useState({
    avatarName: avatarData.avatarName || '',
    avatarDescription: avatarData.avatarDescription || '',
    avatarUrl: avatarData.avatarUrl || '',
    avatarReferenceImage: avatarData.avatarReferenceImage || ''
  });

  const handleSave = () => {
    onSave(editedAvatar);
  };

  const handleClose = () => {
    setEditedAvatar({
      avatarName: avatarData.avatarName || '',
      avatarDescription: avatarData.avatarDescription || '',
      avatarUrl: avatarData.avatarUrl || '',
      avatarReferenceImage: avatarData.avatarReferenceImage || ''
    });
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
          <Typography variant="h6">Edit Avatar Info</Typography>
        </DialogTitle>
        
              <DialogContent sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', py: 2 }}>
          {/* Avatar Name */}
          <TextField
            fullWidth
            label="Avatar Name"
            value={editedAvatar.avatarName}
            onChange={(e) => setEditedAvatar({ ...editedAvatar, avatarName: e.target.value })}
            placeholder="Enter avatar name"
          />

          {/* Avatar URL */}
          <TextField
            fullWidth
            label="Avatar URL"
            value={editedAvatar.avatarUrl}
            onChange={(e) => setEditedAvatar({ ...editedAvatar, avatarUrl: e.target.value })}
            placeholder="https://..."
          />

          {/* Avatar Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Avatar Description"
            value={editedAvatar.avatarDescription}
            onChange={(e) => setEditedAvatar({ ...editedAvatar, avatarDescription: e.target.value })}
            placeholder="Enter avatar description..."
          />

          {/* Reference Image URL */}
          <TextField
            fullWidth
            label="Reference Image URL"
            value={editedAvatar.avatarReferenceImage}
            onChange={(e) => setEditedAvatar({ ...editedAvatar, avatarReferenceImage: e.target.value })}
            placeholder="https://..."
          />

          {/* Reference Image Preview */}
          {editedAvatar.avatarReferenceImage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                Reference Image Preview:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <img 
                  src={editedAvatar.avatarReferenceImage} 
                  alt="Reference Preview"
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: `2px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
            </Box>
          )}
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

export default AvatarEditDialog; 