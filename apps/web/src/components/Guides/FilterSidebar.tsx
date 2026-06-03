import { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface FilterSidebarProps {
  filters: {
    cities: string[];
    themes: string[];
    durations: string[];
    priceRange: [number, number];
    rating: number | null;
  };
  onFilterChange: (filters: FilterSidebarProps['filters']) => void;
  onClearFilters: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const cities = [
  'Beijing',
  'Shanghai',
  'Xi\'an',
  'Guilin',
  'Chengdu',
  'Hangzhou',
  'Suzhou',
  'Hong Kong',
  'Guangzhou',
  'Shenzhen',
];

const themes = [
  'History & Culture',
  'Food & Dining',
  'Nature & Scenery',
  'Shopping',
  'Nightlife',
  'Family Friendly',
  'Budget Travel',
  'Luxury Experience',
];

const durations = [
  '1 Day',
  '2-3 Days',
  '4-5 Days',
  '6-7 Days',
  '7+ Days',
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  mobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    cities: true,
    themes: true,
    duration: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCityToggle = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    onFilterChange({ ...filters, cities: newCities });
  };

  const handleThemeToggle = (theme: string) => {
    const newThemes = filters.themes.includes(theme)
      ? filters.themes.filter((t) => t !== theme)
      : [...filters.themes, theme];
    onFilterChange({ ...filters, themes: newThemes });
  };

  const handleDurationToggle = (duration: string) => {
    const newDurations = filters.durations.includes(duration)
      ? filters.durations.filter((d) => d !== duration)
      : [...filters.durations, duration];
    onFilterChange({ ...filters, durations: newDurations });
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    onFilterChange({ ...filters, priceRange: newValue as [number, number] });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? null : rating,
    });
  };

  const activeFilterCount =
    filters.cities.length +
    filters.themes.length +
    filters.durations.length +
    (filters.rating ? 1 : 0);

  const content = (
    <>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: '#2C3E50' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              sx={{
                backgroundColor: '#E67E22',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
        {activeFilterCount > 0 && (
          <Button
            size="small"
            onClick={onClearFilters}
            sx={{
              color: '#E67E22',
              textTransform: 'none',
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Cities */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            mb: expandedSections.cities ? 2 : 0,
          }}
          onClick={() => toggleSection('cities')}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Cities
          </Typography>
          {expandedSections.cities ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        {expandedSections.cities && (
          <FormGroup>
            {cities.map((city) => (
              <FormControlLabel
                key={city}
                control={
                  <Checkbox
                    checked={filters.cities.includes(city)}
                    onChange={() => handleCityToggle(city)}
                    sx={{
                      color: '#DEE2E6',
                      '&.Mui-checked': {
                        color: '#E67E22',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#6C757D' }}>
                    {city}
                  </Typography>
                }
                sx={{ mb: -0.5 }}
              />
            ))}
          </FormGroup>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Themes */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            mb: expandedSections.themes ? 2 : 0,
          }}
          onClick={() => toggleSection('themes')}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Themes
          </Typography>
          {expandedSections.themes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        {expandedSections.themes && (
          <FormGroup>
            {themes.map((theme) => (
              <FormControlLabel
                key={theme}
                control={
                  <Checkbox
                    checked={filters.themes.includes(theme)}
                    onChange={() => handleThemeToggle(theme)}
                    sx={{
                      color: '#DEE2E6',
                      '&.Mui-checked': {
                        color: '#E67E22',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#6C757D' }}>
                    {theme}
                  </Typography>
                }
                sx={{ mb: -0.5 }}
              />
            ))}
          </FormGroup>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Duration */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            mb: expandedSections.duration ? 2 : 0,
          }}
          onClick={() => toggleSection('duration')}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Duration
          </Typography>
          {expandedSections.duration ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        {expandedSections.duration && (
          <FormGroup>
            {durations.map((duration) => (
              <FormControlLabel
                key={duration}
                control={
                  <Checkbox
                    checked={filters.durations.includes(duration)}
                    onChange={() => handleDurationToggle(duration)}
                    sx={{
                      color: '#DEE2E6',
                      '&.Mui-checked': {
                        color: '#E67E22',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#6C757D' }}>
                    {duration}
                  </Typography>
                }
                sx={{ mb: -0.5 }}
              />
            ))}
          </FormGroup>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            mb: expandedSections.price ? 2 : 0,
          }}
          onClick={() => toggleSection('price')}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Price Range
          </Typography>
          {expandedSections.price ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        {expandedSections.price && (
          <Box sx={{ px: 1 }}>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={50}
              step={5}
              marks={[
                { value: 0, label: '$0' },
                { value: 50, label: '$50' },
              ]}
              sx={{
                color: '#E67E22',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#E67E22',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#E67E22',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ${filters.priceRange[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${filters.priceRange[1]}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Rating */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            mb: expandedSections.rating ? 2 : 0,
          }}
          onClick={() => toggleSection('rating')}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Minimum Rating
          </Typography>
          {expandedSections.rating ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        {expandedSections.rating && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[4, 4.5].map((rating) => (
              <Chip
                key={rating}
                label={`${rating}+ Stars`}
                onClick={() => handleRatingChange(rating)}
                sx={{
                  backgroundColor:
                    filters.rating === rating ? '#E67E22' : '#F8F9FA',
                  color: filters.rating === rating ? 'white' : '#6C757D',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor:
                      filters.rating === rating ? '#d35400' : '#E9ECEF',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );

  // Mobile drawer version
  if (mobileOpen !== undefined) {
    return (
      <Box
        sx={{
          width: 300,
          p: 3,
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={onMobileClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {content}
      </Box>
    );
  }

  // Desktop sidebar version
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        p: 3,
        borderRight: '1px solid #DEE2E6',
        height: 'fit-content',
        position: 'sticky',
        top: 80,
      }}
    >
      {content}
    </Box>
  );
}
