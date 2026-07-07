'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, IconButton, Stack, Avatar, CircularProgress } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';

export default function AIChatPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! Ask me anything about your uploaded papers.' }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setInput('');
    setSending(true);
    // TODO: replace with real POST /api/chat call to the RAG backend
    await new Promise((r) => setTimeout(r, 900));
    setMessages((prev) => [...prev, { role: 'assistant', text: 'This is a placeholder response — RAG pipeline integration comes in a later phase.' }]);
    setSending(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>AI Chat</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Chat with your research papers using RAG.</Typography>

      <Paper sx={{ flexGrow: 1, p: 3, overflowY: 'auto', mb: 2 }}>
        <Stack spacing={2}>
          {messages.map((m, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 1 }}><ScienceRoundedIcon fontSize="small" /></Avatar>
              )}
              <Box sx={{ maxWidth: '70%', px: 2, py: 1.2, borderRadius: 3, bgcolor: m.role === 'user' ? 'primary.main' : 'rgba(255,255,255,0.06)', color: m.role === 'user' ? '#fff' : 'text.primary' }}>
                <Typography variant="body2">{m.text}</Typography>
              </Box>
            </Box>
          ))}
          {sending && <CircularProgress size={20} />}
          <div ref={bottomRef} />
        </Stack>
      </Paper>

      <Paper sx={{ p: 1.5, display: 'flex', gap: 1 }}>
        <TextField fullWidth placeholder="Ask a question about your papers…" size="small" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
        <IconButton color="primary" onClick={handleSend} disabled={sending}><SendRoundedIcon /></IconButton>
      </Paper>
    </Box>
  );
}