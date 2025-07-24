import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Avatar, 
  Typography, 
  Button, 
  Chip,
  useTheme,
  Box
} from '@mui/material';
import { useMembers } from '../../contexts/MemberContext';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';

function CharacterCard({ character }) {
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
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };

  const handleViewDetails = () => {
    navigate(`/characters/${character.id}`);
  };

  return (
    <Card 
      onClick={handleViewDetails}
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#666666' : theme.palette.background.paper,
        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={getCharacterImage(character.name, character.image)} 
            sx={{ 
              width: 56, 
              height: 56, 
              mr: 2,
              border: `2px solid ${theme.palette.primary.main}`
            }}
          />
          <Box>
            <Typography variant="h6" component="h2" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
              {character.name}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
              {getMemberName(character.memberId)}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={character.affiliations} 
          sx={{ 
            mb: 1,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
          size="small"
        />
      </CardContent>
    </Card>
  );
}

export default CharacterCard; 