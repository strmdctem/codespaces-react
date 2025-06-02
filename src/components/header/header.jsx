import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import { alpha, IconButton, Link, Stack, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header({
  onToggleNavigation,
  onToggleTheme,
  isDarkMode
}) {
  const theme = useTheme();

  const onShareClick = async () => {
    const shareData = {
      title: document.title || 'FinRates',
      text: document.title || 'FinRates',
      url: window.location.href || 'https://finrates.co.in'
    };
    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share(shareData);
      } else if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch (error) {
      console.warn('Share error:', error);
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          //background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)}, ${alpha(theme.palette.secondary.main, 0.95)})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            minHeight: 56,
            px: { xs: 2, sm: 3 }
          }}
        >
          <IconButton
            onClick={onToggleNavigation}
            size="medium"
            edge="start"
            color="inherit"
            sx={{
              ml: -1,
              mr: 1,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.06),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`
              }
            }}
            aria-label="Navigation"
          >
            <MenuIcon fontSize="small" />
          </IconButton>          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}
          >            <a
              href="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease-out',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              }}
            >              <span
                style={{
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: '0.1px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  filter: 'brightness(1.05)'
                }}
              >
                Fin
              </span>              <span
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #1dd2bd 0%, #0891b2 50%, #1e40af 100%)'
                    : 'linear-gradient(135deg, #0d9488 0%, #0891b2 30%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 700,
                  letterSpacing: '0.1px',
                  textShadow: isDarkMode 
                    ? '0 1px 3px rgba(29, 210, 189, 0.4)'
                    : '0 1px 3px rgba(13, 148, 136, 0.6)',
                  filter: isDarkMode 
                    ? 'brightness(1.15) contrast(1.1)'
                    : 'brightness(1.2) contrast(1.2) saturate(1.1)',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Rates
              </span>
            </a>
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {Capacitor.isNativePlatform() && (
              <Link
                href="https://play.google.com/store/apps/details?id=com.finratesindia.finrates"
                target="_blank"
                rel="noopener"
                title="Get it on Google Play"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  style={{ height: '40px', width: 'auto' }}
                />
              </Link>
            )}

            <IconButton
              color="inherit"
              onClick={onShareClick}
              aria-label="Share"
              sx={{
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`
                }
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={onToggleTheme}
              color="inherit"
              aria-label="Change Theme"
              sx={{
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`
                }
              }}
            >
              {isDarkMode ? (
                <LightModeOutlinedIcon fontSize="small" />
              ) : (
                <DarkModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
