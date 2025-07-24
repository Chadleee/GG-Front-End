import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to GG Front-End
      </Typography>
      
      <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary" sx={{ mb: 6 }}>
        Manage your characters and members with ease
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : 'inherit' }}>
                Characters
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                View and manage your game characters. Track their stats, equipment, and progress.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="large" 
                onClick={() => navigate('/characters')}
                fullWidth
                sx={{
                  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.primary.main,
                  color: theme.palette.mode === 'light' ? '#666666' : theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.primary.dark,
                  }
                }}
              >
                View Characters
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : 'inherit' }}>
                Members
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                Manage your team members. View profiles, roles, and team information.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="large" 
                onClick={() => navigate('/members')}
                fullWidth
                sx={{
                  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.primary.main,
                  color: theme.palette.mode === 'light' ? '#666666' : theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.primary.dark,
                  }
                }}
              >
                View Members
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home; 