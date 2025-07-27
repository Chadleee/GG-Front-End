import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme,
  TextField,
  InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
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
  const [searchTerm, setSearchTerm] = useState('');

  // Filter characters based on search term
  const filteredCharacters = characters.filter(character => {
    const characterName = character.name?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    return characterName.includes(searchLower);
  });

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

      {/* Search Section */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search characters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
              '& fieldset': {
                borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
              },
            },
          }}
        />
      </Box>

      {/* Results Count */}
      <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
        {filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''} found
      </Typography>

      <Grid container spacing={3}>
        {filteredCharacters
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((character) => (
            <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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