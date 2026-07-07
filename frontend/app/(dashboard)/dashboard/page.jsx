'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Card, CardContent, Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Skeleton, Stack } from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';

const statCards = [
  { label: 'Total Papers', value: 24, icon: <DescriptionRoundedIcon />, color: '#7C4DFF' },
  { label: 'Chat Sessions', value: 58, icon: <ChatRoundedIcon />, color: '#00E5FF' },
  { label: 'Reviews Generated', value: 6, icon: <MenuBookRoundedIcon />, color: '#22C55E' },
  { label: 'Gaps Identified', value: 12, icon: <TravelExploreRoundedIcon />, color: '#F59E0B' },
];

const recentPapersMock = [
  { title: 'Attention Is All You Need', status: 'Processed', date: '2026-07-01' },
  { title: 'Deep Residual Learning', status: 'Processing', date: '2026-06-29' },
  { title: 'BERT: Pre-training Deep Bidirectional Transformers', status: 'Processed', date: '2026-06-24' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: replace with real GET /api/dashboard/stats and /api/papers/recent
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Welcome back 👋</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Here's what's happening with your research today.</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton variant="circular" width={44} height={44} sx={{ mb: 2 }} />
                    <Skeleton width="60%" height={32} />
                    <Skeleton width="80%" />
                  </>
                ) : (
                  <>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, bgcolor: `${s.color}22`, color: s.color }}>
                      {s.icon}
                    </Box>
                    <Typography variant="h4">{s.value}</Typography>
                    <Typography color="text.secondary" variant="body2">{s.label}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Papers</Typography>
            {loading ? (
              <Stack spacing={1.5}>{[...Array(3)].map((_, i) => <Skeleton key={i} height={40} />)}</Stack>
            ) : (
              <Table>
                <TableHead>
                  <TableRow><TableCell>Title</TableCell><TableCell>Status</TableCell><TableCell>Date</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {recentPapersMock.map((p) => (
                    <TableRow key={p.title} hover>
                      <TableCell>{p.title}</TableCell>
                      <TableCell><Chip label={p.status} size="small" color={p.status === 'Processed' ? 'success' : 'warning'} variant="outlined" /></TableCell>
                      <TableCell>{p.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Stack spacing={1.5}>
              <Button fullWidth variant="contained" startIcon={<UploadFileRoundedIcon />} onClick={() => router.push('/upload')}>Upload Paper</Button>
              <Button fullWidth variant="outlined" startIcon={<ChatRoundedIcon />} onClick={() => router.push('/chat')}>Start AI Chat</Button>
              <Button fullWidth variant="outlined" startIcon={<MenuBookRoundedIcon />} onClick={() => router.push('/literature-review')}>Generate Review</Button>
              <Button fullWidth variant="outlined" startIcon={<TravelExploreRoundedIcon />} onClick={() => router.push('/research-gap')}>Find Research Gaps</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}