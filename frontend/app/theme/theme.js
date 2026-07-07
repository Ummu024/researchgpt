'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C4DFF', light: '#B388FF', dark: '#5E35B1' },
    secondary: { main: '#00E5FF' },
    background: { default: '#0F1117', paper: '#171923' },
    text: { primary: '#E8E9ED', secondary: '#9AA0AC' },
    success: { main: '#22C55E' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.06)' } } },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(124,77,255,0.15)' },
        },
      },
    },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: '#141620', borderRight: '1px solid rgba(255,255,255,0.06)' } } },
  },
});

export default theme;