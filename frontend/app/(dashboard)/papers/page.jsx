"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { getPapers, deletePaper } from "@/lib/papersApi";
import { formatBytes } from "@/lib/formatBytes";

const STATUS_COLOR = {
  PENDING: "default",
  PROCESSING: "warning",
  COMPLETED: "success",
  FAILED: "error",
};

export default function PapersPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchPapers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPapers();
      setPapers(res.data);
    } catch (err) {
      setError("Failed to load papers. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDeleteConfirmed = async () => {
    if (!confirmTarget) return;
    const id = confirmTarget.id;
    setDeletingId(id);
    setError("");
    try {
      await deletePaper(id);
      setPapers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete paper. Please try again.");
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", py: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Your Papers
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {papers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No papers uploaded yet.
        </Typography>
      ) : (
        <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          {papers.map((paper, index) => (
            <Box key={paper.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    disabled={deletingId === paper.id}
                    onClick={() => setConfirmTarget(paper)}
                  >
                    {deletingId === paper.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                }
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mr: 2 }}>
                  <PictureAsPdfIcon color="error" />
                </Stack>
                <ListItemText
                  primary={paper.originalFilename}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatBytes(paper.fileSize)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        •
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(paper.uploadDate)}
                      </Typography>
                      <Chip
                        label={paper.processingStatus}
                        size="small"
                        color={STATUS_COLOR[paper.processingStatus] || "default"}
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Stack>
                  }
                />
              </ListItem>
              {index < papers.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      )}

      <Dialog open={!!confirmTarget} onClose={() => setConfirmTarget(null)}>
        <DialogTitle>Delete paper?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete{" "}
            <strong>{confirmTarget?.originalFilename}</strong>? This cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmTarget(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}