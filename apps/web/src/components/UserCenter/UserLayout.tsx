import { useState } from 'react';
import {
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  useMediaQuery,
  IconButton,
  AppBar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation, Outlet } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../Layout';

const menuItems = [
  { path: '/user/profile', label: 'Profile', icon: PersonIcon },
  { path: '/user/guides', label: 'My Guides', icon: MenuBookIcon },
  { path: '/user/orders', label: 'Orders', icon: ReceiptIcon },
  { path: '/user/subscription', label: 'Subscription', icon: CardMembershipIcon },
  { path: '/user/support', label: 'Help & Support', icon: HelpIcon },
];

const drawerWidth = 280;

export default function UserLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Info Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid #DEE2E6',
          backgroundColor: '#F8F9FA',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
            sx={{ width: 56, height: 56 }}
          />
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Sarah Johnson
        </Typography>
        <Typography variant="body2" color="text.secondary">
          sarah@example.com
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ px: 2, mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? '#E67E22' : 'transparent',
                  color: isActive ? 'white' : '#2C3E50',
                  '&:hover': {
                    backgroundColor: isActive ? '#d35400' : '#F8F9FA',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : '#6C757D',
                    minWidth: 40,
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Layout>
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Mobile Drawer */}
        {isMobile && (
          <>
            <AppBar
              position="sticky"
              elevation={0}
              sx={{
                backgroundColor: '#F8F9FA',
                borderBottom: '1px solid #DEE2E6',
                display: { md: 'none' },
              }}
            >
              <Toolbar>
                <IconButton onClick={handleDrawerToggle} edge="start">
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                  My Account
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              PaperProps={{ sx: { width: drawerWidth } }}
            >
              {drawer}
            </Drawer>
          </>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: drawerWidth,
                position: 'fixed',
                height: 'calc(100% - 64px)',
                borderRight: '1px solid #DEE2E6',
                backgroundColor: '#FFFFFF',
              }}
            >
              {drawer}
            </Box>
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            backgroundColor: '#F8F9FA',
            minHeight: isMobile ? 'auto' : 'calc(100vh - 64px)',
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}
