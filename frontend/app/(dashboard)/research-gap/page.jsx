'use client';
import { useState } from 'react';
import { Box, Typography, Paper, Button, Autocomplete, TextField, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';

const paperOptions = ['Attention Is All You Need', 'Deep Residual Learning for Image Recognition', 'BERT: Pre-training Deep Bidirectional Transformers', 'Generative Adversarial Networks'];

export default function ResearchGapPage() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState([]);

  const handleAnalyze = async () => {
    setLoading(true);
    setGaps([]);
    // TODO: replace with real POST /api/research-gap call
    await new Promise((r) => setTimeout(r, 1500));
    setGaps([
      'Limited evaluation on low-resource languages across the selected papers.',
      'Few papers address computational cost trade-offs at inference time.',
      'Reproducibility details for hyperparameter tuning are sparse.',
    ]);
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Research Gap Analysis</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Discover under-explored areas across a set of papers.</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Autocomplete multiple options={paperOptions} value={selected} onChange={(e, val) => setSelected(val)} renderInput={(params) => <TextField {...params} label="Select papers" placeholder="Choose papers" />} />
        <Button variant="contained" startIcon={<TravelExploreRoundedIcon />} sx={{ mt: 2 }} disabled={selected.length === 0 || loading} onClick={handleAnalyze}>
          {loading ? 'Analyzing…' : 'Find Research Gaps'}
        </Button>
      </Paper>

      {loading && <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Paper>}

      {gaps.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Identified Gaps</Typography>
          <List>
            {gaps.map((g, i) => (
              <ListItem key={i}>
                <ListItemIcon sx={{ minWidth: 28 }}><FiberManualRecordRoundedIcon sx={{ fontSize: 8, color: 'warning.main' }} /></ListItemIcon>
                <ListItemText primary={g} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}