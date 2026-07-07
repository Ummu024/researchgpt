'use client';
import { useState } from 'react';
import { Box, Typography, Paper, Button, Autocomplete, TextField, CircularProgress, Divider } from '@mui/material';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

const paperOptions = ['Attention Is All You Need', 'Deep Residual Learning for Image Recognition', 'BERT: Pre-training Deep Bidirectional Transformers', 'Generative Adversarial Networks'];

export default function LiteratureReviewPage() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setReview('');
    // TODO: replace with real POST /api/literature-review call
    await new Promise((r) => setTimeout(r, 1500));
    setReview(`This is a placeholder literature review summarizing ${selected.length} selected paper(s). Real generation will be wired up in a later phase.`);
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Literature Review</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Select papers and generate an AI-written literature review.</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Autocomplete multiple options={paperOptions} value={selected} onChange={(e, val) => setSelected(val)} renderInput={(params) => <TextField {...params} label="Select papers" placeholder="Choose papers" />} />
        <Button variant="contained" startIcon={<MenuBookRoundedIcon />} sx={{ mt: 2 }} disabled={selected.length === 0 || loading} onClick={handleGenerate}>
          {loading ? 'Generating…' : 'Generate Review'}
        </Button>
      </Paper>

      {loading && <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Paper>}

      {review && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Generated Review</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography color="text.secondary">{review}</Typography>
        </Paper>
      )}
    </Box>
  );
}