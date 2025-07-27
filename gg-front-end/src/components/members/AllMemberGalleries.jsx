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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useMembers } from '../../contexts/MemberContext';
import { useNavigate, useParams } from 'react-router-dom';

function AllMemberGalleries() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { members } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Get images for the specific member
  const getMemberImages = () => {
    const member = members.find(m => m.id.toString() === id);
    if (!member || !member.gallery) return [];
    
    return member.gallery.map(image => ({
      ...image,
      memberName: member.displayName || member.name,
      memberId: member.id
    }));
  };

  const memberImages = getMemberImages();

  // Filter images based on search term
  const filteredImages = memberImages.filter(image => {
    return image.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleCloseImage = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {members.find(m => m.id.toString() === id)?.displayName || members.find(m => m.id.toString() === id)?.name || 'Member'} Gallery
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
          placeholder="Search images..."
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
        {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} found
      </Typography>

      {/* Images Grid */}
      {filteredImages.length > 0 ? (
        <Grid container spacing={3}>
          {filteredImages.map((image, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card 
                sx={{ 
                  height: '300px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
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
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.6rem',
                        opacity: 0.8,
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 1,
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/members/${image.memberId}`);
                      }}
                    >
                      {image.memberName}
                    </Typography>
                  </Box>
                </Box>
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
            No images found
          </Typography>
        </Box>
      )}

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
    </Box>
  );
}

export default AllMemberGalleries; 