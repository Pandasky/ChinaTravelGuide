import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Drawer,
  Pagination,
  Breadcrumbs,
  Link as MuiLink,
  Skeleton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Layout from '../../components/Layout';
import FilterSidebar from '../../components/Guides/FilterSidebar';
import GuideCard from '../../components/Guides/GuideCard';

// Mock data - replace with API call
const mockGuides = [
  {
    id: '1',
    title: 'Beijing',
    subtitle: 'The Forbidden City to Great Wall',
    description: 'Complete guide to China\'s capital with 7-day itinerary covering the Forbidden City, Temple of Heaven, Summer Palace, and the iconic Great Wall.',
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&h=400&q=80',
    price: 9.99,
    rating: 4.9,
    reviewCount: 128,
    categories: ['History', '7 Days'],
  },
  {
    id: '2',
    title: 'Shanghai',
    subtitle: 'Modern Metropolis Meets Old Town',
    description: 'Navigate the Pearl of the Orient with our comprehensive guide to the Bund, Yu Garden, French Concession, and hidden local gems.',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&h=400&q=80',
    price: 9.99,
    rating: 4.8,
    reviewCount: 96,
    categories: ['City', '5 Days'],
  },
  {
    id: '3',
    title: 'Xi\'an',
    subtitle: 'Terracotta Warriors & Ancient Capital',
    description: 'Journey through 3,000 years of Chinese history. Visit the Terracotta Warriors, Ancient City Wall, and Muslim Quarter.',
    coverImage: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=600&h=400&q=80',
    price: 7.99,
    rating: 4.9,
    reviewCount: 84,
    categories: ['History', '3 Days'],
  },
  {
    id: '4',
    title: 'Guilin & Yangshuo',
    subtitle: 'Karst Landscapes & Li River',
    description: 'The most scenic region in all of China. Cruise the Li River, explore karst mountains, and cycle through rice paddies.',
    coverImage: 'https://images.unsplash.com/photo-1549893072-4bc678117f45?auto=format&fit=crop&w=600&h=400&q=80',
    price: 8.99,
    rating: 4.7,
    reviewCount: 72,
    categories: ['Nature', '4 Days'],
  },
  {
    id: '5',
    title: 'Chengdu',
    subtitle: 'Pandas & Sichuan Cuisine',
    description: 'Home of the Giant Panda and spicy food paradise. Visit the Panda Base, explore Jinli Street, and taste authentic hotpot.',
    coverImage: 'https://images.unsplash.com/photo-1580213592902-336d24e1b4e3?auto=format&fit=crop&w=600&h=400&q=80',
    price: 7.99,
    rating: 4.8,
    reviewCount: 68,
    categories: ['Food', '3 Days'],
  },
  {
    id: '6',
    title: 'Hangzhou',
    subtitle: 'West Lake & Tea Plantations',
    description: 'Heaven on Earth with serene landscapes. Cruise West Lake, visit Lingyin Temple, and explore Longjing tea villages.',
    coverImage: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=600&h=400&q=80',
    price: 6.99,
    rating: 4.7,
    reviewCount: 56,
    categories: ['Nature', '2 Days'],
  },
  {
    id: '7',
    title: 'Suzhou',
    subtitle: 'Gardens & Canals',
    description: 'The Venice of the East. Explore classical gardens, cruise ancient canals, and discover silk culture.',
    coverImage: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=600&h=400&q=80',
    price: 5.99,
    rating: 4.6,
    reviewCount: 45,
    categories: ['Culture', '1 Day'],
  },
  {
    id: '8',
    title: 'Hong Kong',
    subtitle: 'East Meets West',
    description: 'A vibrant fusion of cultures. Ride the Peak Tram, explore temples, shop at markets, and savor dim sum.',
    coverImage: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=600&h=400&q=80',
    price: 10.99,
    rating: 4.8,
    reviewCount: 112,
    categories: ['City', '4 Days'],
  },
  {
    id: '9',
    title: 'China Travel Basics',
    subtitle: 'Essential Guide for First-Timers',
    description: 'Everything you need to know before visiting China. Visa info, transportation, communication, and cultural tips.',
    coverImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&h=400&q=80',
    price: 0,
    isFree: true,
    rating: 4.9,
    reviewCount: 234,
    categories: ['Essential', 'Free'],
  },
];

export default function GuideList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    cities: [],
    themes: [],
    durations: [],
    priceRange: [0, 50] as [number, number],
    rating: null as number | null,
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter guides
  const filteredGuides = mockGuides.filter((guide) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !guide.title.toLowerCase().includes(query) &&
        !guide.description.toLowerCase().includes(query) &&
        !guide.subtitle.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Price filter
    if (guide.price < filters.priceRange[0] || guide.price > filters.priceRange[1]) {
      return false;
    }

    // Rating filter
    if (filters.rating && guide.rating < filters.rating) {
      return false;
    }

    return true;
  });

  // Sort guides
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return parseInt(b.id) - parseInt(a.id);
      default: // popular
        return b.reviewCount - a.reviewCount;
    }
  });

  const handleClearFilters = () => {
    setFilters({
      cities: [],
      themes: [],
      durations: [],
      priceRange: [0, 50],
      rating: null,
    });
    setSearchQuery('');
  };

  return (
    <Layout>
      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ pt: 3, pb: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <MuiLink component={Link} to="/" color="inherit" underline="hover">
            Home
          </MuiLink>
          <Typography color="text.primary">Guides</Typography>
        </Breadcrumbs>
      </Container>

      {/* Header */}
      <Box sx={{ backgroundColor: '#F8F9FA', py: 4, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#2C3E50',
              mb: 1,
              fontSize: { xs: '28px', md: '36px' },
            }}
          >
            Travel Guides
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Expert-curated PDF guides for China's best destinations
          </Typography>
        </Container>
      </Box>

      {/* Search and Sort Bar */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 250 }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
            >
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={() => setMobileFilterOpen(true)}
            sx={{
              display: { md: 'none' },
              border: '1px solid #DEE2E6',
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        {/* Results count */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {sortedGuides.length} guide{sortedGuides.length !== 1 ? 's' : ''}
        </Typography>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Box sx={{ display: 'flex' }}>
          {/* Desktop Filter Sidebar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              mr: 4,
            }}
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </Box>

          {/* Guide Grid */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={3}>
              {isLoading
                ? Array.from(new Array(6)).map((_, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <Skeleton
                        variant="rectangular"
                        height={400}
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                  ))
                : sortedGuides.map((guide) => (
                    <Grid key={guide.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <GuideCard guide={guide} />
                    </Grid>
                  ))}
            </Grid>

            {/* Empty State */}
            {!isLoading && sortedGuides.length === 0 && (
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No guides found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Try adjusting your filters or search query
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleClearFilters}
                  sx={{
                    backgroundColor: '#E67E22',
                    '&:hover': { backgroundColor: '#d35400' },
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}

            {/* Pagination */}
            {sortedGuides.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={Math.ceil(sortedGuides.length / 9)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
          mobileOpen={mobileFilterOpen}
          onMobileClose={() => setMobileFilterOpen(false)}
        />
      </Drawer>
    </Layout>
  );
}
