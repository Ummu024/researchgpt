"use client";

import { useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Paper as MuiPaper,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useRouter } from "next/navigation";
import { uploadPaper } from "@/lib/papersApi";
import { formatBytes } from "@/lib/formatBytes";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_TYPE = "application/pdf";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const router = useRouter();

  const validateFile = (file) => {
    if (!file) return "No file selected.";
    if (file.type !== ACCEPTED_TYPE || !file.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF files are allowed.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File exceeds the maximum allowed size of 25MB.";
    }
    return "";
  };

  const handleFile = (file) => {
    setSuccess("");
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    setSuccess("");
    setProgress(0);

    try {
      await uploadPaper(selectedFile, setProgress);
      setSuccess("Paper uploaded successfully.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        router.push("/papers");
      }, 800);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Upload failed. Please try again.";
      setError(message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", py: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Upload Research Paper
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        PDF files only, up to 25MB.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <MuiPaper
        variant="outlined"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        sx={{
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "divider",
          bgcolor: isDragging ? "action.hover" : "background.paper",
          borderRadius: 2,
          p: 5,
          textAlign: "center",
          cursor: uploading ? "default" : "pointer",
          transition: "border-color 0.2s ease, background-color 0.2s ease",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleInputChange}
          disabled={uploading}
        />
        <UploadFileIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
        <Typography variant="body1">
          Drag & drop a PDF here, or click to browse
        </Typography>
      </MuiPaper>

      {selectedFile && (
        <MuiPaper
          variant="outlined"
          sx={{
            mt: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PictureAsPdfIcon color="error" />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatBytes(selectedFile.size)}
              </Typography>
            </Box>
          </Stack>
          {!uploading && (
            <IconButton size="small" onClick={handleRemoveSelected}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </MuiPaper>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="text.secondary">
            {progress}%
          </Typography>
        </Box>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload Paper"}
        </Button>
        {selectedFile && !uploading && (
          <Button variant="text" onClick={handleRemoveSelected}>
            Cancel
          </Button>
        )}
      </Stack>
    </Box>
  );
}