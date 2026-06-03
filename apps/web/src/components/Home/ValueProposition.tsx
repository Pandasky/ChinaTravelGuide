import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import UpdateIcon from '@mui/icons-material/Update';

const valueProps = [
  {
    icon: PictureAsPdfIcon,
    title: 'Offline-Ready PDF Guides',
    description:
      'Download once, access anywhere. No internet needed. Each guide includes detailed maps, curated itineraries, and essential travel information.',
    color: '#E67E22',
  },
  {
    icon: ChatBubbleIcon,
    title: '24/7 AI Travel Assistant',
    description:
      'Get instant answers to your travel questions anytime, anywhere. Our AI understands Chinese and speaks your language, helping you navigate any situation.',
    color: '#2C3E50',
  },
  {
    icon: UpdateIcon,
    title: 'Updated Monthly',
    description:
      'Travel information changes fast. Our team verifies and updates all guides monthly, ensuring you always have the most accurate and current information.',
    color: '#28A745',
  },
];

export default function ValueProposition() {
  return (
    <Box sx={{ py: 10, backgroundColor: '#F8F9FA' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '28px', md: '36px' },
              fontWeight: 700,
              color: '#2C3E50',
              mb: 2,
            }}
          >
            Why Choose ChinaWise?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '18px',
              color: '#6C757D',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            We combine expert local knowledge with cutting-edge AI to give you
the ultimate travel experience.
          </Typography>
        </Box>

        {/* Value Cards */}
        <Grid container spacing={4}>
          {valueProps.map((prop) => (
            <Grid size={{ xs: 12, md: 4 }} key={prop.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid #DEE2E6',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    backgroundColor: `${prop.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <prop.icon
                    sx={{
                      fontSize: 32,
                      color: prop.color,
                    }}
                  />
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#2C3E50',
                    mb: 2,
                    fontSize: '20px',
                  }}
                >
                  {prop.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6C757D',
                    lineHeight: 1.7,
                    fontSize: '15px',
                  }}
                >
                  {prop.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
