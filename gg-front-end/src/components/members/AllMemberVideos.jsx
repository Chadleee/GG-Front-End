import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  InputAdornment,
  Chip,
  Button,
  useTheme
} from '@mui/material';
import { Search as SearchIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useMembers } from '../../contexts/MemberContext';
import { useNavigate, useParams } from 'react-router-dom';

function AllMemberVideos() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { members } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');

  // Get videos for the specific member
  const getMemberVideos = () => {
    const member = members.find(m => m.id.toString() === id);
    if (!member || !member.clips) return [];
    
    return member.clips.map(clip => ({
      ...clip,
      memberName: member.displayName || member.name,
      memberId: member.id
    }));
  };

  const memberVideos = getMemberVideos();

  // Filter videos based on search term
  const filteredVideos = memberVideos.filter(video => {
    return video.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {members.find(m => m.id.toString() === id)?.displayName || members.find(m => m.id.toString() === id)?.name || 'Member'} Videos
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/members/${id}`)}
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }
          }}
        >
          Back to Member
        </Button>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search videos..."
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
        {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
      </Typography>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <Grid container spacing={3}>
          {filteredVideos.map((video, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
                }}
                onClick={() => {
                  if (video.url) {
                    window.open(video.url, '_blank');
                  }
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1,
                      color: theme.palette.text.primary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2
                    }}
                  >
                    {video.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      color: theme.palette.text.secondary,
                      cursor: 'pointer',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/members/${video.memberId}`);
                    }}
                  >
                    {video.memberName}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Chip 
                      label={video.source} 
                      size="small"
                      sx={{ 
                        backgroundColor: '#d3d3d3',
                        color: '#000000',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {video.publishedAt}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 8 
        }}>
          <Typography variant="h6" color="text.secondary">
            No videos found
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default AllMemberVideos; 