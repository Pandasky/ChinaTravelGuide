import { createTheme } from '@mui/material/styles';

// Design System Colors from PRD 4.2
const colors = {
  primary: '#2C3E50',
  accent: '#E67E22',
  background: '#FFFFFF',
  backgroundLight: '#F8F9FA',
  textPrimary: '#333333',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  success: '#28A745',
  error: '#DC3545',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.accent,
      contrastText: '#FFFFFF',
    },
    background: {
      default: colors.background,
      paper: colors.backgroundLight,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    error: {
      main: colors.error,
    },
    success: {
      main: colors.success,
    },
  },
  typography: {
    fontFamily: '"Inter", "Noto Sans SC", system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: 1.2,
      '@media (max-width: 768px)': {
        fontSize: '28px',
      },
    },
    h2: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.2,
      '@media (max-width: 768px)': {
        fontSize: '24px',
      },
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.2,
      '@media (max-width: 768px)': {
        fontSize: '20px',
      },
    },
    body1: {
      fontSize: '16px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '14px',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '16px',
        },
        containedPrimary: {
          backgroundColor: colors.accent,
          '&:hover': {
            backgroundColor: '#d35400',
          },
        },
        outlined: {
          borderColor: colors.primary,
          color: colors.primary,
          '&:hover': {
            backgroundColor: colors.backgroundLight,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: colors.border,
            },
            '&:hover fieldset': {
              borderColor: colors.primary,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary,
            },
          },
        },
      },
    },
  },
});

export default theme;
