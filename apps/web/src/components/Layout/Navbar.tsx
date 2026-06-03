import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useLocation } from 'react-router-dom';

// Hide navbar on scroll down
function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Guides', path: '/guides' },
  { label: 'AI Assistant', path: '/ai-assistant' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: '#2C3E50',
              textDecoration: 'none',
              '&:hover': { backgroundColor: '#F8F9FA' },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem
          component={Link}
          to="/login"
          onClick={handleDrawerToggle}
          sx={{
            color: '#2C3E50',
            textDecoration: 'none',
            '&:hover': { backgroundColor: '#F8F9FA' },
          }}
        >
          <ListItemText primary="Sign In" />
        </ListItem>
      </List>
      <Box sx={{ px: 2, mt: 2 }}>
        <Button
          component={Link}
          to="/register"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#E67E22',
            '&:hover': { backgroundColor: '#d35400' },
            textTransform: 'none',
            fontSize: '16px',
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: isHomePage ? 'transparent' : '#FFFFFF',
            boxShadow: isHomePage ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar
            sx={{
              height: 64,
              maxWidth: 1200,
              width: '100%',
              mx: 'auto',
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 0,
                color: isHomePage ? '#FFFFFF' : '#2C3E50',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '24px',
                letterSpacing: '-0.5px',
              }}
            >
              ChinaWise
            </Typography>

            {/* Desktop Navigation */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                gap: 4,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isHomePage ? '#FFFFFF' : '#2C3E50',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: isHomePage
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(44,62,80,0.05)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Desktop Auth Buttons */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: isHomePage ? '#FFFFFF' : '#2C3E50',
                  textTransform: 'none',
                  fontSize: '16px',
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/guides"
                variant="contained"
                sx={{
                  backgroundColor: '#E67E22',
                  '&:hover': { backgroundColor: '#d35400' },
                  textTransform: 'none',
                  fontSize: '16px',
                  px: 3,
                }}
              >
                Browse Guides
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: 'none' },
                ml: 'auto',
                color: isHomePage ? '#FFFFFF' : '#2C3E50',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer for fixed navbar */}
      <Toolbar sx={{ height: 64 }} />
    </>
  );
}
