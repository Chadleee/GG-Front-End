import { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField,
  useTheme 
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import MuiRichTextEditor from './MuiRichTextEditor';
import MuiContentRenderer from './MuiContentRenderer';

function EditableText({ 
  value, 
  editValue,
  onSave, 
  onEdit,
  onCancel,
  onEditValueChange,
  placeholder = "Enter text...",
  variant = "body1",
  sx = {},
  multiline = true,
  maxLength = null,
  isEditing = false
}) {
  const theme = useTheme();

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editValue);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleChange = (newValue) => {
    // Update the edit value in the parent component
    if (onEditValueChange) {
      onEditValueChange(newValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ position: 'relative' }}>
        <MuiRichTextEditor
          value={editValue}
          onChange={handleChange}
          placeholder={placeholder}
          sx={{ mb: 2 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <MuiContentRenderer
        content={value}
        variant={variant}
        sx={{ ...sx }}
      />
      <IconButton
        size="small"
        onClick={handleEdit}
        sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          color: theme.palette.warning.main,
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
          '&:hover': {
            opacity: 1,
          },
          '&:focus': {
            opacity: 1,
          }
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default EditableText; 