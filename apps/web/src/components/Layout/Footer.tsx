import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const footerLinks = {
  product: [
    { label: 'Travel Guides', href: '/guides' },
    { label: 'AI Assistant', href: '/ai-assistant' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Free Guides', href: '/guides?free=true' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  { icon: YouTubeIcon, href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2C3E50',
        color: '#FFFFFF',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                letterSpacing: '-0.5px',
              }}
            >
              ChinaWise
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 3,
                maxWidth: 300,
                lineHeight: 1.6,
              }}
            >
              Your trusted companion for exploring China. Expert-curated guides and 24/7 AI assistance for the perfect trip.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      color: '#E67E22',
                      backgroundColor: 'rgba(230,126,34,0.1)',
                    },
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Product Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#FFFFFF',
              }}
            >
              Product
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.product.map((link) => (
                <Box component="li" key={link.label} sx={{ mb: 1.5 }}>
                  <Link
                    href={link.href}
                    underline="none"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: '#E67E22',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#FFFFFF',
              }}
            >
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.company.map((link) => (
                <Box component="li" key={link.label} sx={{ mb: 1.5 }}>
                  <Link
                    href={link.href}
                    underline="none"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: '#E67E22',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#FFFFFF',
              }}
            >
              Support
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.support.map((link) => (
                <Box component="li" key={link.label} sx={{ mb: 1.5 }}>
                  <Link
                    href={link.href}
                    underline="none"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: '#E67E22',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#FFFFFF',
              }}
            >
              Contact
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                mb: 1,
              }}
            >
              contact@chinawise.travel
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
              }}
            >
              24/7 AI Support
            </Typography>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 4,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
            }}
          >
            © {new Date().getFullYear()} ChinaWise. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="/privacy"
              underline="none"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                '&:hover': {
                  color: '#E67E22',
                },
              }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              underline="none"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                '&:hover': {
                  color: '#E67E22',
                },
              }}
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              underline="none"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                '&:hover': {
                  color: '#E67E22',
                },
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
