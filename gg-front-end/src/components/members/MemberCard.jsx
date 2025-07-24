import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  useTheme,
  Box
} from '@mui/material';

function MemberCard({ member }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/members/${member.id}`);
  };

  return (
    <Card 
      onClick={handleViewDetails}
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={member.image} 
            sx={{ 
              width: 56, 
              height: 56, 
              mr: 2,
              border: `2px solid ${theme.palette.primary.main}`
            }}
          />
          <Box>
            <Typography variant="h6" component="h2" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
              {member.name}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
              Joined: {member.joinDate}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default MemberCard; 