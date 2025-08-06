import { 
  Box, 
  Typography, 
  useTheme,
  Grid
} from '@mui/material';

function AvatarInfo({ character }) {
  const theme = useTheme();

  if (!character.avatarName && !character.avatarDescription && !character.avatarUrl && !character.avatarReferenceImage) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      {/* Avatar Info Content */}
      <Grid item size={{ xs: 12, md: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {character.avatarName && (
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.primary.main,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                '&:hover': {
                  opacity: 0.8,
                  textDecoration: 'underline',
                },
              }}
              onClick={() => window.open(character.avatarUrl || 'http://localhost:5173', '_blank')}
            >
              {character.avatarName}
            </Typography>
          )}
          {character.avatarDescription && (
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
              {character.avatarDescription}
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Reference Image */}
      {character.avatarReferenceImage && (
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src={character.avatarReferenceImage} 
              alt={`${character.name} Reference`}
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                borderRadius: '8px',
                border: `2px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
              }}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default AvatarInfo; 