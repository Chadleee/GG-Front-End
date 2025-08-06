import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandableCard from '../shared/ExpandableCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { seasons } from '../../shared/lists/seasons';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';

  function MemberCharacters({ memberCharacters, theme }) {
    const navigate = useNavigate();

    // Function to determine if infinite scrolling should be enabled
    const shouldEnableInfinite = () => {
      const width = window.innerWidth;
      let slidesToShow = 5; // default
      
      if (width <= 480) {
        slidesToShow = 1;
      } else if (width <= 768) {
        slidesToShow = 2;
      } else if (width <= 1024) {
        slidesToShow = 3;
      } else if (width <= 1200) {
        slidesToShow = 4;
      }
      
      return sortedCharacters.length > slidesToShow;
    };

    const getCharacterImage = (characterName, imageUrl) => {
    switch (characterName) {
      case 'Shabammabop':
        return shabammabop;
      case 'Crazy Girl':
        return crazyGirl;
      case 'Joe Biden':
        return joeBiden;
      case 'Jigsaw':
        return jigsaw;
      case 'Roflgator':
        return roflgator;
      case 'Steven':
        return steven;
      case 'Gas Station Employee':
        return gasStationEmployee;
      case 'Marcus':
        return marcus;
      default:
        return imageUrl;
    }
  };

  const getLatestSeason = (characterSeasons) => {
    if (!characterSeasons || characterSeasons.length === 0) return null;
    
    // Find the season that appears furthest down in the seasons list
    let latestSeason = null;
    let latestIndex = -1;
    
    characterSeasons.forEach(season => {
      const seasonIndex = seasons.indexOf(season);
      if (seasonIndex > latestIndex) {
        latestIndex = seasonIndex;
        latestSeason = season;
      }
    });
    
    return latestSeason;
  };

  const getLatestSeasonIndex = (characterSeasons) => {
    if (!characterSeasons || characterSeasons.length === 0) return -1;
    
    // Find the season that appears furthest down in the seasons list
    let latestIndex = -1;
    
    characterSeasons.forEach(season => {
      const seasonIndex = seasons.indexOf(season);
      if (seasonIndex > latestIndex) {
        latestIndex = seasonIndex;
      }
    });
    
    return latestIndex;
  };

  // Sort characters by their latest season (latest seasons first), then alphabetically
  const sortedCharacters = [...memberCharacters].sort((a, b) => {
    const aLatestIndex = getLatestSeasonIndex(a.seasons);
    const bLatestIndex = getLatestSeasonIndex(b.seasons);
    
    // Characters with no seasons appear last
    if (aLatestIndex === -1 && bLatestIndex === -1) {
      // Both have no seasons - sort alphabetically
      return (a.displayName || a.name).localeCompare(b.displayName || b.name);
    }
    if (aLatestIndex === -1) return 1;
    if (bLatestIndex === -1) return -1;
    
    // If same season, sort alphabetically
    if (aLatestIndex === bLatestIndex) {
      return (a.displayName || a.name).localeCompare(b.displayName || b.name);
    }
    
    // Sort by latest season index (descending - latest first)
    return bLatestIndex - aLatestIndex;
  });

  return (
    <Box sx={{ mt: 4 }}>
      <ExpandableCard 
        title="Characters Played"
        defaultExpanded={false}
      >
        {sortedCharacters.length > 0 ? (
          <Box sx={{ px: 2, py: 1, '& .slick-dots li button:before': { color: '#FFFFFF !important' }, '& .slick-dots li.slick-active button:before': { color: '#FFFFFF !important' } }}>
            <Slider
              dots={shouldEnableInfinite()}
              infinite={shouldEnableInfinite()}
              speed={500}
              slidesToShow={5}
              slidesToScroll={5}
              responsive={[
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                  }
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow:3,
                    slidesToScroll: 3,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }
                }
              ]}
            >
              {sortedCharacters.map((character) => (
                <Box 
                  key={character.id}
                  sx={{ 
                    width: '100%',
                    display: 'flex', 
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                  onClick={() => navigate(`/characters/${character.id}`)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar 
                      src={getCharacterImage(character.name, character.image)} 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mb: 1,
                        border: `3px solid ${theme.palette.primary.main}`,
                        boxShadow: theme.shadows[4]
                      }}
                    />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                        textAlign: 'center',
                        fontWeight: 'medium',
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0.5
                      }}
                    >
                      {character.displayName || character.name}
                    </Typography>
                    {getLatestSeason(character.seasons) && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary,
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          maxWidth: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {getLatestSeason(character.seasons)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary }}>
            No characters played yet.
          </Typography>
        )}
      </ExpandableCard>
    </Box>
  );
}

export default MemberCharacters; 