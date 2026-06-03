import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  IconButton,
  Button,
  Typography,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChatMessage from '../../components/AI/ChatMessage';
import Layout from '../../components/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

// Mock data for chat history
const mockChatHistory: ChatSession[] = [
  {
    id: '1',
    title: 'Beijing Great Wall tips',
    lastMessage: 'The Mutianyu section is less crowded...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    messageCount: 8,
  },
  {
    id: '2',
    title: 'Shanghai restaurant recommendations',
    lastMessage: 'You should try the soup dumplings at...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 12,
  },
  {
    id: '3',
    title: 'Chinese phrases for taxi',
    lastMessage: 'Say "Qù zhèlǐ" to say "Go here"...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 6,
  },
];

// Quick prompt suggestions
const quickPrompts = [
  "What's the best time to visit the Great Wall?",
  "How do I get from Beijing Airport to the city?",
  "Where can I find authentic dim sum in Shanghai?",
  "Translate 'I am vegetarian' to Chinese",
  "What should I pack for a trip to China in October?",
  "Recommend a 3-day itinerary for Xi'an",
];

// AI System prompt for China travel
const SYSTEM_PROMPT = `You are ChinaWise AI, a helpful travel assistant specialized in China travel. You provide accurate, up-to-date information about:
- Tourist attractions (hours, prices, best times)
- Restaurants and local cuisine
- Transportation (subway, bus, taxi, high-speed rail)
- Hotels and accommodations
- Chinese language translation and pronunciation
- Cultural etiquette and customs
- Emergency information

Keep responses concise, friendly, and practical. Use bullet points for lists. Include relevant Chinese characters and pinyin when helpful.`;

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your China travel assistant. I can help you with anything about traveling in China - from finding the best restaurants to navigating the subway system. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // TODO: Integrate with OpenRouter API
    // For now, simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('great wall')) {
      return "The Great Wall has several sections near Beijing:\n\n**Mutianyu** (Recommended)\n• Less crowded, great views\n• Cable car and toboggan ride\n• About 1.5 hours from city center\n\n**Badaling**\n• Most famous but very crowded\n• Fully restored\n• Closest to Beijing\n\n**Jinshanling**\n• Popular for hiking\n• Partially restored, more authentic\n• 2-3 hours from Beijing\n\nI recommend Mutianyu for the best experience. Would you like directions on how to get there?";
    }
    if (lowerInput.includes('vegetarian') || lowerInput.includes('vegan')) {
      return "To say **'I am vegetarian'** in Chinese:\n\n**Wǒ chī sù** (我吃素)\n\nPronunciation: *Waw chrr soo*\n\nOther useful phrases:\n• **Wǒ bù chī ròu** (我不吃肉) - I don't eat meat\n• **Yǒu sùshí ma?** (有素食吗?) - Do you have vegetarian food?\n• **Wǒ bù chī hǎixiān** (我不吃海鲜) - I don't eat seafood\n\nWould you like me to teach you more food-related phrases?";
    }
    if (lowerInput.includes('airport') || lowerInput.includes('transport')) {
      return "From Beijing Capital Airport (PEK) to city center:\n\n**Airport Express Train** (Recommended)\n• ¥25 per person\n• 20-30 minutes to Dongzhimen\n• Connects to subway lines 2 and 13\n\n**Taxi**\n• ¥100-150 depending on traffic\n• 45-90 minutes\n• Make sure driver uses meter\n\n**Airport Bus**\n• ¥30 per person\n• Multiple routes to different areas\n• 60-90 minutes\n\nWould you like specific directions to your hotel?";
    }
    return "That's a great question! I can help you with that. Could you provide a bit more context about what you're looking for? For example, which city you'll be visiting or what type of experience you prefer?";
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement speech recognition
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your China travel assistant. I can help you with anything about traveling in China - from finding the best restaurants to navigating the subway system. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
    setSelectedChat(null);
    setDrawerOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    // TODO: Load chat history
    setDrawerOpen(false);
  };

  const handleDeleteChat = (chatId: string) => {
    // TODO: Delete chat
    setAnchorEl(null);
  };

  return (
    <Layout hideFooter>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Sidebar - Chat History */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: 300 } }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #DEE2E6' }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewChat}
              sx={{
                backgroundColor: '#E67E22',
                '&:hover': { backgroundColor: '#d35400' },
                textTransform: 'none',
              }}
            >
              New Chat
            </Button>
          </Box>

          <List sx={{ flex: 1, overflow: 'auto' }}>
            {mockChatHistory.map((chat) => (
              <ListItem key={chat.id} disablePadding>
                <ListItemButton
                  selected={selectedChat === chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <ChatBubbleIcon sx={{ mr: 2, color: '#6C757D', fontSize: 20 }} />
                  <ListItemText
                    primary={chat.title}
                    secondary={chat.lastMessage}
                    primaryTypographyProps={{ noWrap: true, fontWeight: 500 }}
                    secondaryTypographyProps={{ noWrap: true, fontSize: '12px' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2, borderTop: '1px solid #DEE2E6' }}>
            <Button
              component={Link}
              to="/user/subscription"
              fullWidth
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Manage Subscription
            </Button>
          </Box>
        </Drawer>

        {/* Main Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid #DEE2E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Avatar sx={{ backgroundColor: '#E67E22', width: 32, height: 32 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  ChinaWise AI
                </Typography>
                <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                  ● Online
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="Monthly Plan"
                size="small"
                sx={{ backgroundColor: '#E67E22', color: 'white' }}
              />
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              backgroundColor: '#F8F9FA',
            }}
          >
            <Container maxWidth="md">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <ChatMessage
                  message={{
                    id: 'typing',
                    role: 'assistant',
                    content: '',
                    timestamp: new Date(),
                  }}
                  isTyping
                />
              )}
              <div ref={messagesEndRef} />
            </Container>
          </Box>

          {/* Quick Prompts (shown when no messages) */}
          {messages.length === 1 && (
            <Box sx={{ px: 3, pb: 2, backgroundColor: '#F8F9FA' }}>
              <Container maxWidth="md">
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Try asking:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickPrompt(prompt)}
                      sx={{
                        borderColor: '#DEE2E6',
                        color: '#2C3E50',
                        textTransform: 'none',
                        fontSize: '12px',
                        '&:hover': { borderColor: '#E67E22', color: '#E67E22' },
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </Box>
              </Container>
            </Box>
          )}

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #DEE2E6',
              backgroundColor: 'white',
            }}
          >
            <Container maxWidth="md">
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <Tooltip title={isRecording ? 'Stop recording' : 'Voice input'}>
                  <IconButton
                    onClick={toggleRecording}
                    sx={{
                      color: isRecording ? '#DC3545' : '#6C757D',
                      animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' },
                        '100%': { transform: 'scale(1)' },
                      },
                    }}
                  >
                    {isRecording ? <MicIcon /> : <MicOffIcon />}
                  </IconButton>
                </Tooltip>

                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Ask anything about China travel..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#F8F9FA',
                    },
                  }}
                />

                <IconButton
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  sx={{
                    backgroundColor: inputMessage.trim() ? '#E67E22' : 'transparent',
                    color: inputMessage.trim() ? 'white' : '#6C757D',
                    '&:hover': {
                      backgroundColor: inputMessage.trim() ? '#d35400' : 'transparent',
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mt: 1 }}
              >
                ChinaWise AI may produce inaccurate information. Always verify critical details.
              </Typography>
            </Container>
          </Box>
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            Clear conversation
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            Settings
          </MenuItem>
          <MenuItem component={Link} to="/user/subscription" onClick={() => setAnchorEl(null)}>
            Subscription
          </MenuItem>
        </Menu>
      </Box>
    </Layout>
  );
}
