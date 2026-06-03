import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import BookIcon from '@mui/icons-material/Book';

const supportFaqs = [
  {
    question: 'How do I download my purchased guides?',
    answer: 'Go to "My Guides" in your account dashboard. Click the "Download" button next to any guide. You can download each guide unlimited times on any device.',
    category: 'Downloads',
  },
  {
    question: 'Can I get a refund for a guide?',
    answer: 'We offer a 7-day money-back guarantee if you haven\'t downloaded the guide. If you\'ve downloaded it but found errors, contact our support team within 7 days.',
    category: 'Refunds',
  },
  {
    question: 'How do I update to the latest version of a guide?',
    answer: 'If an update is available, you\'ll see an "Update Available" badge on the guide card in "My Guides". Click "Download Update" to get the latest version for free.',
    category: 'Updates',
  },
  {
    question: 'How do I cancel my AI subscription?',
    answer: 'Go to "Subscription" in your account. Click "Cancel Subscription" button. You\'ll continue to have access until the end of your current billing period.',
    category: 'Subscription',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are processed securely.',
    category: 'Payments',
  },
];

const quickLinks = [
  { title: 'Getting Started', icon: BookIcon, description: 'Learn how to use our guides' },
  { title: 'AI Assistant Help', icon: ChatIcon, description: 'Tips for using the AI chat' },
  { title: 'Billing FAQ', icon: HelpIcon, description: 'Questions about payments' },
];

export default function Support() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({ subject: '', message: '' });
  };

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Help & Support
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Find answers or contact our support team
      </Typography>

      {/* Quick Links */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickLinks.map((link) => (
          <Grid size={{ xs: 12, md: 4 }} key={link.title}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #DEE2E6',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: '#F8F9FA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <link.icon sx={{ color: '#E67E22', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {link.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {link.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAQ Section */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #DEE2E6' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Frequently Asked Questions
        </Typography>

        {supportFaqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleAccordionChange(`panel${index}`)}
            elevation={0}
            sx={{
              mb: 1.5,
              border: '1px solid #DEE2E6',
              borderRadius: '8px !important',
              overflow: 'hidden',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#E67E22' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label={faq.category} size="small" sx={{ backgroundColor: '#F8F9FA' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Contact Form */}
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #DEE2E6' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Contact Support
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                defaultValue="sarah@example.com"
                disabled
                helperText="We'll reply to this email address"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="Describe your issue or question..."
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              Or email us directly at support@chinawise.travel
            </Typography>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#E67E22',
                '&:hover': { backgroundColor: '#d35400' },
                textTransform: 'none',
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Message sent! We'll get back to you within 24 hours.
        </Alert>
      </Snackbar>
    </>
  );
}
