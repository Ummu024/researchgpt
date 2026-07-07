'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Paper, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../services/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/login', { email, password });
      login(data.token, { name: data.name, email: data.email });
      enqueueSnackbar('Welcome back!', { variant: 'success' });
      router.push('/dashboard');
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Invalid email or password', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Paper elevation={0} sx={{ p: 5, width: '100%', maxWidth: 420, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ScienceRoundedIcon color="primary" fontSize="large" />
          <Typography variant="h5">ResearchGPT</Typography>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Sign in to continue your research</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            fullWidth label="Password" margin="normal" type={showPassword ? 'text' : 'password'}
            value={password} onChange={(e) => setPassword(e.target.value)} required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, py: 1.2 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}