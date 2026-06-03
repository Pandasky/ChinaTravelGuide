import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function FinalCTA() {
  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: '#E67E22',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '28px', md: '40px' },
            fontWeight: 700,
            color: '#FFFFFF',
            mb: 3,
          }}
        >
          Start Your China Adventure Today
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            mb: 4,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          Join thousands of travelers who have discovered China with our expert guides and AI assistance.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Button
            component={Link}
            to="/guides"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#E67E22',
              px: 4,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#F8F9FA',
              },
            }}
          >
            Browse Guides
          </Button>
          <Button
            component={Link}
            to="/ai-assistant"
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#FFFFFF',
              color: '#FFFFFF',
              px: 4,
              py: 1.5,
              fontSize: '16px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: '#FFFFFF',
              },
            }}
          >
            Try AI Free
          </Button>
        </Box>

        {/* Trust indicators */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {[
            'No hidden fees',
            'Instant download',
            '7-day money-back guarantee',
          ].map((text) => (
            <Box
              key={text}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.9)',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '14px',
                }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
