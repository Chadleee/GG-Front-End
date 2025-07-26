import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandableCard from '../../shared/ExpandableCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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
      
      return memberCharacters.length > slidesToShow;
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
  console.log(memberCharacters);

  return (
    <Box sx={{ mt: 4 }}>
      <ExpandableCard 
        title="Characters Played"
        defaultExpanded={true}
      >
        {memberCharacters.length > 0 ? (
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
              {memberCharacters.map((character) => (
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
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {character.displayName || character.name}
                    </Typography>
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