import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'Netherlands',
  'Other',
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    country: 'United States',
    phone: '+1 555-0123',
    bio: 'Travel enthusiast exploring the world one city at a time. Love history, food, and photography.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: API call to update profile
    setIsEditing(false);
    setShowSuccess(true);
  };

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your personal information and account settings
      </Typography>

      <Grid container spacing={3}>
        {/* Avatar Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={profile.avatar}
                sx={{ width: 120, height: 120, mx: 'auto' }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#E67E22',
                  color: 'white',
                  '&:hover': { backgroundColor: '#d35400' },
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email}
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 3, textTransform: 'none' }}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Paper>
        </Grid>

        {/* Profile Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Personal Information
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={profile.country}
                    onChange={handleChange as any}
                    label="Country"
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  placeholder="Tell us a bit about yourself..."
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    backgroundColor: '#E67E22',
                    '&:hover': { backgroundColor: '#d35400' },
                    textTransform: 'none',
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Paper>

          {/* Password Section */}
          <Paper elevation={0} sx={{ p: 4, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Change Password
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} />
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Connected Accounts */}
          <Paper elevation={0} sx={{ p: 4, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Connected Accounts
            </Typography>
            {[
              { provider: 'Google', connected: true, email: 'sarah@gmail.com' },
              { provider: 'Facebook', connected: false, email: null },
              { provider: 'Apple', connected: false, email: null },
            ].map((account) => (
              <Box
                key={account.provider}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: '1px solid #DEE2E6',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {account.provider}
                  </Typography>
                  {account.connected ? (
                    <Typography variant="body2" color="success.main">
                      Connected ({account.email})
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not connected
                    </Typography>
                  )}
                </Box>
                <Button
                  variant={account.connected ? 'outlined' : 'contained'}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    ...(account.connected
                      ? { borderColor: '#DC3545', color: '#DC3545' }
                      : { backgroundColor: '#E67E22', '&:hover': { backgroundColor: '#d35400' } }),
                  }}
                >
                  {account.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
