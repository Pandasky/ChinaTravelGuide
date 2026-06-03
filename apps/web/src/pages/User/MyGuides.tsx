import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import StarIcon from '@mui/icons-material/Star';

// Mock data - replace with API call
const mockPurchasedGuides = [
  {
    id: '1',
    title: 'Beijing',
    subtitle: 'The Forbidden City to Great Wall',
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&h=400&q=80',
    version: '2.1',
    currentVersion: '2.2',
    purchaseDate: '2026-03-15',
    hasUpdate: true,
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: '2',
    title: 'Shanghai',
    subtitle: 'Modern Metropolis Meets Old Town',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&h=400&q=80',
    version: '1.5',
    currentVersion: '1.5',
    purchaseDate: '2026-02-20',
    hasUpdate: false,
    rating: 4.8,
    reviewCount: 96,
  },
  {
    id: '3',
    title: "Xi'an",
    subtitle: 'Terracotta Warriors & Ancient Capital',
    coverImage: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=600&h=400&q=80',
    version: '1.0',
    currentVersion: '1.0',
    purchaseDate: '2026-01-10',
    hasUpdate: false,
    rating: 4.9,
    reviewCount: 84,
  },
  {
    id: '9',
    title: 'China Travel Basics',
    subtitle: 'Essential Guide for First-Timers',
    coverImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&h=400&q=80',
    version: '3.0',
    currentVersion: '3.1',
    purchaseDate: '2025-12-01',
    hasUpdate: true,
    isFree: true,
    rating: 4.9,
    reviewCount: 234,
  },
];

export default function MyGuides() {
  const [guides, setGuides] = useState(mockPurchasedGuides);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGuide, setSelectedGuide] = useState<typeof mockPurchasedGuides[0] | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, guide: typeof mockPurchasedGuides[0]) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedGuide(guide);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedGuide(null);
  };

  const handleDownload = (guide: typeof mockPurchasedGuides[0]) => {
    setSuccessMessage(`Downloading ${guide.title} guide...`);
    setShowSuccess(true);
    handleMenuClose();
  };

  const handleUpdate = (guide: typeof mockPurchasedGuides[0]) => {
    setSuccessMessage(`${guide.title} updated to version ${guide.currentVersion}`);
    setShowSuccess(true);
    setGuides(prev => prev.map(g =>
      g.id === guide.id ? { ...g, version: g.currentVersion, hasUpdate: false } : g
    ));
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedGuide) {
      setGuides(prev => prev.filter(g => g.id !== selectedGuide.id));
      setSuccessMessage(`${selectedGuide.title} removed from your library`);
      setShowSuccess(true);
    }
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        My Guides
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Access and download your purchased travel guides
      </Typography>

      {guides.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No guides yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Start building your travel library by browsing our guides
          </Typography>
          <Button
            variant="contained"
            href="/guides"
            sx={{
              backgroundColor: '#E67E22',
              '&:hover': { backgroundColor: '#d35400' },
            }}
          >
            Browse Guides
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {guides.map((guide) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={guide.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  position: 'relative',
                  borderRadius: 2,
                  border: '1px solid #DEE2E6',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {/* Update Badge */}
                {guide.hasUpdate && (
                  <Chip
                    label="Update Available"
                    size="small"
                    icon={<UpdateIcon />}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: '#28A745',
                      color: 'white',
                      fontWeight: 600,
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Menu Button */}
                <IconButton
                  onClick={(e) => handleMenuOpen(e, guide)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    zIndex: 1,
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>

                <CardMedia
                  component="img"
                  height={180}
                  image={guide.coverImage}
                  alt={guide.title}
                  sx={{ objectFit: 'cover' }}
                />

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ color: '#E67E22', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {guide.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({guide.reviewCount})
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {guide.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {guide.subtitle}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Version {guide.version}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Purchased {new Date(guide.purchaseDate).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(guide)}
                    sx={{
                      backgroundColor: guide.hasUpdate ? '#28A745' : '#E67E22',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: guide.hasUpdate ? '#218838' : '#d35400',
                      },
                    }}
                  >
                    {guide.hasUpdate ? 'Download Update' : 'Download'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => selectedGuide && handleDownload(selectedGuide)}>
          <DownloadIcon sx={{ mr: 1 }} /> Download
        </MenuItem>
        {selectedGuide?.hasUpdate && (
          <MenuItem onClick={() => selectedGuide && handleUpdate(selectedGuide)}>
            <UpdateIcon sx={{ mr: 1 }} /> Update to v{selectedGuide.currentVersion}
          </MenuItem>
        )}
        <MenuItem onClick={() => { setHistoryDialogOpen(true); handleMenuClose(); }}>
          <HistoryIcon sx={{ mr: 1 }} /> Version History
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }} sx={{ color: '#DC3545' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Remove
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Guide?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{selectedGuide?.title}" from your library?
            You can always re-download it from your order history.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Version History - {selectedGuide?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {[
              { version: '2.2', date: '2026-03-10', changes: ['Added new restaurants in Sanlitun', 'Updated subway map', 'New day trip options'] },
              { version: '2.1', date: '2026-02-01', changes: ['Updated attraction prices', 'New hotel recommendations'] },
              { version: '2.0', date: '2026-01-15', changes: ['Complete guide rewrite', 'Added 7-day itinerary', 'New photography spots'] },
            ].map((item, index) => (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #DEE2E6' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Version {item.version}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.date}
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                  {item.changes.map((change, i) => (
                    <Typography component="li" key={i} variant="body2">
                      {change}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
