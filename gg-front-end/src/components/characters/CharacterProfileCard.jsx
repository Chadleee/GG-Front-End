import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  useTheme,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../../contexts/MemberContext';
import Portrait from '../Portrait';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';

function CharacterProfileCard({ character }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { members } = useMembers();

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

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id == memberId);
    return member ? member.name : 'Unknown Member';
  };

  return (
    <Card 
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ my: 2, p: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Portrait 
              src={getCharacterImage(character.name, character.image)}
              alt={character.name}
              size={160}
            />
          </Box>
          <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
          <Box sx={{ 
            mx: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            justifyContent: 'flex-start', 
            flexDirection: 'row',
            minHeight: '40px'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary,
                fontSize: '1.2rem'
              }}
            >
              Played by:
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.primary.main,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                '&:hover': {
                  opacity: 0.8,
                  textDecoration: 'underline',
                },
              }}
              onClick={() => navigate(`/members/${character.memberId}`)}
            >
              {getMemberName(character.memberId)}
            </Typography>
          </Box>
          <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
          <Box sx={{ mx: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
              Affiliations:
            </Typography>
            {character.affiliations && character.affiliations.map((affiliation) => (
              <Chip 
                key={affiliation}
                label={affiliation}
                sx={{ 
                  alignSelf: 'flex-start',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontSize: '1.1rem',
                  padding: '8px 16px'
                }}
              />
            ))}
          </Box>
          
          {/* Avatar Info Section */}
          {(character.avatarName || character.avatarDescription || character.avatarUrl) && (
            <>
              <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
              <Box sx={{ mx: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
                  Avatar Info:
                </Typography>
                {character.avatarName && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      '&:hover': {
                        opacity: 0.8,
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={() => window.open(character.avatarUrl || 'http://localhost:5173', '_blank')}
                  >
                    {character.avatarName}
                  </Typography>
                )}
                {character.avatarDescription && (
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
                    {character.avatarDescription}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CharacterProfileCard; 