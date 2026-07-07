'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';

export const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/dashboard' },
  { label: 'Upload Paper', icon: <UploadFileRoundedIcon />, path: '/upload' },
  { label: 'My Papers', icon: <ArticleRoundedIcon />, path: '/papers' },
  { label: 'AI Chat', icon: <ChatRoundedIcon />, path: '/chat' },
  { label: 'Literature Review', icon: <MenuBookRoundedIcon />, path: '/literature-review' },
  { label: 'Research Gap', icon: <TravelExploreRoundedIcon />, path: '/research-gap' },
  { label: 'Profile', icon: <PersonRoundedIcon />, path: '/profile' },
  { label: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const pathname = usePathname();

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3 }}>
        <ScienceRoundedIcon color="primary" />
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>ResearchGPT</Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => {
                router.push(item.path);
                if (!isDesktop) onClose();
              }}
              sx={{
                borderRadius: 2, mb: 0.5,
                '&.Mui-selected': { bgcolor: 'rgba(124,77,255,0.15)', '&:hover': { bgcolor: 'rgba(124,77,255,0.22)' } },
              }}
            >
              <ListItemIcon sx={{ color: active ? 'primary.light' : 'text.secondary', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }} open>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer variant="temporary" open={mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
      {content}
    </Drawer>
  );
}