import { Card, CardMedia, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

interface Guide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  price: number;
  isFree?: boolean;
  rating: number;
  reviewCount: number;
  categories?: string[];
}

interface GuideCardProps {
  guide: Guide;
  variant?: 'default' | 'compact';
}

export default function GuideCard({ guide, variant = 'default' }: GuideCardProps) {
  if (variant === 'compact') {
    return (
      <Card
        elevation={0}
        sx={{
          display: 'flex',
          borderRadius: 2,
          border: '1px solid #DEE2E6',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 120, objectFit: 'cover' }}
          image={guide.coverImage}
          alt={guide.title}
        />
        <CardContent sx={{ flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2C3E50', mb: 0.5 }}>
                {guide.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                {guide.subtitle}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ color: '#E67E22', fontSize: 16 }} />
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
                {guide.rating}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
            {guide.isFree ? (
              <Chip label="Free" size="small" sx={{ backgroundColor: '#28A745', color: 'white' }} />
            ) : (
              <Typography variant="subtitle2" sx={{ color: '#E67E22', fontWeight: 700 }}>
                ${guide.price}
              </Typography>
            )}
            <Button
              component={Link}
              to={`/guides/${guide.id}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: '#2C3E50',
                color: '#2C3E50',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#2C3E50',
                  color: 'white',
                },
              }}
            >
              View
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
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
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={200}
          image={guide.coverImage}
          alt={guide.title}
          sx={{ objectFit: 'cover' }}
        />
        {guide.isFree && (
          <Chip
            label="FREE"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: '#28A745',
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <StarIcon sx={{ color: '#E67E22', fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C3E50', mr: 0.5 }}>
            {guide.rating}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({guide.reviewCount} reviews)
          </Typography>
        </Box>

        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50', mb: 0.5 }}>
          {guide.title}
        </Typography>

        {/* Subtitle */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {guide.subtitle}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {guide.description}
        </Typography>

        {/* Categories */}
        {guide.categories && guide.categories.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {guide.categories.slice(0, 2).map((category) => (
              <Chip
                key={category}
                label={category}
                size="small"
                sx={{
                  backgroundColor: '#F8F9FA',
                  color: '#6C757D',
                  fontSize: '12px',
                }}
              />
            ))}
          </Box>
        )}

        {/* Price and CTA */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          {guide.isFree ? (
            <Typography variant="h6" sx={{ color: '#28A745', fontWeight: 700 }}>
              Free
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ color: '#E67E22', fontWeight: 700 }}>
              ${guide.price}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
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
                },
              }}
            >
              Preview
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
