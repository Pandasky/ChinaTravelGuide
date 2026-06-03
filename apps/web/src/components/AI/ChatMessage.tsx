import { Box, Paper, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export default function ChatMessage({ message, isTyping }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format content with markdown-like styling
  const formatContent = (content: string) => {
    // Split by newlines
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Bold text **text**
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet points
      if (line.startsWith('•') || line.startsWith('-')) {
        return (
          <Typography
            key={index}
            component="div"
            variant="body1"
            sx={{ ml: 2, mb: 0.5 }}
            dangerouslySetInnerHTML={{ __html: `• ${boldLine.substring(2)}` }}
          />
        );
      }
      // Headers (###)
      if (line.startsWith('###')) {
        return (
          <Typography
            key={index}
            variant="h6"
            sx={{ mt: 2, mb: 1, fontWeight: 600 }}
          >
            {line.replace('###', '').trim()}
          </Typography>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <Box key={index} sx={{ height: 8 }} />;
      }
      // Regular text
      return (
        <Typography
          key={index}
          component="div"
          variant="body1"
          sx={{ mb: 0.5 }}
          dangerouslySetInnerHTML={{ __html: boldLine }}
        />
      );
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexDirection: isUser ? 'row-reverse' : 'row',
        mb: 3,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 36,
          height: 36,
          backgroundColor: isUser ? '#2C3E50' : '#E67E22',
          flexShrink: 0,
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
      </Avatar>

      {/* Message Content */}
      <Box sx={{ maxWidth: '80%', flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: isUser ? '#2C3E50' : '#F8F9FA',
            color: isUser ? 'white' : '#333333',
            borderRadius: 2,
            border: !isUser ? '1px solid #DEE2E6' : 'none',
          }}
        >
          {isTyping ? (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', py: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#E67E22',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0s',
                  '@keyframes bounce': {
                    '0%, 80%, 100%': { transform: 'scale(0)' },
                    '40%': { transform: 'scale(1)' },
                  },
                }}
              />
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#E67E22',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.16s',
                }}
              />
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#E67E22',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.32s',
                }}
              />
            </Box>
          ) : (
            <Box>{formatContent(message.content)}</Box>
          )}
        </Paper>

        {/* Message Actions (only for AI) */}
        {!isUser && !isTyping && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 1,
              ml: 1,
            }}
          >
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
              <IconButton size="small" onClick={handleCopy} sx={{ color: '#6C757D' }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Helpful">
              <IconButton size="small" sx={{ color: '#6C757D' }}>
                <ThumbUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Not helpful">
              <IconButton size="small" sx={{ color: '#6C757D' }}>
                <ThumbDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
}
