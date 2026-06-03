import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutoRenewIcon from '@mui/icons-material/Autorenew';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';

const plans = [
  {
    id: 'daily',
    name: 'Daily',
    price: 2.99,
    duration: '24 hours',
    description: 'Perfect for short trips or quick questions',
    features: ['Unlimited AI conversations', '24-hour access', 'All cities covered'],
    notIncluded: ['Priority support', 'Download history'],
    popular: false,
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: 9.99,
    duration: '7 days',
    description: 'Ideal for a week-long vacation',
    features: ['Unlimited AI conversations', '7-day access', 'All cities covered', 'Priority support'],
    notIncluded: ['Download history'],
    popular: true,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 19.99,
    duration: '30 days',
    description: 'Best value for extended stays or multiple trips',
    features: [
      'Unlimited AI conversations',
      '30-day access',
      'All cities covered',
      'Priority support',
      'Full conversation history',
      'Export chats to PDF',
    ],
    notIncluded: [],
    popular: false,
  },
];

const subscriptionHistory = [
  { id: 'SUB-2026-003', plan: 'Monthly', startDate: '2026-03-01', endDate: '2026-04-01', amount: 19.99, status: 'active' },
  { id: 'SUB-2026-002', plan: 'Weekly', startDate: '2026-02-15', endDate: '2026-02-22', amount: 9.99, status: 'expired' },
  { id: 'SUB-2026-001', plan: 'Daily', startDate: '2026-01-10', endDate: '2026-01-11', amount: 2.99, status: 'expired' },
];

export default function Subscription() {
  const [currentPlan, setCurrentPlan] = useState({
    id: 'monthly',
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-04-01',
    autoRenew: true,
    trialUsed: true,
  });
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggleAutoRenew = () => {
    setCurrentPlan((prev) => ({
      ...prev,
      autoRenew: !prev.autoRenew,
    }));
    setSuccessMessage(
      currentPlan.autoRenew
        ? 'Auto-renewal has been turned off'
        : 'Auto-renewal has been turned on'
    );
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setCurrentPlan((prev) => ({
      ...prev,
      status: 'canceled',
      autoRenew: false,
    }));
    setCancelDialogOpen(false);
    setSuccessMessage('Your subscription has been canceled');
    setShowSuccess(true);
  };

  const daysRemaining = Math.ceil(
    (new Date(currentPlan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Subscription
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your AI assistant subscription
      </Typography>

      {/* Current Subscription Status */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #DEE2E6' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 3,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Current Plan: {currentPlan.id === 'monthly' ? 'Monthly' : currentPlan.id === 'weekly' ? 'Weekly' : 'Daily'}
              </Typography>
              <Chip
                label={currentPlan.status === 'active' ? 'Active' : 'Canceled'}
                color={currentPlan.status === 'active' ? 'success' : 'default'}
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {daysRemaining} days remaining
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoRenewIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {currentPlan.autoRenew ? 'Auto-renewal on' : 'Auto-renewal off'}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Valid until {new Date(currentPlan.endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentPlan.status === 'active' && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleToggleAutoRenew}
                  sx={{
                    borderColor: currentPlan.autoRenew ? '#DC3545' : '#28A745',
                    color: currentPlan.autoRenew ? '#DC3545' : '#28A745',
                    textTransform: 'none',
                  }}
                >
                  {currentPlan.autoRenew ? 'Turn Off Auto-Renew' : 'Turn On Auto-Renew'}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setCancelDialogOpen(true)}
                  sx={{
                    backgroundColor: '#DC3545',
                    '&:hover': { backgroundColor: '#c82333' },
                    textTransform: 'none',
                  }}
                >
                  Cancel Subscription
                </Button>
              </>
            )}
            {currentPlan.status !== 'active' && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#E67E22',
                  '&:hover': { backgroundColor: '#d35400' },
                }}
              >
                Renew Subscription
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Available Plans */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Available Plans
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {plans.map((plan) => (
          <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: plan.popular ? '2px solid #E67E22' : '1px solid #DEE2E6',
                position: 'relative',
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#E67E22',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}

              <CardContent sx={{ flex: 1, p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#E67E22' }}>
                    ${plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    / {plan.duration}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  What's included:
                </Typography>
                <List dense sx={{ mb: 1 }}>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon sx={{ color: '#28A745', fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                {plan.notIncluded.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                      Not included:
                    </Typography>
                    <List dense>
                      {plan.notIncluded.map((item) => (
                        <ListItem key={item} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CloseIcon sx={{ color: '#DC3545', fontSize: 18 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{ color: 'text.secondary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant={plan.id === currentPlan.id ? 'outlined' : 'contained'}
                  disabled={plan.id === currentPlan.id}
                  sx={
                    plan.id === currentPlan.id
                      ? {}
                      : {
                          backgroundColor: '#E67E22',
                          '&:hover': { backgroundColor: '#d35400' },
                          textTransform: 'none',
                        }
                  }
                >
                  {plan.id === currentPlan.id ? 'Current Plan' : 'Switch to This Plan'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Subscription History */}
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #DEE2E6' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Subscription History
        </Typography>

        {subscriptionHistory.map((sub, index) => (
          <Box key={sub.id}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {sub.plan} Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  ${sub.amount.toFixed(2)}
                </Typography>
                <Chip
                  label={sub.status}
                  size="small"
                  color={sub.status === 'active' ? 'success' : 'default'}
                />
              </Box>
            </Box>
            {index < subscriptionHistory.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Subscription?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You'll continue to have access until {new Date(currentPlan.endDate).toLocaleDateString()}
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to cancel your subscription? You'll lose access to:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CloseIcon color="error" /></ListItemIcon>
              <ListItemText primary="Unlimited AI conversations" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CloseIcon color="error" /></ListItemIcon>
              <ListItemText primary="Priority support" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CloseIcon color="error" /></ListItemIcon>
              <ListItemText primary="Conversation history" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Subscription</Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
