import {
  AccountBalance as AccountBalanceIcon,
  AccountBalanceOutlined as AccountBalanceOutlinedIcon,
  Analytics as AnalyticsIcon,
  AnalyticsOutlined as AnalyticsOutlinedIcon,
  Calculate as CalculateIcon,
  CalculateOutlined as CalculateOutlinedIcon,
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  HomeWork as HomeWorkIcon,
  HomeWorkOutlined as HomeWorkOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
  MoreHorizOutlined as MoreHorizOutlinedIcon,
  TableChart as TableChartIcon,
  TableChartOutlined as TableChartOutlinedIcon
} from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Drawer,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isCapacitorApp } from '../utils';

const NAVIGATION_ITEMS = [
  {
    label: 'Home',
    value: 'home',
    icon: <HomeOutlinedIcon />,
    activeIcon: <HomeIcon />,
    path: '/'
  },
  {
    label: 'FD Rates',
    value: 'rates',
    icon: <TableChartOutlinedIcon />,
    activeIcon: <TableChartIcon />,
    path: '/fixed-deposit'
  },
  {
    label: 'Home Loans',
    value: 'home-loans',
    icon: <HomeWorkOutlinedIcon />,
    activeIcon: <HomeWorkIcon />,
    path: '/home-loan/comparison'
  },
  {
    label: 'Calculators',
    value: 'calculators',
    icon: <CalculateOutlinedIcon />,
    activeIcon: <CalculateIcon />,
    path: '/calculators/fd-calculator'
  },
  {
    label: 'More',
    value: 'more',
    icon: <MoreHorizOutlinedIcon />,
    activeIcon: <MoreHorizIcon />,
    path: null // This will trigger the drawer
  }
];

// All navigation options in the same sequence for the drawer
const ALL_NAVIGATION_OPTIONS = [
  {
    label: 'Home',
    value: 'home',
    icon: <HomeOutlinedIcon />,
    activeIcon: <HomeIcon />,
    path: '/'
  },
  {
    label: 'FD Rates',
    value: 'rates',
    icon: <TableChartOutlinedIcon />,
    activeIcon: <TableChartIcon />,
    path: '/fixed-deposit'
  },
  {
    label: 'Home Loans',
    value: 'home-loans',
    icon: <HomeWorkOutlinedIcon />,
    activeIcon: <HomeWorkIcon />,
    path: '/home-loan/comparison'
  },
  {
    label: 'Calculators',
    value: 'calculators',
    icon: <CalculateOutlinedIcon />,
    activeIcon: <CalculateIcon />,
    path: '/calculators/fd-calculator'
  },
  {
    label: 'Gov. Schemes',
    value: 'schemes',
    icon: <AccountBalanceOutlinedIcon />,
    activeIcon: <AccountBalanceIcon />,
    path: '/government-schemes/comparison'
  },
  {
    label: 'Investment Analyzer',
    value: 'investment-analyzer',
    icon: <AnalyticsOutlinedIcon />,
    activeIcon: <AnalyticsIcon />,
    path: '/non-equity-investment-options-analyzer'
  }
];

export default function AppBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('home');
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const theme = useTheme();
  const isAppMode = isCapacitorApp(); // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/') {
      setValue('home');
    } else if (currentPath.startsWith('/fixed-deposit')) {
      setValue('rates');
    } else if (currentPath.startsWith('/home-loan')) {
      setValue('home-loans');
    } else if (currentPath.startsWith('/calculators')) {
      setValue('calculators');
    } else if (currentPath.startsWith('/government-schemes')) {
      setValue('more'); // Since gov schemes are in drawer
    } else if (currentPath.startsWith('/investment-options')) {
      setValue('more'); // Since investment analyzer is in drawer
    } else if (
      currentPath.startsWith('/more') ||
      currentPath.startsWith('/about-us') ||
      currentPath.startsWith('/contact-us') ||
      currentPath.startsWith('/privacy-policy') ||
      currentPath.startsWith('/disclaimer')
    ) {
      setValue('more');
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    if (newValue === 'more') {
      setShowSecondaryNav(true);
      setValue('more');
      return;
    }

    setValue(newValue);
    const item = NAVIGATION_ITEMS.find((item) => item.value === newValue);
    if (item && item.path) {
      navigate(item.path);
    }
  };

  const handleSecondaryNavClick = (item) => {
    setShowSecondaryNav(false);
    navigate(item.path);
  };

  const handleCloseSecondaryNav = () => {
    setShowSecondaryNav(false);
  };
  // Only show bottom navigation in Capacitor app mode
  if (!isAppMode) {
    return null;
  }
  return (
    <>
      {' '}
      {/* Drawer for Secondary Navigation */}{' '}
      <Drawer
        anchor="bottom"
        open={showSecondaryNav}
        onClose={handleCloseSecondaryNav}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
            background: theme.palette.background.paper
          }
        }}
      >
        {/* Drag Handle */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 2,
            pb: 1,
            cursor: 'pointer'
          }}
          onClick={handleCloseSecondaryNav}
        >
          <Box
            sx={{
              width: 36,
              height: 4,
              backgroundColor: alpha(theme.palette.text.secondary, 0.3),
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.secondary, 0.5),
                width: 42
              }
            }}
          />
        </Box>

        {/* Two Row Navigation Grid - matching main navigation styling exactly */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 0,
            backgroundColor: 'transparent',
            py: 2
          }}
        >
          {ALL_NAVIGATION_OPTIONS.map((item) => (
            <Box
              key={item.value}
              onClick={() => handleSecondaryNavClick(item)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'auto',
                maxWidth: 'none',
                p: 1,
                borderRadius: '12px',
                margin: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                // Match exact styling from main navigation
                '&.Mui-selected, &[data-selected="true"]': {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiTypography-root': {
                    fontWeight: 600,
                    opacity: 1
                  }
                },
                // Apply selected styling based on current path
                ...((location.pathname.startsWith(item.path) &&
                  item.path !== '/') ||
                (item.path === '/' && location.pathname === '/')
                  ? {
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  : {
                      color: alpha(theme.palette.text.secondary, 0.8),
                      '&:hover': {
                        color: theme.palette.text.primary,
                        backgroundColor: alpha(theme.palette.action.hover, 0.05)
                      }
                    })
              }}
            >
              {' '}
              <Box
                sx={{
                  mb: 0.5,
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                {/* Show active icon if current path matches */}
                {(location.pathname.startsWith(item.path) &&
                  item.path !== '/') ||
                (item.path === '/' && location.pathname === '/')
                  ? item.activeIcon
                  : item.icon}
              </Box>
              <Typography
                variant="caption"
                textAlign="center"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  marginTop: '1px',
                  lineHeight: 1,
                  transition: 'all 0.2s ease-in-out',
                  opacity: '1 !important',
                  // Match selected state from main navigation
                  ...(((location.pathname.startsWith(item.path) &&
                    item.path !== '/') ||
                    (item.path === '/' && location.pathname === '/')) && {
                    fontSize: '0.85rem',
                    color: 'inherit',
                    fontWeight: 600,
                    opacity: '1 !important'
                  })
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
        {/* Safe area padding for bottom */}
        <Box
          sx={{
            height: 'env(safe-area-inset-bottom, 0px)',
            backgroundColor: 'inherit'
          }}
        />
      </Drawer>
      {/* Main Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 -4px 20px ${alpha(theme.palette.common.black, 0.1)}`
        }}
        elevation={0}
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels={true}
          sx={{
            height: 56,
            backgroundColor: 'transparent',
            paddingTop: '2px',
            paddingBottom: '2px',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              maxWidth: 'none',
              paddingTop: '2px',
              paddingBottom: '2px',
              paddingX: '2px',
              borderRadius: '12px',
              marginX: '2px',
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 600,
                  opacity: 1
                }
              },
              '&:not(.Mui-selected)': {
                color: alpha(theme.palette.text.secondary, 0.8),
                '& .MuiBottomNavigationAction-label': {
                  opacity: 1
                },
                '&:hover': {
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(theme.palette.action.hover, 0.05)
                }
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              fontWeight: 500,
              marginTop: '1px',
              lineHeight: 1.1,
              transition: 'all 0.2s ease-in-out',
              opacity: '1 !important',
              '&.Mui-selected': {
                fontSize: '0.7rem',
                color: 'inherit',
                opacity: '1 !important'
              }
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.1rem',
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          {NAVIGATION_ITEMS.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={value === item.value ? item.activeIcon : item.icon}
            />
          ))}
        </BottomNavigation>
        {/* Simple safe area padding */}
        <Box
          sx={{
            height: 'env(safe-area-inset-bottom, 0px)',
            backgroundColor: 'inherit'
          }}
        />
      </Paper>
    </>
  );
}
