'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Skeleton, Stack, TextField, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

const mockPapers = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', status: 'Processed', date: '2026-07-01' },
  { id: 2, title: 'Deep Residual Learning for Image Recognition', authors: 'He et al.', status: 'Processing', date: '2026-06-29' },
  { id: 3, title: 'BERT: Pre-training Deep Bidirectional Transformers', authors: 'Devlin et al.', status: 'Processed', date: '2026-06-24' },
  { id: 4, title: 'Generative Adversarial Networks', authors: 'Goodfellow et al.', status: 'Processed', date: '2026-06-20' },
];

export default function MyPapersPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: replace with real GET /api/papers
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = mockPapers.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>My Papers</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>All the papers you've uploaded to ResearchGPT.</Typography>

      <TextField
        placeholder="Search your papers…" value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 360 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
      />

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Stack spacing={1.5}>{[...Array(4)].map((_, i) => <Skeleton key={i} height={48} />)}</Stack>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell><TableCell>Authors</TableCell><TableCell>Status</TableCell><TableCell>Date</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.authors}</TableCell>
                  <TableCell><Chip size="small" label={p.status} variant="outlined" color={p.status === 'Processed' ? 'success' : 'warning'} /></TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary"><ChatRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error"><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}