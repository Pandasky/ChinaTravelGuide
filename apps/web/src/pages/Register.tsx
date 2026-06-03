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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import Layout from '../components/Layout';

const steps = ['Account', 'Profile', 'Complete'];

export default function Register() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    country: '',
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value,
    }));
    setError('');
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (!formData.agreeToTerms) {
        setError('Please agree to the Terms of Service');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual registration API call
      console.log('Registration attempt:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to home on success
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
    // TODO: Implement OAuth registration
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
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
              helperText="Must be at least 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  sx={{
                    color: '#E67E22',
                    '&.Mui-checked': {
                      color: '#E67E22',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                  I agree to the{' '}
                  <MuiLink
                    component={Link}
                    to="/terms"
                    sx={{ color: '#E67E22' }}
                  >
                    Terms of Service
                  </MuiLink>{' '}
                  and{' '}
                  <MuiLink
                    component={Link}
                    to="/privacy"
                    sx={{ color: '#E67E22' }}
                  >
                    Privacy Policy
                  </MuiLink>
                </Typography>
              }
              sx={{ mb: 3 }}
            />
          </>
        );

      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Full Name (Optional)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Country (Optional)"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g., United States"
              sx={{ mb: 3 }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontStyle: 'italic' }}
            >
              This information helps us personalize your experience. You can skip this step and update your profile later.
            </Typography>
          </>
        );

      case 2:
        return (
          <Box textAlign="center" py={4}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              🎉 Welcome to ChinaWise!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your account has been created successfully. You're all set to explore China like a local!
            </Typography>
          </Box>
        );

      default:
        return null;
    }
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
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join thousands of travelers exploring China
              </Typography>
            </Box>

            {/* Stepper */}
            {activeStep < 2 && (
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Form Content */}
            <Box component="form" onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {activeStep > 0 && activeStep < 2 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderColor: '#DEE2E6',
                      color: '#2C3E50',
                      textTransform: 'none',
                    }}
                  >
                    Back
                  </Button>
                )}

                {activeStep < 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      flex: 1,
                      backgroundColor: '#E67E22',
                      py: 1.5,
                      fontSize: '16px',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#d35400',
                      },
                    }}
                  >
                    Continue
                  </Button>
                ) : activeStep === 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      flex: 1,
                      backgroundColor: '#E67E22',
                      py: 1.5,
                      fontSize: '16px',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#d35400',
                      },
                    }}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to="/guides"
                    variant="contained"
                    sx={{
                      flex: 1,
                      backgroundColor: '#E67E22',
                      py: 1.5,
                      fontSize: '16px',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#d35400',
                      },
                    }}
                  >
                    Browse Guides
                  </Button>
                )}
              </Box>
            </Box>

            {/* Social Registration - Only show on first step */}
            {activeStep === 0 && (
              <>
                <Divider sx={{ my: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6C757D',
                      px: 2,
                    }}
                  >
                    or sign up with
                  </Typography>
                </Divider>

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
                      onClick={() => handleSocialRegister(provider.name)}
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
              </>
            )}

            {/* Login Link */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: '#E67E22',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
}
