import { Box, Container, Typography, Button, Grid, Card, CardContent, Paper, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import TranslateIcon from '@mui/icons-material/Translate';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsIcon from '@mui/icons-material/Directions';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MapIcon from '@mui/icons-material/Map';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import SpeedIcon from '@mui/icons-material/Speed';

const capabilities = [
  {
    icon: MapIcon,
    title: 'Attraction Information',
    description: 'Get real-time info on opening hours, ticket prices, best visiting times, and how to get there.',
  },
  {
    icon: RestaurantIcon,
    title: 'Restaurant Recommendations',
    description: 'Discover local cuisines, authentic restaurants, and must-try dishes with honest reviews.',
  },
  {
    icon: DirectionsIcon,
    title: 'Transportation Help',
    description: 'Navigate subways, buses, taxis, and high-speed trains with step-by-step guidance.',
  },
  {
    icon: HotelIcon,
    title: 'Accommodation Advice',
    description: 'Find the perfect place to stay based on your budget, location preference, and travel style.',
  },
  {
    icon: TranslateIcon,
    title: 'Translation Support',
    description: 'Translate menus, signs, and conversations. Get pronunciation help for key phrases.',
  },
  {
    icon: LocalHospitalIcon,
    title: 'Emergency Assistance',
    description: 'Quick access to hospitals, police stations, and embassy information when you need it most.',
  },
];

const plans = [
  {
    id: 'daily',
    name: 'Daily',
    price: 2.99,
    duration: '24 hours',
    features: ['Unlimited conversations', 'All 50+ cities', 'Basic translation'],
    highlighted: false,
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: 9.99,
    duration: '7 days',
    features: ['Unlimited conversations', 'All 50+ cities', 'Voice input support', 'Priority response'],
    highlighted: true,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 19.99,
    duration: '30 days',
    features: ['Unlimited conversations', 'All 50+ cities', 'Voice input support', 'Priority response', 'Conversation history', 'Export to PDF'],
    highlighted: false,
  },
];

const demoConversations = [
  {
    user: "What's the best time to visit the Great Wall?",
    ai: "The Great Wall is best visited in spring (April-May) or autumn (September-October) when the weather is mild and the scenery is spectacular. I recommend the Mutianyu section - it's less crowded than Badaling and offers a toboggan ride down! Would you like directions on how to get there?",
  },
  {
    user: "How do I say 'I am vegetarian' in Chinese?",
    ai: "Say: 'Wǒ chī sù' (我吃素). \n\nPronunciation: 'Waw chrr soo'\n\nYou can also say 'Wǒ bù chī ròu' (我不吃肉) which means 'I don't eat meat.' Would you like me to teach you more food-related phrases?",
  },
];

export default function AIAssistant() {
  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          color: 'white',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SmartToyIcon sx={{ color: '#E67E22', fontSize: 32 }} />
                <Typography variant="overline" sx={{ color: '#E67E22', fontWeight: 600 }}>
                  24/7 AI Travel Assistant
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '32px', md: '48px' } }}>
                Your Personal China Travel Expert
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
                Get instant answers to any travel question, anytime, anywhere in China
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/ai-chat"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#E67E22',
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#d35400' },
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  href="#pricing"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '16px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  View Plans
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <Avatar sx={{ backgroundColor: '#E67E22' }}>
                    <SmartToyIcon />
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
                {demoConversations.map((conv, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <Paper sx={{ p: 2, backgroundColor: '#E67E22', color: 'white', maxWidth: '80%', borderRadius: 2 }}>
                        <Typography variant="body2">{conv.user}</Typography>
                      </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, backgroundColor: '#E67E22' }}>
                        <SmartToyIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Paper sx={{ p: 2, backgroundColor: 'white', maxWidth: '80%', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: '#333', whiteSpace: 'pre-line' }}>
                          {conv.ai}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: AccessTimeIcon, value: '24/7', label: 'Available' },
              { icon: LanguageIcon, value: '50+', label: 'Cities Covered' },
              { icon: SpeedIcon, value: '< 3s', label: 'Avg Response' },
              { icon: ChatBubbleIcon, value: '10K+', label: 'Daily Chats' },
            ].map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <Box textAlign="center">
                  <stat.icon sx={{ fontSize: 40, color: '#E67E22', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Capabilities Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2C3E50', mb: 2 }}>
              What Can I Help You With?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              From finding the best dumplings to navigating the subway, I'm here to make your China trip unforgettable
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {capabilities.map((cap) => (
              <Grid key={cap.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 3,
                    border: '1px solid #DEE2E6',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: '#F8F9FA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <cap.icon sx={{ color: '#E67E22', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {cap.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cap.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Example Questions */}
      <Box sx={{ py: 10, backgroundColor: '#2C3E50', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
            Try Asking Me...
          </Typography>
          <Grid container spacing={3}>
            {[
              "What's the best way to get from Beijing Airport to the city center?",
              "Where can I find authentic Sichuan hotpot in Chengdu?",
              "How do I buy tickets for the Terracotta Warriors?",
              "What should I pack for a trip to China in October?",
              "Can you recommend a good hotel near the Bund in Shanghai?",
              "How do I use the subway in Guangzhou?",
            ].map((question, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <Paper
                  component={Link}
                  to="/ai-chat"
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <Typography variant="body1">"{question}"</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ py: 10, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2C3E50', mb: 2 }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose the plan that fits your trip. All plans include a 3-day free trial.
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan) => (
              <Grid key={plan.id} size={{ xs: 12, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    position: 'relative',
                    border: plan.highlighted ? '2px solid #E67E22' : '1px solid #DEE2E6',
                    borderRadius: 3,
                  }}
                >
                  {plan.highlighted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#E67E22',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.duration} access
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#E67E22' }}>
                        ${plan.price}
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                      {plan.features.map((feature) => (
                        <Typography component="li" key={feature} variant="body2" sx={{ mb: 1 }}>
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                    <Button
                      component={Link}
                      to="/ai-chat"
                      fullWidth
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      size="large"
                      sx={
                        plan.highlighted
                          ? {
                              backgroundColor: '#E67E22',
                              '&:hover': { backgroundColor: '#d35400' },
                              textTransform: 'none',
                            }
                          : {
                              borderColor: '#2C3E50',
                              color: '#2C3E50',
                              textTransform: 'none',
                            }
                      }
                    >
                      Start Free Trial
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: '#E67E22', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Ready to Explore China Like a Local?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
            Start your free 3-day trial today. No credit card required.
          </Typography>
          <Button
            component={Link}
            to="/ai-chat"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: '#E67E22',
              px: 6,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            Try AI Assistant Free
          </Button>
        </Container>
      </Box>
    </Layout>
  );
}
