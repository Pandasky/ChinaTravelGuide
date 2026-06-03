import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import Layout from '../components/Layout';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual login API call
      console.log('Login attempt:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to home on success
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement OAuth login
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
          backgroundColor: '#F8F9FA',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              border: '1px solid #DEE2E6',
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#2C3E50',
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to access your guides and AI assistant
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      sx={{
                        color: '#E67E22',
                        '&.Mui-checked': {
                          color: '#E67E22',
                        },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    color: '#E67E22',
                    fontSize: '14px',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  backgroundColor: '#E67E22',
                  py: 1.5,
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#d35400',
                  },
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#6C757D',
                  px: 2,
                }}
              >
                or continue with
              </Typography>
            </Divider>

            {/* Social Login Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                mb: 4,
              }}
            >
              {[
                { icon: GoogleIcon, name: 'Google' },
                { icon: FacebookIcon, name: 'Facebook' },
                { icon: AppleIcon, name: 'Apple' },
              ].map((provider) => (
                <Button
                  key={provider.name}
                  variant="outlined"
                  onClick={() => handleSocialLogin(provider.name)}
                  sx={{
                    flex: 1,
                    py: 1,
                    borderColor: '#DEE2E6',
                    color: '#2C3E50',
                    '&:hover': {
                      backgroundColor: '#F8F9FA',
                      borderColor: '#2C3E50',
                    },
                  }}
                >
                  <provider.icon />
                </Button>
              ))}
            </Box>

            {/* Sign Up Link */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink
                  component={Link}
                  to="/register"
                  sx={{
                    color: '#E67E22',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
}
