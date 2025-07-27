import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  useTheme,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { 
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ExpandableCard from './ExpandableCard';

function GalleryCarousel({ 
  title = "Gallery", 
  gallery = [], 
  defaultExpanded = false,
  collapsible = true,
  sx = {}
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('default');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
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
    
    return gallery.length > slidesToShow;
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleCloseImage = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  const renderImageCard = (image, index) => (
    <Box key={index} sx={{ p: 1 }}>
      <Card 
        sx={{ 
          height: '250px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
          backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#424242',
          border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#666666'}`
        }}
        onClick={() => handleImageClick(image)}
      >
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Image */}
          <Box
            component="img"
            src={image.url}
            alt={image.description}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
          
          {/* Overlay with Fullscreen Icon */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              opacity: 1,
            }
          }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.text.primary
            }}>
              <FullscreenIcon />
            </Box>
          </Box>

          {/* Description Overlay at Bottom */}
          {image.description && (
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              p: 1
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {image.description}
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );

  const renderContent = () => {
    if (!gallery || gallery.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 4 
        }}>
          <Typography variant="body2" color="text.secondary">
            No images available
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ px: 2, py: 1, '& .slick-dots li button:before': { color: '#FFFFFF !important' }, '& .slick-dots li.slick-active button:before': { color: '#FFFFFF !important' } }}>
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
          {gallery.map((image, index) => renderImageCard(image, index))}
        </Slider>
      </Box>
    );
  };

  return (
    <>
      <ExpandableCard
        title={title}
        defaultExpanded={defaultExpanded}
        collapsible={collapsible}
        sx={sx}
      >
        {renderContent()}
      </ExpandableCard>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseImage}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: theme.palette.text.primary
        }}>
          {selectedImage?.description || 'Gallery Image'}
          <IconButton onClick={handleCloseImage}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {selectedImage && (
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '70vh',
              backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#424242',
              overflow: 'hidden',
              pb: 2,
              px: 2
            }}>
              <Box
                component="img"
                src={selectedImage.url}
                alt={selectedImage.description}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 1
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GalleryCarousel; 