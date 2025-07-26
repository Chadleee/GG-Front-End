import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  useTheme,
  Tooltip,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Portrait from '../Portrait';
import twitter_logo from '../../assets/twitter_logo.png';
import youtube_logo from '../../assets/youtube_logo.png';
import tiktok_logo from '../../assets/tiktok_logo.png';
import kick_logo from '../../assets/kick_logo.png';
import discord_logo from '../../assets/discord_logo.png';
import instagram_logo from '../../assets/instagram_logo.png';
import twitch_logo from '../../assets/twitch_logo.png';

function MemberProfileCard({ member }) {
  const theme = useTheme();

  const getSocialLogo = (socialName) => {
    switch (socialName) {
      case 'Twitter':
        return twitter_logo;
      case 'X':
        return twitter_logo;
      case 'YouTube VODs':
        return youtube_logo;
      case 'YouTube Archives':
        return youtube_logo;
      case 'YouTube':
        return youtube_logo;
      case 'TikTok':
        return tiktok_logo;
      case 'Kick':
        return kick_logo;
      case 'Discord':
        return discord_logo;
      case 'Instagram':
        return instagram_logo;
      case 'Twitch':
        return twitch_logo;
      default:
        return null;
    }
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

        <Box sx={{ my:2, p: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Portrait 
              src={member.image}
              alt={member.name}
              size={160}
            />
          </Box>
          <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', mx: 2 }}>
            <Grid container spacing={2}>
              {member.socials.map((social) => (
                <Grid size={{ xs: 3 }} key={social.id}>
                  <Tooltip title={social.platform}>
                    <Box component="img" src={getSocialLogo(social.platform)} sx={{ width: 30, height: 30, mx: 1, cursor: 'pointer', borderRadius: '20%' }} onClick={() => window.open(social.url, '_blank')} />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
          <Box sx={{ mx: 2, display: 'flex', alignItems: 'left', gap: 1, justifyContent: 'left', flexDirection: 'row' }}>
            <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary }}>
              Join Date:
            </Typography>
            <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
              {member.joinDate}
            </Typography>
          </Box>
        </Box>

      </CardContent>
    </Card>
  );
}

export default MemberProfileCard; 