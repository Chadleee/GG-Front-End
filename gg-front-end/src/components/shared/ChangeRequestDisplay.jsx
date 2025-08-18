import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon
} from '@mui/icons-material';
import { useChangeRequests } from '../../contexts/ChangeRequestContext';

function ChangeRequestDisplay({ entityType, entityId, canEdit }) {
  const theme = useTheme();
  const { getChangeRequestsByCharacterId, getChangeRequestsByMemberId } = useChangeRequests();
  const [changeRequests, setChangeRequests] = useState([]);

  useEffect(() => {
    if (canEdit && entityType && entityId) {
      let requests = [];
      if (entityType === 'character') {
        requests = getChangeRequestsByCharacterId(entityId);
      } else if (entityType === 'member') {
        requests = getChangeRequestsByMemberId(entityId);
      }
      setChangeRequests(requests);
    }
  }, [entityType, entityId, canEdit, getChangeRequestsByCharacterId, getChangeRequestsByMemberId]);

  if (!canEdit || changeRequests.length === 0) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ color: theme.palette.warning.main }} />;
      case 'approved':
        return <ApprovedIcon sx={{ color: theme.palette.success.main }} />;
      case 'rejected':
        return <RejectedIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return 'None';
    }
    if (typeof value === 'string' && value.trim() === '') {
      return 'Empty';
    }
    if (Array.isArray(value)) {
      return value.length === 0 ? 'Empty array' : `${value.length} items`;
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const pendingRequests = changeRequests.filter(req => req.status === 'pending');
  const otherRequests = changeRequests.filter(req => req.status !== 'pending');

  return (
    <Box sx={{ mt: 2 }}>
      <Accordion 
        defaultExpanded={pendingRequests.length > 0}
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : '#2d3748',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
              Pending Changes ({pendingRequests.length})
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {pendingRequests.length > 0 ? (
            <List dense>
              {pendingRequests.map((request, index) => (
                <Box key={request.id || index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {formatFieldName(request.fieldType)}
                          </Typography>
                          <Chip
                            label={request.status}
                            size="small"
                            color={getStatusColor(request.status)}
                            icon={getStatusIcon(request.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Current Value:
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              {formatValue(request.oldValue)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Proposed Change:
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 'medium' }}>
                              {formatValue(request.newValue)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < pendingRequests.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              No pending changes
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {otherRequests.length > 0 && (
        <Accordion sx={{ mt: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              Other Changes ({otherRequests.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {otherRequests.map((request, index) => (
                <Box key={request.id || index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {formatFieldName(request.fieldType)}
                          </Typography>
                          <Chip
                            label={request.status}
                            size="small"
                            color={getStatusColor(request.status)}
                            icon={getStatusIcon(request.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Previous Value:
                            </Typography>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              {formatValue(request.oldValue)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              New Value:
                            </Typography>
                            <Typography variant="body2">
                              {formatValue(request.newValue)}
                            </Typography>
                          </Box>
                          {request.rejectionReason && (
                            <Box>
                              <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                                Rejection Reason:
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                                {request.rejectionReason}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < otherRequests.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

export default ChangeRequestDisplay;
