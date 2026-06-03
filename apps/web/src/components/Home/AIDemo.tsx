import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const demoMessages = [
  {
    role: 'user',
    content: 'What\'s the best time to visit the Great Wall?',
  },
  {
    role: 'assistant',
    content: 'The Great Wall is best visited in spring (April-May) or autumn (September-October) when the weather is mild and the scenery is spectacular. Avoid Chinese national holidays like Golden Week (Oct 1-7) as it gets extremely crowded. I recommend going early morning (around 8 AM) to beat the crowds and enjoy better photo opportunities!',
  },
  {
    role: 'user',
    content: 'How do I get there from Beijing?',
  },
  {
    role: 'assistant',
    content: 'You have several options:\n\n🚗 **Private Car/Taxi**: Most convenient, takes ~1.5 hours, costs ¥400-600 round trip\n\n🚌 **Tour Bus**: Many hotels offer tours, ~¥100-150 including entry\n\n🚆 **Public Bus**: Take Bus 877 from Deshengmen (¥12), takes ~1 hour\n\n🚄 **Train**: S2 line from Beijing North Railway Station to Badaling (¥6), very scenic!\n\nWould you like specific details for any of these options?',
  },
];

export default function AIDemo() {
  return (
    <Box sx={{ py: 10, backgroundColor: '#2C3E50' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 6,
            alignItems: 'center',
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1, color: 'white' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '28px', md: '36px' },
                fontWeight: 700,
                mb: 3,
              }}
            >
              Your Personal China Travel Expert
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.8)',
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              Stuck on your trip? Need a restaurant recommendation? Want to know
              how to say "thank you" in Chinese? Our AI assistant is here 24/7
              with instant, accurate answers tailored to your journey.
            </Typography>

            {/* Features List */}
            <Box sx={{ mb: 4 }}>
              {[
                'Real-time answers in English',
                'Knows 50+ Chinese cities inside out',
                'Helps with translations & pronunciation',
                'Restaurant & hotel recommendations',
                'Emergency assistance guidance',
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#E67E22',
                      mr: 2,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              component={Link}
              to="/ai-assistant"
              variant="contained"
              size="large"
              startIcon={<ChatBubbleOutlineIcon />}
              sx={{
                backgroundColor: '#E67E22',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#d35400',
                },
              }}
            >
              Start Chatting Free
            </Button>
          </Box>

          {/* Right - Chat Demo */}
          <Box sx={{ flex: 1, width: '100%', maxWidth: 500 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                backgroundColor: '#F8F9FA',
              }}
            >
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid #DEE2E6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: '#E67E22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SmartToyIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#2C3E50',
                      lineHeight: 1.2,
                    }}
                  >
                    ChinaWise AI
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#28A745',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#28A745',
                      }}
                    />
                    Online
                  </Typography>
                </Box>
              </Box>

              {/* Chat Messages */}
              <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                {demoMessages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent:
                        message.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    {message.role === 'assistant' && (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: '#E67E22',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1,
                          flexShrink: 0,
                        }}
                      >
                        <SmartToyIcon
                          sx={{ color: 'white', fontSize: 18 }}
                        />
                      </Box>
                    )}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        maxWidth: '80%',
                        backgroundColor:
                          message.role === 'user' ? '#E67E22' : '#FFFFFF',
                        color:
                          message.role === 'user' ? '#FFFFFF' : '#333333',
                        borderRadius: 2,
                        border:
                          message.role === 'assistant'
                            ? '1px solid #DEE2E6'
                            : 'none',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.5,
                        }}
                      >
                        {message.content}
                      </Typography>
                    </Paper>
                    {message.role === 'user' && (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: '#2C3E50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ml: 1,
                          flexShrink: 0,
                        }}
                      >
                        <PersonIcon sx={{ color: 'white', fontSize: 18 }} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Chat Input */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#FFFFFF',
                  borderTop: '1px solid #DEE2E6',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      py: 1,
                      px: 2,
                      backgroundColor: '#F8F9FA',
                      borderRadius: 2,
                      border: '1px solid #DEE2E6',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6C757D',
                      }}
                    >
                      Type your question...
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#E67E22',
                      '&:hover': { backgroundColor: '#d35400' },
                      minWidth: 40,
                      px: 2,
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
