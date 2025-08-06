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
import { Search as SearchIcon, ArrowBack as ArrowBackIcon, PlayArrow as PlayIcon } from '@mui/icons-material';
import { useCharacters } from '../../contexts/CharacterContext';
import { useNavigate, useParams } from 'react-router-dom';
import ClipsCarousel from '../shared/ClipsCarousel';

function AllCharacterVideos() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { characters } = useCharacters();
  const [searchTerm, setSearchTerm] = useState('');

  // Get videos for the specific character
  const getCharacterVideos = () => {
    const character = characters.find(c => c.id.toString() === id);
    if (!character || !character.clips) return [];
    
    return character.clips.map(clip => ({
      ...clip,
      characterName: character.name,
      characterId: character.id
    }));
  };

  const characterVideos = getCharacterVideos();

  // Video embedding functions
  const getYouTubeVideoId = (url) => {
    // Handle YouTube Shorts URLs
    if (url.includes('/shorts/')) {
      const regExp = /youtube\.com\/shorts\/([^#&?\/]*)/;
      const match = url.match(regExp);
      return (match && match[1].length === 11) ? match[1] : null;
    }
    // Handle standard YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getTwitchVideoId = (url) => {
    const regExp = /twitch\.tv\/videos\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getTwitchClipId = (url) => {
    const regExp = /twitch\.tv\/\w+\/clip\/([^?]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (video) => {
    const { url, source } = video;
    
    if (source === 'YouTube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = getYouTubeVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    if (source === 'Twitch' || url.includes('twitch.tv')) {
      const videoId = getTwitchVideoId(url);
      const clipId = getTwitchClipId(url);
      
      if (videoId) {
        return `https://player.twitch.tv/?video=v${videoId}&parent=localhost`;
      }
      if (clipId) {
        return `https://clips.twitch.tv/embed?clip=${clipId}&parent=localhost`;
      }
    }
    
    return null;
  };

  // Filter videos based on search term
  const filteredVideos = characterVideos.filter(video => {
    return video.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {characters.find(c => c.id.toString() === id)?.name || 'Character'} Videos
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/characters/${id}`)}
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }
          }}
        >
          Back to Character
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
          {filteredVideos.map((video, index) => {
            const embedUrl = getEmbedUrl(video);
            
            return (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card 
                  sx={{ 
                    height: embedUrl ? '300px' : '100%',
                    cursor: embedUrl ? 'default' : 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: embedUrl ? 'none' : 'translateY(-4px)',
                      boxShadow: embedUrl ? theme.shadows[2] : theme.shadows[8],
                    },
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
                  }}
                  onClick={() => {
                    if (!embedUrl && video.url) {
                      window.open(video.url, '_blank');
                    }
                  }}
                >
                  {embedUrl ? (
                    // Embedded Video
                    <Box sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '100%',
                      overflow: 'hidden'
                    }}>
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                      />
                    </Box>
                  ) : (
                    // Fallback Card
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Play Icon Overlay */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        mb: 1
                      }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: theme.palette.primary.main,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white'
                        }}>
                          <PlayIcon />
                        </Box>
                      </Box>
                      
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
                          navigate(`/characters/${video.characterId}`);
                        }}
                      >
                        {video.characterName}
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
                  )}
                </Card>
              </Grid>
            );
          })}
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

export default AllCharacterVideos; 