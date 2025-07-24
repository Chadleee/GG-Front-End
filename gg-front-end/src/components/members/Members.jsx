import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add as AddIcon } from '@mui/icons-material';
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

      <Grid container spacing={3}>
        {members.map((member) => (
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