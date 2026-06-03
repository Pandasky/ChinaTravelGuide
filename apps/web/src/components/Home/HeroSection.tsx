import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';

// Hero background images (China landscapes)
const heroImages = [
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1920&q=80', // Great Wall
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80', // Shanghai
  'https://images.unsplash.com/photo-1549893072-4bc678117f45?auto=format&fit=crop&w=1920&q=80', // Guilin
];

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Background with overlay
        backgroundImage: `
          linear-gradient(
            135deg,
            rgba(44, 62, 80, 0.85) 0%,
            rgba(44, 62, 80, 0.7) 50%,
            rgba(44, 62, 80, 0.6) 100%
          ),
          url(${heroImages[0]})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center" color="white">
          {/* Trust Badge */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <PeopleIcon sx={{ fontSize: 20, color: '#E67E22' }} />
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
              }}
            >
              Trusted by 10,000+ travelers from 50+ countries
            </Typography>
          </Stack>

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '36px', sm: '48px', md: '56px' },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 3,
              color: '#FFFFFF',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            Travel China Like a Local
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '18px', sm: '20px', md: '24px' },
              fontWeight: 400,
              lineHeight: 1.5,
              mb: 5,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Expert-curated guides & 24/7 AI assistance for your perfect China trip
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              component={Link}
              to="/guides"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#E67E22',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 500,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#d35400',
                },
              }}
            >
              Browse Travel Guides
            </Button>
            <Button
              component={Link}
              to="/ai-assistant"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 500,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Try AI Assistant Free
            </Button>
          </Stack>

          {/* Features */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            {[
              { icon: '📱', text: 'Offline Ready' },
              { icon: '🤖', text: 'AI Powered' },
              { icon: '🔄', text: 'Monthly Updates' },
            ].map((feature) => (
              <Stack
                key={feature.text}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Typography sx={{ fontSize: '20px' }}>{feature.icon}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '14px',
                  }}
                >
                  {feature.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateX(-50%) translateY(0)',
            },
            '40%': {
              transform: 'translateX(-50%) translateY(-10px)',
            },
            '60%': {
              transform: 'translateX(-50%) translateY(-5px)',
            },
          },
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 40,
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: 12,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 8,
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 2,
              animation: 'scroll 2s infinite',
            },
            '@keyframes scroll': {
              '0%': {
                opacity: 1,
                top: 8,
              },
              '100%': {
                opacity: 0,
                top: 20,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
