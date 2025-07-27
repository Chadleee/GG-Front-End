import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  useTheme,
  Chip
} from '@mui/material';
import { 
  PlayArrow as PlayIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon
} from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ExpandableCard from './ExpandableCard';

function ClipsCarousel({ 
  title = "Clips", 
  clips = [], 
  defaultExpanded = false,
  collapsible = true,
  sx = {}
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('default');
  const sliderRef = useRef(null);
  const theme = useTheme();

  // Function to determine if infinite scrolling should be enabled
  const shouldEnableInfinite = () => {
    const width = window.innerWidth;
    let slidesToShow = 4; // default
    
    if (width <= 768) {
      slidesToShow = 1;
    } else if (width <= 1400) {
      slidesToShow = 2;
    } else if (width <= 1800) {
      slidesToShow = 3;
    }
    
    return clips.length > slidesToShow;
  };

  // Responsive settings for different screen sizes
  const getSliderSettings = (breakpoint) => {
    const settings = {
      dots: shouldEnableInfinite(),
      infinite: shouldEnableInfinite(),
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: true,
      beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
      responsive: [
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    // Adjust settings based on breakpoint
    switch (breakpoint) {
      case '1800':
        settings.slidesToShow = 3;
        settings.slidesToScroll = 3;
        break;
      case '1400':
        settings.slidesToShow = 2;
        settings.slidesToScroll = 2;
        break;
      case '768':
        settings.slidesToShow = 1;
        settings.slidesToScroll = 1;
        break;
      default:
        settings.slidesToShow = 4;
        settings.slidesToScroll = 4;
    }

    return settings;
  };

  // Update breakpoint when window resizes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setCurrentBreakpoint('768');
      } else if (width <= 1400) {
        setCurrentBreakpoint('1400');
      } else if (width <= 1800) {
        setCurrentBreakpoint('1800');
      } else {
        setCurrentBreakpoint('default');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper function to extract Twitch video ID
  const getTwitchVideoId = (url) => {
    const regExp = /twitch\.tv\/videos\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Helper function to extract Twitch clip ID
  const getTwitchClipId = (url) => {
    const regExp = /twitch\.tv\/\w+\/clip\/(\w+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Helper function to create embed URL
  const getEmbedUrl = (clip) => {
    const { url, source } = clip;
    
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

  const handleClipClick = (clip) => {
    // Fallback to opening in new tab for unsupported platforms
    const embedUrl = getEmbedUrl(clip);
    if (!embedUrl) {
      window.open(clip.url, '_blank');
    }
  };

  const renderClipCard = (clip, index) => {
    const embedUrl = getEmbedUrl(clip);
    
    return (
      <Box key={index} sx={{ p: 1 }}>
        <Card 
          sx={{ 
            height: embedUrl ? '300px' : '200px',
            cursor: embedUrl ? 'default' : 'pointer',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: embedUrl ? 'none' : 'translateY(-4px)',
              boxShadow: embedUrl ? theme.shadows[2] : theme.shadows[8],
            },
            backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#424242',
            border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#666666'}`
          }}
          onClick={() => handleClipClick(clip)}
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
                title={clip.title}
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
            // Fallback Card with Play Icon
            <CardContent sx={{ 
              p: 2, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
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

              {/* Clip Title */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.2,
                  color: theme.palette.text.primary
                }}
              >
                {clip.title}
              </Typography>

              {/* Source and Date */}
              <Box sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={clip.source} 
                    size="small" 
                    sx={{ 
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: '0.7rem'
                    }}
                  >
                    {clip.publishedAt}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          )}
        </Card>
      </Box>
    );
  };

  const renderContent = () => {
    if (!clips || clips.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 4 
        }}>
          <Typography variant="body2" color="text.secondary">
            No clips available
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ px: 1 }}>
        <Slider 
          ref={sliderRef}
          {...getSliderSettings(currentBreakpoint)}
          sx={{
            '& .slick-dots': {
              bottom: -30,
              '& li button:before': {
                color: theme.palette.primary.main,
              },
              '& li.slick-active button:before': {
                color: theme.palette.primary.main,
              }
            },
            '& .slick-prev, & .slick-next': {
              color: theme.palette.primary.main,
              '&:before': {
                color: theme.palette.primary.main,
              }
            }
          }}
        >
          {clips.map((clip, index) => renderClipCard(clip, index))}
        </Slider>
      </Box>
    );
  };

  return (
    <ExpandableCard
      title={title}
      defaultExpanded={defaultExpanded}
      collapsible={collapsible}
      sx={sx}
    >
      {renderContent()}
    </ExpandableCard>
  );
}

export default ClipsCarousel; 