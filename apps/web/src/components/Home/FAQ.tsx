import { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: 'How often are the guides updated?',
    answer: 'We update all our guides monthly to ensure the information is current and accurate. This includes attraction hours, prices, restaurant recommendations, and transportation details. If you\'ve purchased a guide, you\'ll receive email notifications when updates are available and can download the latest version at no extra cost.',
  },
  {
    question: 'Can I use the AI assistant offline?',
    answer: 'The AI assistant requires an internet connection to function as it uses cloud-based AI models. However, you can download our PDF guides to access all the information offline. We recommend downloading guides before your trip so you have access to all the curated content even without internet.',
  },
  {
    question: 'What\'s included in each PDF guide?',
    answer: 'Each PDF guide includes: a detailed city overview, 3-7 day customizable itineraries, top attractions with insider tips, restaurant recommendations by cuisine and budget, transportation guides (subway, bus, taxi, high-speed rail), accommodation suggestions by neighborhood, practical Chinese phrases, cultural etiquette tips, emergency contacts, and offline maps.',
  },
  {
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'Yes! We offer a 7-day money-back guarantee for PDF guides if you haven\'t downloaded them yet. For AI subscriptions, you can cancel within the 3-day free trial period for a full refund. After the trial, you can cancel anytime and won\'t be charged for the next billing period.',
  },
  {
    question: 'How do I download my purchased guides?',
    answer: 'After purchase, guides are immediately available in your account under "My Guides." You can download them unlimited times on any device. We also send a download link to your email for backup. All guides are in PDF format and work on phones, tablets, and computers.',
  },
  {
    question: 'Does the AI assistant understand Chinese?',
    answer: 'Yes! Our AI assistant has been trained on extensive Chinese travel data and can help you with translations, pronunciation, reading menus, and communicating with locals. It can even help you write down what you need in Chinese characters to show to taxi drivers or restaurant staff.',
  },
  {
    question: 'What makes ChinaWise different from free travel blogs?',
    answer: 'Unlike free blogs that may have outdated information or hidden sponsored content, ChinaWise provides verified, ad-free, expert-curated content. Our guides are written by experienced travel writers who have lived in these cities. Plus, you get 24/7 AI support for real-time questions during your trip.',
  },
  {
    question: 'Do you offer guides in other languages?',
    answer: 'Currently, all our guides and AI assistant are in English. We\'re working on adding support for Spanish, French, German, and Japanese. Sign up for our newsletter to be notified when new language versions are available!',
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ py: 10, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="md">
        {/* Section Header */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '28px', md: '36px' },
              fontWeight: 700,
              color: '#2C3E50',
              mb: 2,
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '18px',
              color: '#6C757D',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Everything you need to know about our guides and AI assistant
          </Typography>
        </Box>

        {/* FAQ Accordions */}
        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              elevation={0}
              sx={{
                mb: 1.5,
                border: '1px solid #DEE2E6',
                borderRadius: '8px !important',
                overflow: 'hidden',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: '#E67E22' }} />
                }
                sx={{
                  '&.Mui-expanded': {
                    minHeight: 48,
                  },
                  '& .MuiAccordionSummary-content': {
                    '&.Mui-expanded': {
                      margin: '12px 0',
                    },
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#2C3E50',
                    fontSize: '16px',
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6C757D',
                    lineHeight: 1.7,
                    fontSize: '15px',
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
