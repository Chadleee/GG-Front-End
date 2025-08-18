import { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button,
  useTheme,
  Chip,
  Collapse
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import ExpandableCard from '../ExpandableCard';
import EditableText from './EditableText';
import { useChangeRequests } from '../../../contexts/ChangeRequestContext';
import { getPendingChanges, formatValue } from '../../../utils/changeDetection';

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
  const [showChanges, setShowChanges] = useState(false);
  const theme = useTheme();
  
  // Get pending changes for this specific field
  const { changeRequests } = useChangeRequests();
  const pendingChanges = getPendingChanges(changeRequests, entityType, entityId, fieldType);
  const hasPendingChanges = pendingChanges.length > 0;

  const handleEdit = () => {
    setEditValue(value || '');
    setIsEditing(true);
    setIsExpanded(true); // Automatically expand when editing starts
  };

  const handleSave = async () => {
    if (editValue !== value) {
      setIsSubmitting(true);
      try {
        await onSave(editValue);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value || '');
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const renderPendingChanges = () => {
    if (!hasPendingChanges) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Button
          size="small"
          onClick={() => setShowChanges(!showChanges)}
          startIcon={<ExpandMoreIcon sx={{ 
            transform: showChanges ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />}
          sx={{ 
            color: theme.palette.warning.main,
            textTransform: 'none',
            p: 0,
            minWidth: 'auto'
          }}
        >
          Pending Changes ({pendingChanges.length})
        </Button>
        
        <Collapse in={showChanges}>
          <Box sx={{ 
            mt: 1, 
            p: 1, 
            backgroundColor: '#3d2c02',
            border: `1px solid ${theme.palette.warning.main}`,
            borderRadius: 1
          }}>
            {pendingChanges.map((change, index) => (
              <Box key={change.id || index} sx={{ mb: index < pendingChanges.length - 1 ? 1 : 0 }}>
                <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                  {formatValue(change.newValue)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <Box sx={{ p: 2 }}>
          <EditableText
            value={editValue}
            onChange={setEditValue}
            placeholder={placeholder}
            multiline={multiline}
            maxLength={maxLength}
            variant={variant}
            autoFocus
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSubmitting}
            >
              Save
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant={variant} sx={{ whiteSpace: 'pre-wrap' }}>
          {value || placeholder}
        </Typography>
        {renderPendingChanges()}
      </Box>
    );
  };

  return (
    <ExpandableCard
      title={title}
      defaultExpanded={isExpanded}
      collapsible={collapsible}
      sx={sx}
      headerActions={
        canEdit && (
          <Button
            startIcon={<EditIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            sx={{
              mr: 0,
              color: hasPendingChanges ? '#FFD700' : (theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary),
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.1)',
              }
            }}
          >
            Edit
          </Button>
        )
      }
    >
      {renderContent()}
    </ExpandableCard>
  );
}

export default EditableExpandableCard; 