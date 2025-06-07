import {
  AccountBalance as AccountBalanceIcon,
  AccountBalanceOutlined as AccountBalanceOutlinedIcon,
  Calculate as CalculateIcon,
  CalculateOutlined as CalculateOutlinedIcon,
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  HomeWork as HomeWorkIcon,
  HomeWorkOutlined as HomeWorkOutlinedIcon,
  TableChart as TableChartIcon,
  TableChartOutlined as TableChartOutlinedIcon
} from '@mui/icons-material';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
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
    label: 'Calculators',
    value: 'calculators',
    icon: <CalculateOutlinedIcon />,
    activeIcon: <CalculateIcon />,
    path: '/calculators/fd-calculator'
  },
  // Home Loans navigation option
  {
    label: 'Home Loans',
    value: 'home-loans',
    icon: <HomeWorkOutlinedIcon />,
    activeIcon: <HomeWorkIcon />,
    path: '/home-loan/comparison'
  },
  {
    label: 'Gov. Schemes',
    value: 'schemes',
    icon: <AccountBalanceOutlinedIcon />,
    activeIcon: <AccountBalanceIcon />,
    path: '/government-schemes/comparison'
  }
  // Commented out More option for now
  // {
  //   label: 'More',
  //   value: 'more',
  //   icon: <MoreOutlinedIcon />,
  //   activeIcon: <MoreIcon />,
  //   path: '/more'
  // }
];

export default function AppBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('home');
  const theme = useTheme();
  const isAppMode = isCapacitorApp();

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/') {
      setValue('home');
    } else if (currentPath.startsWith('/fixed-deposit')) {
      setValue('rates');
    } else if (currentPath.startsWith('/calculators')) {
      setValue('calculators');
    } else if (currentPath.startsWith('/government-schemes')) {
      setValue('schemes');
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
    setValue(newValue);
    const item = NAVIGATION_ITEMS.find((item) => item.value === newValue);
    if (item) {
      navigate(item.path);
    }
  };

  // Only show bottom navigation in Capacitor app mode
  if (!isAppMode) {
    return null;
  }
  return (
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
  );
}
