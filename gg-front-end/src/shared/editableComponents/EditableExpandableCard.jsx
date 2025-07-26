import { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button,
  useTheme 
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import ExpandableCard from '../ExpandableCard';
import EditableText from './EditableText';

function EditableExpandableCard({ 
  title, 
  value, 
  onSave,
  placeholder = "Enter text...",
  variant = "body1",
  defaultExpanded = false,
  sx = {},
  multiline = true,
  maxLength = null,
  entityType,
  entityId,
  fieldType,
  canEdit = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const theme = useTheme();

  const handleEdit = () => {
    setEditValue(value || '');
    setIsEditing(true);
    setIsExpanded(true); // Automatically expand when editing starts
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Create change request
      const changeRequest = {
        entity: entityType,
        entityId: entityId,
        fieldType: fieldType,
        action: "update",
        oldValue: value || null,
        newValue: editValue
      };

      // Submit change request
      const response = await fetch('http://localhost:3001/change_requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changeRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to submit change request');
      }

      // Call the onSave callback with the new value
      if (onSave) {
        await onSave(editValue);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting change request:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
    // Keep expanded when canceling - don't collapse
  };

  const handleTextSave = (newValue) => {
    setEditValue(newValue);
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <Box sx={{ position: 'relative' }}>
          <EditableText
            value={value}
            editValue={editValue}
            onSave={handleTextSave}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onEditValueChange={handleTextSave}
            placeholder={placeholder}
            variant={variant}
            multiline={multiline}
            maxLength={maxLength}
            isEditing={isEditing}
            sx={{ mb: 2 }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            justifyContent: 'flex-end',
            mt: 2
          }}>
            <Button
              size="small"
              onClick={handleCancel}
              disabled={isSubmitting}
              sx={{ 
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? '#ffebee' : 'rgba(244, 67, 54, 0.1)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              disabled={isSubmitting || editValue === value}
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.success.dark,
                },
                '&:disabled': {
                  backgroundColor: theme.palette.action.disabled,
                }
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ position: 'relative' }}>
        <EditableText
          value={value}
          editValue={editValue}
          onSave={handleTextSave}
          onEdit={handleEdit}
          onCancel={handleCancel}
          placeholder={placeholder}
          variant={variant}
          multiline={multiline}
          maxLength={maxLength}
          isEditing={isEditing}
        />
      </Box>
    );
  };

  return (
    <ExpandableCard
      title={title}
      defaultExpanded={defaultExpanded}
      expanded={isExpanded}
      onExpandedChange={setIsExpanded}
      disableCollapse={isEditing}
      sx={sx}
      headerActions={
        canEdit && !isEditing ? (
          <Button 
            startIcon={<EditIcon />}
            onClick={() => handleEdit()}
            sx={{ mr: 2, color: theme.palette.primary.main }}
          >
            Edit
          </Button>
        ) : null
      }
    >
      {renderContent()}
    </ExpandableCard>
  );
}

export default EditableExpandableCard; 