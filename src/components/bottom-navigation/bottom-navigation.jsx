import {
  AccountBalance as AccountBalanceIcon,
  AccountBalanceOutlined as AccountBalanceOutlinedIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Balance as BalanceIcon,
  Calculate as CalculateIcon,
  CalculateOutlined as CalculateOutlinedIcon,
  CompareArrowsOutlined,
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  HomeWork as HomeWorkIcon,
  HomeWorkOutlined as HomeWorkOutlinedIcon,
  InsightsOutlined as InsightsOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
  MoreHorizOutlined as MoreHorizOutlinedIcon,
  TableChart as TableChartIcon,
  TableChartOutlined as TableChartOutlinedIcon,
  TrackChangesOutlined as TrackChangesOutlinedIcon,
  TrendingUpOutlined as TrendingUpOutlinedIcon
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

// First section: Main navigation options (5 items)
const MAIN_NAVIGATION_SECTION = [
  {
    label: 'FD Rates',
    value: 'rates',
    icon: <TableChartOutlinedIcon />,
    activeIcon: <TableChartIcon />,
    path: '/fixed-deposit',
    iconColor: 'primary.main'
  },
  {
    label: 'Home Loans',
    value: 'home-loans',
    icon: <HomeWorkOutlinedIcon />,
    activeIcon: <HomeWorkIcon />,
    path: '/home-loan/comparison',
    iconColor: 'primary.main'
  },
  {
    label: 'Government Schemes',
    value: 'schemes',
    icon: <AccountBalanceOutlinedIcon />,
    activeIcon: <AccountBalanceIcon />,
    path: '/government-schemes/comparison',
    iconColor: 'warning.main'
  },
  {
    label: 'Non-Equity Investments',
    value: 'investment-analyzer',
    icon: <InsightsOutlinedIcon />,
    activeIcon: <InsightsOutlinedIcon />,
    path: '/non-equity-investment-options-analyzer',
    iconColor: 'primary.main'
  }
];

// Second section: All calculators
const CALCULATOR_SECTION = [
  {
    label: 'FD Calculator',
    value: 'fd-calculator',
    icon: <TableChartOutlinedIcon />,
    activeIcon: <TableChartIcon />,
    path: '/calculators/fd-calculator',
    iconColor: 'info.main'
  },
  {
    label: 'SIP Calculator',
    value: 'sip-calculator',
    icon: <TrendingUpOutlinedIcon />,
    activeIcon: <TrendingUpOutlinedIcon />,
    path: '/calculators/sip-calculator',
    iconColor: 'success.main'
  },
  {
    label: 'STP Calculator',
    value: 'stp-calculator',
    icon: <InsightsOutlinedIcon />,
    activeIcon: <InsightsOutlinedIcon />,
    path: '/calculators/stp-calculator',
    iconColor: 'secondary.main'
  },
  {
    label: 'SWP Calculator',
    value: 'swp-calculator',
    icon: <InsightsOutlinedIcon />,
    activeIcon: <InsightsOutlinedIcon />,
    path: '/calculators/swp-calculator',
    iconColor: 'success.main'
  },
  {
    label: 'PPF Calculator',
    value: 'ppf-calculator',
    icon: <AccountBalanceWalletIcon />,
    activeIcon: <AccountBalanceWalletIcon />,
    path: '/calculators/ppf-calculator',
    iconColor: 'primary.main'
  },
  {
    label: 'Goal Calculator',
    value: 'goal-calculator',
    icon: <TrackChangesOutlinedIcon />,
    activeIcon: <TrackChangesOutlinedIcon />,
    path: '/calculators/goal-calculator',
    iconColor: 'warning.main'
  },
  {
    label: 'EMI Calculator',
    value: 'emi-calculator',
    icon: <AccountBalanceIcon />,
    activeIcon: <AccountBalanceIcon />,
    path: '/calculators/emi-calculator',
    iconColor: 'info.main'
  },
  // {
  //   label: 'Interest Calculator',
  //   value: 'interest-calculator',
  //   icon: <PercentOutlinedIcon />,
  //   activeIcon: <PercentOutlinedIcon />,
  //   path: '/calculators/interest-calculator',
  //   iconColor: 'secondary.main'
  // },
  {
    label: 'Loan Rate Change',
    value: 'loan-rate-change-calculator',
    icon: <CompareArrowsOutlined />,
    activeIcon: <CompareArrowsOutlined />,
    path: '/calculators/loan-rate-change-calculator',
    iconColor: 'info.main'
  },
  {
    label: 'Loan Prepay vs Invest',
    value: 'loan-prepay-vs-investment-calculator',
    icon: <BalanceIcon />,
    activeIcon: <BalanceIcon />,
    path: '/calculators/loan-prepay-vs-investment-calculator',
    iconColor: 'info.main'
  }
];

export default function AppBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('home');
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const theme = useTheme();
  const isAppMode = isCapacitorApp();

  // Touch/drag state for drawer
  const [dragState, setDragState] = useState({
    isDragging: false,
    startY: 0,
    currentY: 0,
    dragDistance: 0
  }); // Update active tab based on current route
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
    // Don't navigate if we're in the middle of a drag gesture
    if (dragState.isDragging) return;

    setShowSecondaryNav(false);
    navigate(item.path);
  };
  const handleCloseSecondaryNav = () => {
    setShowSecondaryNav(false);
  };
  // Enhanced touch/drag handlers with better performance
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragState({
      isDragging: true,
      startY: touch.clientY,
      currentY: touch.clientY,
      dragDistance: 0
    });

    // Add haptic feedback if available (Capacitor/mobile)
    if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
      window.Capacitor.Plugins.Haptics.selectionStart();
    }
  };

  const handleTouchMove = (e) => {
    if (!dragState.isDragging) return;

    const touch = e.touches[0];
    const dragDistance = touch.clientY - dragState.startY;

    // Only allow dragging down (positive values)
    if (dragDistance > 0) {
      setDragState((prev) => ({
        ...prev,
        currentY: touch.clientY,
        dragDistance
      }));

      // Prevent default scrolling when dragging
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!dragState.isDragging) return;

    const shouldClose = dragState.dragDistance > 80; // Reduced threshold for better UX

    // Add haptic feedback for close action
    if (shouldClose && window.Capacitor && window.Capacitor.Plugins.Haptics) {
      window.Capacitor.Plugins.Haptics.impactMedium();
    }

    if (shouldClose) {
      setShowSecondaryNav(false);
    }

    setDragState({
      isDragging: false,
      startY: 0,
      currentY: 0,
      dragDistance: 0
    });
  };
  // Only show bottom navigation in Capacitor app mode
  if (!isAppMode) {
    return null;
  }
  return (
    <>
      {/* Drawer for Secondary Navigation */}
      <Drawer
        anchor="bottom"
        open={showSecondaryNav}
        onClose={handleCloseSecondaryNav}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
            background: theme.palette.background.paper,
            // Enhanced transform for drag feedback with spring-like feel
            transform:
              dragState.isDragging && dragState.dragDistance > 0
                ? `translateY(${Math.min(dragState.dragDistance * 0.8, 160)}px) scale(${Math.max(0.98, 1 - dragState.dragDistance * 0.0005)})`
                : 'translateY(0px) scale(1)',
            transition: dragState.isDragging
              ? 'none'
              : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
          }
        }}
      >
        {/* Enhanced Drag Handle with better feedback */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 2.5,
            pb: 1.5,
            cursor: 'pointer',
            // Make the drag area larger for easier touch interaction
            minHeight: 44,
            width: '100%',
            // Add subtle background on interaction
            '&:active': {
              backgroundColor: alpha(theme.palette.action.selected, 0.08)
            }
          }}
          onClick={handleCloseSecondaryNav}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Box
            sx={{
              width: 40,
              height: 5,
              backgroundColor: alpha(theme.palette.text.secondary, 0.3),
              borderRadius: 2.5,
              transition: dragState.isDragging
                ? 'none'
                : 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.secondary, 0.5),
                width: 48,
                height: 6
              },
              // Enhanced visual feedback during drag
              ...(dragState.isDragging && {
                backgroundColor: alpha(theme.palette.text.secondary, 0.6),
                width: 52,
                height: 6,
                boxShadow: `0 2px 8px ${alpha(theme.palette.text.secondary, 0.3)}`
              })
            }}
          />
        </Box>
        {/* Main Navigation Section (flexible flexbox that wraps to next row) */}
        <Typography
          sx={{
            display: 'block',
            px: { xs: 2, sm: 3 }
          }}
        >
          Comparisons
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
            gap: 0.5,
            backgroundColor: 'transparent',
            px: { xs: 2, sm: 3 },
            py: 1.5,
            maxWidth: '100%',
            overflow: 'hidden'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {MAIN_NAVIGATION_SECTION.map((item) => (
            <Box
              key={item.value}
              onClick={() => handleSecondaryNavClick(item)}
              onTouchStart={(e) => e.stopPropagation()}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                py: 0.75,
                px: 1,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                minHeight: 'fit-content',
                '&.Mui-selected, &[data-selected="true"]': {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiTypography-root': {
                    fontWeight: 600,
                    opacity: 1
                  }
                },
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
              <Box
                sx={{
                  mb: 0.5,
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2.1rem' },
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: alpha(
                      theme.palette[item.iconColor.split('.')[0]][
                        item.iconColor.split('.')[1]
                      ],
                      0.12
                    ),
                    color:
                      theme.palette[item.iconColor.split('.')[0]][
                        item.iconColor.split('.')[1]
                      ],
                    borderRadius: 1.5,
                    p: 0.6
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
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                  fontWeight: 500,
                  marginTop: '2px',
                  lineHeight: 1.15,
                  transition: 'all 0.2s ease-in-out',
                  opacity: '1 !important',
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  ...(((location.pathname.startsWith(item.path) &&
                    item.path !== '/') ||
                    (item.path === '/' && location.pathname === '/')) && {
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
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
        {/* Calculators Section Heading */}
        <Typography
          variant="subtitle1"
          sx={{
            px: { xs: 2, sm: 3 }
          }}
        >
          Calculators
        </Typography>
        {/* Calculator Section (CSS Grid layout) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
            gap: 0.5,
            backgroundColor: 'transparent',
            px: { xs: 2, sm: 3 },
            py: 0.5,
            maxWidth: '100%',
            overflow: 'hidden'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {CALCULATOR_SECTION.map((item) => (
            <Box
              key={item.value}
              onClick={() => handleSecondaryNavClick(item)}
              onTouchStart={(e) => e.stopPropagation()}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                py: 1,
                px: 1,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                minHeight: 'fit-content',
                '&.Mui-selected, &[data-selected="true"]': {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiTypography-root': {
                    fontWeight: 600,
                    opacity: 1
                  }
                },
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
              <Box
                sx={{
                  mb: 0.5,
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2.1rem' },
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: alpha(
                      theme.palette[item.iconColor.split('.')[0]][
                        item.iconColor.split('.')[1]
                      ],
                      0.12
                    ),
                    color:
                      theme.palette[item.iconColor.split('.')[0]][
                        item.iconColor.split('.')[1]
                      ],
                    borderRadius: 1.5,
                    p: 0.6
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
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                  fontWeight: 500,
                  marginTop: '2px',
                  lineHeight: 1.15,
                  transition: 'all 0.2s ease-in-out',
                  opacity: '1 !important',
                  whiteSpace: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  ...(((location.pathname.startsWith(item.path) &&
                    item.path !== '/') ||
                    (item.path === '/' && location.pathname === '/')) && {
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    color: 'inherit',
                    fontWeight: 600,
                    opacity: '1 !important'
                  })
                }}
              >
                {item.label
                  .replace(/ Calculator$/i, '')
                  .replace('Calculator', '')
                  .replace('calculator', '')}
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
