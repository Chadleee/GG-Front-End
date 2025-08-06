import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  useTheme,
  Tooltip,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Grid from '@mui/material/Grid';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import Portrait from '../Portrait';
import SocialsEditDialog from '../../shared/SocialsEditDialog';
import twitter_logo from '../../assets/twitter_logo.png';
import youtube_logo from '../../assets/youtube_logo.png';
import tiktok_logo from '../../assets/tiktok_logo.png';
import kick_logo from '../../assets/kick_logo.png';
import discord_logo from '../../assets/discord_logo.png';
import instagram_logo from '../../assets/instagram_logo.png';
import twitch_logo from '../../assets/twitch_logo.png';
import { useState } from 'react';

function MemberProfileCard({ member, canEdit = false, onSocialsUpdate, onJoinDateUpdate }) {
  const theme = useTheme();
  const [editSocialsOpen, setEditSocialsOpen] = useState(false);
  const [editingJoinDate, setEditingJoinDate] = useState(false);
  const [joinDateValue, setJoinDateValue] = useState(member.joinDate ? new Date(member.joinDate) : null);
  const [calendarOpen, setCalendarOpen] = useState(false);

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

  const handleEditSocials = () => {
    setEditSocialsOpen(true);
  };

  const handleCloseEditSocials = () => {
    setEditSocialsOpen(false);
  };

  const handleSaveSocials = async (updatedSocials) => {
    if (onSocialsUpdate) {
      await onSocialsUpdate(updatedSocials);
    }
  };

  const handleEditJoinDate = () => {
    setEditingJoinDate(true);
    setJoinDateValue(member.joinDate ? new Date(member.joinDate) : null);
    setCalendarOpen(true);
  };

  const handleSaveJoinDate = async () => {
    if (onJoinDateUpdate && joinDateValue) {
      const formattedDate = joinDateValue.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      await onJoinDateUpdate(formattedDate);
    }
    setEditingJoinDate(false);
    setCalendarOpen(false);
  };

  const handleCancelJoinDate = () => {
    setEditingJoinDate(false);
    setJoinDateValue(member.joinDate ? new Date(member.joinDate) : null);
    setCalendarOpen(false);
  };

  return (
    <>
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
                {member.socials && member.socials.length > 0 ? (
                  <>
                    {member.socials.map((social) => (
                      <Grid size={{ xs: 3 }} key={social.platform}>
                        <Tooltip title={social.platform}>
                          <Box component="img" src={getSocialLogo(social.platform)} sx={{ width: 30, height: 30, mx: 1, cursor: 'pointer', borderRadius: '20%' }} onClick={() => window.open(social.url, '_blank')} />
                        </Tooltip>
                      </Grid>
                    ))}
                    {canEdit && (
                      <Grid size={{ xs: 3 }}>
                        <Tooltip title="Edit Social Links">
                          <IconButton
                            size="small"
                            onClick={handleEditSocials}
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              mx: 1,
                              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
                              borderRadius: '20%'
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        No social links available
                      </Typography>
                      {canEdit && (
                        <Tooltip title="Add Social Links">
                          <IconButton
                            size="small"
                            onClick={handleEditSocials}
                            sx={{ 
                              color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                              border: `1px solid ${theme.palette.mode === 'light' ? '#888888' : '#333333'}`,
                              borderRadius: '20%'
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
            <Divider sx={{ borderWidth: 1, borderColor: theme.palette.mode === 'light' ? '#888888' : '#FFF', my: 2 }} />
            <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary, mx: 2, mb: 1 }}>
              Join Date:
            </Typography>
            {editingJoinDate ? (
              <Box sx={{ mx: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={joinDateValue}
                    onChange={(newValue) => setJoinDateValue(newValue)}
                    open={calendarOpen}
                    onOpen={() => setCalendarOpen(true)}
                    onClose={() => setCalendarOpen(false)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        placeholder: 'Select date',
                        readOnly: true,
                        onClick: () => setCalendarOpen(true),
                        sx: {
                          '& .MuiInputBase-root': {
                            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                            backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary,
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
                <Tooltip title="Save">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={handleSaveJoinDate}
                    disabled={!joinDateValue}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleCancelJoinDate}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{ mx: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary }}>
                  {member.joinDate || 'Not specified'}
                </Typography>
                {canEdit && (
                  <Tooltip title="Edit Join Date">
                    <IconButton
                      size="small"
                      onClick={handleEditJoinDate}
                      sx={{ 
                        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>

        </CardContent>
      </Card>

      <SocialsEditDialog
        open={editSocialsOpen}
        onClose={handleCloseEditSocials}
        onSave={handleSaveSocials}
        socials={member.socials || []}
        title="Edit Social Links"
      />
    </>
  );
}

export default MemberProfileCard; 