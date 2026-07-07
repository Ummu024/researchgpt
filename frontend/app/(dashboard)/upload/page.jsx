'use client';
import { useState, useCallback } from 'react';
import { Box, Paper, Typography, Button, LinearProgress, Stack, Chip } from '@mui/material';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import { useSnackbar } from 'notistack';

export default function UploadPaperPage() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).filter((f) => f.type === 'application/pdf');
    if (arr.length === 0) {
      enqueueSnackbar('Only PDF files are supported', { variant: 'warning' });
      return;
    }
    setFiles((prev) => [...prev, ...arr]);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    // TODO: replace with real POST /api/papers/upload (multipart/form-data)
    await new Promise((r) => setTimeout(r, 1200));
    setUploading(false);
    enqueueSnackbar('Paper(s) uploaded successfully', { variant: 'success' });
    setFiles([]);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Upload Paper</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Add PDFs to your library so you can chat, compare, and analyze them.</Typography>

      <Paper
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        sx={{ p: 6, textAlign: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: dragActive ? 'primary.main' : 'rgba(255,255,255,0.12)', bgcolor: dragActive ? 'rgba(124,77,255,0.06)' : 'background.paper', transition: 'all 0.2s ease' }}
      >
        <UploadFileRoundedIcon sx={{ fontSize: 48, color: 'primary.light', mb: 2 }} />
        <Typography variant="h6">Drag & drop PDF files here</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>or</Typography>
        <Button variant="contained" component="label">
          Browse Files
          <input type="file" hidden multiple accept="application/pdf" onChange={(e) => handleFiles(e.target.files)} />
        </Button>
      </Paper>

      {files.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Selected Files</Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {files.map((f, i) => (
              <Chip key={i} label={f.name} onDelete={() => setFiles((p) => p.filter((_, idx) => idx !== i))} />
            ))}
          </Stack>
          {uploading && <LinearProgress sx={{ mb: 2 }} />}
          <Button variant="contained" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading…' : `Upload ${files.length} file(s)`}
          </Button>
        </Paper>
      )}
    </Box>
  );
}