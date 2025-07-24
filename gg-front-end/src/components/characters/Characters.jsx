import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import { useMembers } from '../../contexts/MemberContext';
import CharacterCard from './CharacterCard';
import AddCharacterDialog from './AddCharacterDialog';

function Characters() {
  const theme = useTheme();
  const { 
    characters, 
    loading, 
    error
  } = useCharacters();
  
  const { members } = useMembers();
  
  const [openDialog, setOpenDialog] = useState(false);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading characters...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Characters
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          Add Character
        </Button>
      </Box>

      <Grid container spacing={3}>
        {characters.map((character) => (
          <Grid item xs={12} sm={6} md={4} key={character.id}>
            <CharacterCard character={character} />
          </Grid>
        ))}
      </Grid>

      <AddCharacterDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        members={members}
      />
    </Box>
  );
}

export default Characters; 