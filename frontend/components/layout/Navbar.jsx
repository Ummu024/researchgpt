'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, IconButton, InputBase, Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography, useMediaQuery } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useAuth } from '../../app/context/AuthContext';
import { useSnackbar } from 'notistack';
import { DRAWER_WIDTH } from './Sidebar';

export default function Navbar({ onMenuClick }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
    router.push('/login');
  };

  return (
    <AppBar
      position="fixed" elevation={0}
      sx={{
        width: isDesktop ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        ml: isDesktop ? `${DRAWER_WIDTH}px` : 0,
        bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {!isDesktop && <IconButton edge="start" onClick={onMenuClick}><MenuRoundedIcon /></IconButton>}

        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: alpha(theme.palette.common.white, 0.05), borderRadius: 2, px: 1.5, flexGrow: 1, maxWidth: 420 }}>
          <SearchRoundedIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
          <InputBase placeholder="Search papers, chats, reviews…" fullWidth sx={{ py: 1, fontSize: 14 }} />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 15 }}>{initials}</Avatar>
        </IconButton>

        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>{user?.name || 'Researcher'}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email || ''}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); router.push('/profile'); }}>
            <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); router.push('/settings'); }}>
            <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}