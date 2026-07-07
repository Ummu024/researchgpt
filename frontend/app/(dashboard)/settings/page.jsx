'use client';
import { useState } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Divider, Stack } from '@mui/material';

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoSummary, setAutoSummary] = useState(true);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>
      <Paper sx={{ p: 4, maxWidth: 560 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Preferences</Typography>
        <Stack spacing={1}>
          <FormControlLabel control={<Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />} label="Email notifications for processed papers" />
          <FormControlLabel control={<Switch checked={autoSummary} onChange={(e) => setAutoSummary(e.target.checked)} />} label="Auto-generate summary on upload" />
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography color="text.secondary" variant="body2">More configuration options (API keys, export preferences) will be added in later phases.</Typography>
      </Paper>
    </Box>
  );
}