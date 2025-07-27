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
  canEdit = false,
  collapsible = true
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

  console.log(isExpanded);

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
              disabled={isSubmitting || editValue === value}
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
      collapsible={collapsible}
      sx={sx}
      headerActions={
        canEdit && !isEditing ? (
          <Button 
            startIcon={<EditIcon />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent header click when clicking edit button
              handleEdit();
            }}
            sx={{ 
              mr: 2, 
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.1)',
              }
            }}
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