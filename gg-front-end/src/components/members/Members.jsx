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
import { useMembers } from '../../contexts/MemberContext';
import MemberCard from './MemberCard';
import AddMemberDialog from './AddMemberDialog';

function Members() {
  const theme = useTheme();
  const { 
    members, 
    loading, 
    error
  } = useMembers();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter members based on search term
  const filteredMembers = members.filter(member => {
    const memberName = (member.displayName || member.name)?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    return memberName.includes(searchLower);
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading members...</Typography>
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
          Members
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
          Add Member
        </Button>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search members..."
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
        {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
      </Typography>

      <Grid container spacing={3}>
        {filteredMembers
          .sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name))
          .map((member) => (
            <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <MemberCard member={member} />
            </Grid>
          ))}
      </Grid>

      <AddMemberDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
      />
    </Box>
  );
}

export default Members; 