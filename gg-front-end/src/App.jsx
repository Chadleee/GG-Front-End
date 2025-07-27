import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container, Switch, IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import logo from './assets/tnc_logo.jpg';

import Home from './components/Home';
import Characters from './components/characters/Characters';
import CharacterDetail from './components/characters/CharacterDetail';
import AllCharacterVideos from './components/characters/AllCharacterVideos';
import AllCharacterGalleries from './components/characters/AllCharacterGalleries';
import Members from './components/members/Members';
import MemberDetail from './components/members/MemberDetail';
import AllMemberVideos from './components/members/AllMemberVideos';
import AllMemberGalleries from './components/members/AllMemberGalleries';
import { useColorMode } from './components/ThemeProvider';
import { UserProvider } from './contexts/UserContext';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleColorMode, mode } = useColorMode();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (location.pathname === '/') {
      setValue(0);
    }
    else if (location.pathname.startsWith('/members')) {
      setValue(1);
    }
    else if (location.pathname.startsWith('/characters')) {
      setValue(2);
    }
  }, [location.pathname]);

  const handleChange = (e, newValue) => {
    setValue(newValue);
    const routes = ['/', '/members', '/characters'];
    navigate(routes[newValue]);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', py: 0 }}>
          <Box component="img" src={logo} alt="App Logo" sx={{ width: '100%', maxWidth: '1200px' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', py: 0 }}>
          <Box sx={{maxWidth: '1200px', margin: '0 auto', width: '100%',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', py: 0}}>
            <Tabs 
              value={value} 
              onChange={handleChange}
              sx={{ 
                '& .MuiTab-root': { 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': { 
                    color: 'white',
                    border: 'none',
                    outline: 'none'
                  },
                  '&:focus': {
                    outline: 'none',
                    border: 'none'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: '2px'
                }
              }}
            >
              <Tab label="Home" onClick={() => navigate('/')} />
              <Tab label="Members" onClick={() => navigate('/members')} />
              <Tab label="Characters" onClick={() => navigate('/characters')} />
            </Tabs>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <LightMode sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
            <Switch
              checked={mode === 'dark'}
              onChange={toggleColorMode}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'white',
                },
                '& .MuiSwitch-switchBase': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            />
            <DarkMode sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
          </Box>
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Container sx={{ mt: 4 }}>
          <Box sx={{maxWidth: '1200px', margin: '0 auto'}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/characters/:id" element={<CharacterDetail />} />
              <Route path="/characters/:id/videos" element={<AllCharacterVideos />} />
              <Route path="/characters/:id/galleries" element={<AllCharacterGalleries />} />
              <Route path="/members" element={<Members />} />
              <Route path="/members/:id" element={<MemberDetail />} />
              <Route path="/members/:id/videos" element={<AllMemberVideos />} />
              <Route path="/members/:id/galleries" element={<AllMemberGalleries />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
