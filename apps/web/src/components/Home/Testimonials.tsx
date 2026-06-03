import { useState } from 'react';
import { Box, Container, Typography, Paper, IconButton, MobileStepper } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StarIcon from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    country: 'United States',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    content: 'The Beijing guide was an absolute lifesaver! The detailed maps and restaurant recommendations helped us discover hidden gems we never would have found on our own. Worth every penny!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    country: 'Canada',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    content: 'The AI assistant saved my trip when I got lost in Shanghai. It helped me communicate with a taxi driver and got me back to my hotel. Incredible service!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emma Williams',
    country: 'United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    content: 'We used the Guilin guide for our honeymoon and it was perfect. The 5-day itinerary was well-paced and included amazing photography spots. The PDF worked offline during our Li River cruise!',
    rating: 5,
  },
  {
    id: '4',
    name: 'David Park',
    country: 'Australia',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    content: 'The monthly updates are a game-changer. I downloaded an updated guide before my second trip and found new restaurants and attractions that weren\'t there before. Great value!',
    rating: 5,
  },
  {
    id: '5',
    name: 'Marie Dubois',
    country: 'France',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
    content: 'As a solo female traveler, I felt so much more confident with ChinaWise. The safety tips and cultural etiquette section helped me navigate respectfully and safely. Highly recommend!',
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = testimonials.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const currentTestimonial = testimonials[activeStep];

  return (
    <Box sx={{ py: 10, backgroundColor: '#F8F9FA' }}>
      <Container maxWidth="md">
        {/* Section Header */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '28px', md: '36px' },
              fontWeight: 700,
              color: '#2C3E50',
              mb: 2,
            }}
          >
            What Travelers Say
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#2C3E50',
              }}
            >
              4.8
            </Typography>
            <Box sx={{ display: 'flex' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  sx={{
                    color: '#E67E22',
                    fontSize: 24,
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#6C757D',
              }}
            >
              Average Rating
            </Typography>
          </Box>
        </Box>

        {/* Testimonial Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #DEE2E6',
            position: 'relative',
          }}
        >
          {/* Quote Icon */}
          <FormatQuoteIcon
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              fontSize: 48,
              color: '#E67E22',
              opacity: 0.2,
            }}
          />

          <Box textAlign="center">
            {/* Rating */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 0.5,
                mb: 3,
              }}
            >
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{ color: '#E67E22', fontSize: 24 }}
                />
              ))}
            </Box>

            {/* Content */}
            <Typography
              variant="h6"
              sx={{
                color: '#333333',
                fontWeight: 400,
                lineHeight: 1.7,
                mb: 4,
                fontSize: { xs: '16px', md: '18px' },
                fontStyle: 'italic',
              }}
            >
              "{currentTestimonial.content}"
            </Typography>

            {/* Author */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Box
                component="img"
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <Box textAlign="left">
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#2C3E50',
                  }}
                >
                  {currentTestimonial.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6C757D',
                  }}
                >
                  {currentTestimonial.country}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Navigation */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 3,
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              color: '#2C3E50',
              '&:hover': {
                backgroundColor: 'rgba(44, 62, 80, 0.05)',
              },
            }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>

          <MobileStepper
            variant="dots"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{
              backgroundColor: 'transparent',
              '& .MuiMobileStepper-dot': {
                width: 8,
                height: 8,
                backgroundColor: '#DEE2E6',
              },
              '& .MuiMobileStepper-dotActive': {
                backgroundColor: '#E67E22',
              },
            }}
            nextButton={null}
            backButton={null}
          />

          <IconButton
            onClick={handleNext}
            sx={{
              color: '#2C3E50',
              '&:hover': {
                backgroundColor: 'rgba(44, 62, 80, 0.05)',
              },
            }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
