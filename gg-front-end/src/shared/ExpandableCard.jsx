import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  IconButton, 
  Collapse,
  Box,
  useTheme 
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

function ExpandableCard({ 
  title, 
  children, 
  expandedContent, 
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  disableCollapse = false,
  sx = {},
  headerActions = null
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const theme = useTheme();

  // Use external expanded state if provided, otherwise use internal state
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;
  const setIsExpanded = onExpandedChange || setInternalExpanded;

  const handleExpandClick = () => {
    if (!disableCollapse) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card 
      sx={{ 
        backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
        ...sx
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {headerActions}
            <IconButton
              onClick={handleExpandClick}
              disabled={disableCollapse}
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease-in-out',
                color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                opacity: disableCollapse ? 0.5 : 1,
                cursor: disableCollapse ? 'not-allowed' : 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                }
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ 
            borderTop: `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
            pt: 2 
          }}>
          {children}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ExpandableCard; 