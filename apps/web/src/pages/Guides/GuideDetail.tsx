import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Rating,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Skeleton,
  Tabs,
  Tab,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StarIcon from '@mui/icons-material/Star';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import Layout from '../../components/Layout';
import GuideCard from '../../components/Guides/GuideCard';

// Mock data - replace with API call
const mockGuide = {
  id: '1',
  title: 'Beijing',
  subtitle: 'The Forbidden City to Great Wall',
  description:
    'Discover the heart of China with our comprehensive Beijing guide. From the iconic Great Wall to the historic Forbidden City, experience the perfect blend of ancient tradition and modern innovation. This guide includes detailed itineraries, insider tips, local restaurant recommendations, and practical information to help you navigate China\'s capital like a local.',
  coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&h=600&q=80',
  price: 9.99,
  rating: 4.9,
  reviewCount: 128,
  pageCount: 85,
  version: '2.1',
  lastUpdated: 'March 2026',
  categories: ['City Guide', 'History', '7 Days'],
  author: {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    bio: 'Beijing resident for 10+ years, travel writer and photographer',
  },
  includes: [
    '7-day detailed itinerary',
    'Offline maps with marked locations',
    'Restaurant recommendations by budget',
    'Transportation guide (subway, bus, taxi)',
    'Cultural etiquette tips',
    'Practical Chinese phrases',
    'Emergency contacts',
    'Day trips from Beijing',
  ],
  itinerary: [
    { day: 1, title: 'Arrival & Tiananmen Square', highlights: ['Tiananmen Square', 'National Museum', 'Wangfujing Street'] },
    { day: 2, title: 'The Forbidden City', highlights: ['Forbidden City', 'Jingshan Park', 'Beihai Park'] },
    { day: 3, title: 'Temple of Heaven & Hutongs', highlights: ['Temple of Heaven', 'Hutong tour', 'Houhai Lake'] },
    { day: 4, title: 'The Great Wall (Mutianyu)', highlights: ['Great Wall cable car', 'Toboggan ride', 'Local village lunch'] },
    { day: 5, title: 'Summer Palace', highlights: ['Summer Palace', 'Kunming Lake boat ride', 'Old Summer Palace'] },
    { day: 6, title: 'Modern Beijing', highlights: ['Olympic Park', '798 Art District', 'Sanlitun nightlife'] },
    { day: 7, title: 'Departure & Last Minute Shopping', highlights: ['Pearl Market', 'Panjiayuan Market', 'Airport transfer'] },
  ],
};

const mockReviews = [
  {
    id: '1',
    user: { name: 'John Smith', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80', country: 'USA' },
    rating: 5,
    date: '2026-03-15',
    content: 'This guide was absolutely essential for our Beijing trip. The restaurant recommendations were spot on, and the itinerary saved us so much time. Highly recommend!',
  },
  {
    id: '2',
    user: { name: 'Marie Dubois', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80', country: 'France' },
    rating: 5,
    date: '2026-02-28',
    content: 'Very detailed and well-organized. The offline maps were a lifesaver when we lost internet connection. The Great Wall section was particularly helpful.',
  },
  {
    id: '3',
    user: { name: 'Hans Mueller', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80', country: 'Germany' },
    rating: 4,
    date: '2026-02-10',
    content: 'Great guide overall. Would love to see more vegetarian restaurant options, but otherwise excellent. The transportation tips were invaluable.',
  },
];

const relatedGuides = [
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
    title: "Xi'an",
    subtitle: 'Terracotta Warriors & Ancient Capital',
    description: 'Journey through 3,000 years of Chinese history',
    coverImage: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=600&h=400&q=80',
    price: 7.99,
    rating: 4.9,
    reviewCount: 84,
  },
  {
    id: '9',
    title: 'China Travel Basics',
    subtitle: 'Essential Guide for First-Timers',
    description: 'Everything you need to know before visiting China',
    coverImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&h=400&q=80',
    price: 0,
    isFree: true,
    rating: 4.9,
    reviewCount: 234,
  },
];

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const handleBuyNow = () => {
    console.log('Buy guide:', id);
    // TODO: Implement checkout flow
  };

  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 4 }} />
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" height={30} width="60%" />
              <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ pt: 3, pb: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/guides" style={{ color: 'inherit', textDecoration: 'none' }}>
            Guides
          </Link>
          <Typography color="text.primary">{mockGuide.title}</Typography>
        </Breadcrumbs>
      </Container>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 450 },
          backgroundImage: `linear-gradient(135deg, rgba(44, 62, 80, 0.85) 0%, rgba(44, 62, 80, 0.6) 100%), url(${mockGuide.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          mb: 6,
        }}
      >
        <Container maxWidth="lg" sx={{ pb: 6 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {mockGuide.categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            ))}
          </Box>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            {mockGuide.title}
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
            {mockGuide.subtitle}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ color: '#E67E22', mr: 0.5 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {mockGuide.rating}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', ml: 1 }}>
                ({mockGuide.reviewCount} reviews)
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              •
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Updated {mockGuide.lastUpdated}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Description */}
            <Typography variant="body1" sx={{ fontSize: '18px', lineHeight: 1.8, color: '#333333', mb: 4 }}>
              {mockGuide.description}
            </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                <Tab label="What's Included" />
                <Tab label="Itinerary" />
                <Tab label={`Reviews (${mockGuide.reviewCount})`} />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  What's Inside This Guide
                </Typography>
                <Grid container spacing={2}>
                  {mockGuide.includes.map((item, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#28A745' }} />
                        <Typography variant="body1">{item}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Author */}
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  About the Author
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  <Avatar src={mockGuide.author.avatar} sx={{ width: 80, height: 80 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {mockGuide.author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {mockGuide.author.bio}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  7-Day Itinerary Overview
                </Typography>
                <List>
                  {mockGuide.itinerary.map((day) => (
                    <ListItem
                      key={day.day}
                      sx={{
                        mb: 2,
                        p: 2,
                        backgroundColor: '#F8F9FA',
                        borderRadius: 2,
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#E67E22',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                          }}
                        >
                          {day.day}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={day.title}
                        secondary={day.highlights.join(' • ')}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Customer Reviews
                </Typography>
                {mockReviews.map((review) => (
                  <Paper key={review.id} elevation={0} sx={{ p: 3, mb: 2, border: '1px solid #DEE2E6' }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Avatar src={review.user.avatar} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.user.country} • {review.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="body1">{review.content}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Grid>

          {/* Right Column - Sticky Purchase Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              <Paper elevation={0} sx={{ p: 4, border: '1px solid #DEE2E6', borderRadius: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#E67E22', mb: 1 }}>
                  ${mockGuide.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  One-time purchase • Lifetime updates
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DescriptionIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {mockGuide.pageCount} pages
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DownloadIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      PDF format
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleBuyNow}
                  sx={{
                    backgroundColor: '#E67E22',
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600,
                    textTransform: 'none',
                    mb: 2,
                    '&:hover': { backgroundColor: '#d35400' },
                  }}
                >
                  Buy Now
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewOpen(true)}
                  sx={{
                    borderColor: '#2C3E50',
                    color: '#2C3E50',
                    py: 1.5,
                    fontSize: '16px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#2C3E50', color: 'white' },
                  }}
                >
                  Free Preview (5 pages)
                </Button>

                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #DEE2E6' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    ✓ 7-day money-back guarantee
                  </Typography>
                </Box>
              </Paper>

              {/* Quick Info */}
              <Paper elevation={0} sx={{ mt: 3, p: 3, border: '1px solid #DEE2E6', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Info
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccessTimeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Best time: Spring & Autumn" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LocationOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Location: Northern China" />
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Related Guides */}
      <Box sx={{ backgroundColor: '#F8F9FA', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
            You Might Also Like
          </Typography>
          <Grid container spacing={3}>
            {relatedGuides.map((guide) => (
              <Grid key={guide.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <GuideCard guide={guide} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { minHeight: '80vh' } }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {mockGuide.title} - Free Preview
          </Typography>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              PDF Preview Viewer
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This would embed the PDF.js viewer for previewing the first 5 pages
            </Typography>
            <Button
              variant="contained"
              onClick={handleBuyNow}
              sx={{ backgroundColor: '#E67E22', '&:hover': { backgroundColor: '#d35400' } }}
            >
              Buy Full Guide - ${mockGuide.price}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
