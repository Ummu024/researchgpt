'use client';
import { useState } from 'react';
import { Box, Typography, Paper, Avatar, TextField, Button, Grid } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';

export default function ProfilePage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    // TODO: replace with real PUT /api/users/profile call
    enqueueSnackbar('Profile updated', { variant: 'success' });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Profile</Typography>
      <Paper sx={{ p: 4, maxWidth: 560 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28 }}>{(name || 'U').charAt(0).toUpperCase()}</Avatar>
          <Box>
            <Typography variant="h6">{name || 'Researcher'}</Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Email" value={user?.email || ''} disabled /></Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave}>Save Changes</Button>
      </Paper>
    </Box>
  );
}