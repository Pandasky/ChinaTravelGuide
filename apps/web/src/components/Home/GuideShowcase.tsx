import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

// Mock data for popular guides
const popularGuides = [
  {
    id: '1',
    title: 'Beijing',
    subtitle: 'The Forbidden City to Great Wall',
    description: 'Complete guide to China\'s capital with 7-day itinerary',
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&h=400&q=80',
    price: 9.99,
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: '2',
    title: 'Shanghai',
    subtitle: 'Modern Metropolis Meets Old Town',
    description: 'Navigate the Pearl of the Orient like a local',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&h=400&q=80',
    price: 9.99,
    rating: 4.8,
    reviewCount: 96,
  },
  {
    id: '3',
    title: 'Xi\'an',
    subtitle: 'Terracotta Warriors & Ancient Capital',
    description: 'Journey through 3,000 years of Chinese history',
    coverImage: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=600&h=400&q=80',
    price: 7.99,
    rating: 4.9,
    reviewCount: 84,
  },
  {
    id: '4',
    title: 'Guilin & Yangshuo',
    subtitle: 'Karst Landscapes & Li River',
    description: 'The most scenic region in all of China',
    coverImage: 'https://images.unsplash.com/photo-1549893072-4bc678117f45?auto=format&fit=crop&w=600&h=400&q=80',
    price: 8.99,
    rating: 4.7,
    reviewCount: 72,
  },
  {
    id: '5',
    title: 'Chengdu',
    subtitle: 'Pandas & Sichuan Cuisine',
    description: 'Home of the Giant Panda and spicy food paradise',
    coverImage: 'https://images.unsplash.com/photo-1580213592902-336d24e1b4e3?auto=format&fit=crop&w=600&h=400&q=80',
    price: 7.99,
    rating: 4.8,
    reviewCount: 68,
  },
  {
    id: '6',
    title: 'Hangzhou',
    subtitle: 'West Lake & Tea Plantations',
    description: 'Heaven on Earth with serene landscapes',
    coverImage: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=600&h=400&q=80',
    price: 6.99,
    rating: 4.7,
    reviewCount: 56,
  },
];

export default function GuideShowcase() {
  return (
    <Box sx={{ py: 10, backgroundColor: '#FFFFFF' }}>
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
            Popular Travel Guides
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
            Expertly crafted guides for China&apos;s most visited destinations
          </Typography>
        </Box>

        {/* Guide Cards Grid */}
        <Grid container spacing={3}>
          {popularGuides.map((guide) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={guide.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid #DEE2E6',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Cover Image */}
                <CardMedia
                  component="img"
                  height={200}
                  image={guide.coverImage}
                  alt={guide.title}
                  sx={{ objectFit: 'cover' }}
                />

                {/* Content */}
                <CardContent sx={{ flex: 1, p: 3 }}>
                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <StarIcon sx={{ color: '#E67E22', fontSize: 18, mr: 0.5 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#2C3E50',
                        mr: 0.5,
                      }}
                    >
                      {guide.rating}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6C757D' }}>
                      ({guide.reviewCount})
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2C3E50',
                      mb: 0.5,
                    }}
                  >
                    {guide.title}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6C757D',
                      mb: 1,
                      fontSize: '14px',
                    }}
                  >
                    {guide.subtitle}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6C757D',
                      mb: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {guide.description}
                  </Typography>

                  {/* Price and CTA */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 'auto',
                    }}
                  >
                    <Chip
                      label={`$${guide.price}`}
                      sx={{
                        backgroundColor: '#E67E22',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '16px',
                      }}
                    />
                    <Button
                      component={Link}
                      to={`/guides/${guide.id}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#2C3E50',
                        color: '#2C3E50',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#2C3E50',
                          color: 'white',
                          borderColor: '#2C3E50',
                        },
                      }}
                    >
                      Preview
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* View All Button */}
        <Box textAlign="center" sx={{ mt: 6 }}>
          <Button
            component={Link}
            to="/guides"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#2C3E50',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '16px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1a252f',
              },
            }}
          >
            View All Guides
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
