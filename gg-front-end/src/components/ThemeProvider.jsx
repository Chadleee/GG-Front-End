// src/ThemeProvider.jsx
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, useState, createContext, useContext } from 'react';

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export default function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  const colorMode = {
    mode,
    toggleColorMode: () => {
      setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    },
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Black, White, and Grey Theme
          primary: {
            main: mode === 'light' ? '#666666' : '#ffffff', // Medium grey in light, white in dark
            light: mode === 'light' ? '#888888' : '#f5f5f5', // Lighter grey / Light grey
            dark: mode === 'light' ? '#444444' : '#e0e0e0', // Darker grey / Medium grey
            contrastText: mode === 'light' ? '#ffffff' : '#000000', // White text on grey / Black text on white
          },
          secondary: {
            main: mode === 'light' ? '#000000' : '#000000', // Black in both modes
            light: mode === 'light' ? '#333333' : '#333333', // Dark grey
            dark: mode === 'light' ? '#1a1a1a' : '#1a1a1a', // Very dark grey
            contrastText: '#ffffff', // White text on black
          },
          // Background colors
          background: {
            default: mode === 'light' ? '#d3d3d3' : '#121212', // Light grey / Dark grey
            paper: mode === 'light' ? '#d3d3d3' : '#1e1e1e',   // White / Dark grey
          },
          // Text colors
          text: {
            primary: mode === 'light' ? '#000000' : '#ffffff',   // Black / White
            secondary: mode === 'light' ? '#666666' : '#b0b0b0', // Medium grey / Light grey
          },
          // AppBar colors
          appBar: {
            main: mode === 'light' ? '#666666' : '#1e1e1e', // Medium grey / Dark grey
          },
        },
        // Custom component styles
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#666666' : '#1e1e1e', // Medium grey / Dark grey
                color: '#ffffff', // White text in both modes
                borderBottom: mode === 'light' ? '1px solid #888888' : '1px solid #333333',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                color: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white in both modes
                '&.Mui-selected': {
                  color: '#ffffff', // White when selected
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                border: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333333',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                '&.MuiButton-containedPrimary': {
                  backgroundColor: mode === 'light' ? '#666666' : '#ffffff',
                  color: mode === 'light' ? '#ffffff' : '#000000',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? '#888888' : '#f5f5f5',
                  },
                },
                '&.MuiButton-containedSecondary': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
