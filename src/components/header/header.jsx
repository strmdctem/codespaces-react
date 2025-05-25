import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Link, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header({
  onToggleNavigation,
  onToggleTheme,
  isDarkMode
}) {
  const onShareClick = async () => {
    const shareData = {
      title: document.title || 'FinRates',
      text: '',
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
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            onClick={onToggleNavigation}
            size="small"
            edge="start"
            color="inherit"
            sx={{ ml: -2 }}
            aria-label="Navigation"
          >
            <MenuIcon />
          </IconButton>{' '}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/" className="logo-link">
              Fin
              <span className="logo">Rates</span>
            </a>
          </Typography>
          <Stack direction="row">
            {Capacitor.isNativePlatform() && (
              <Link
                href="https://play.google.com/store/apps/details?id=com.finratesindia.finrates"
                target="_blank"
                rel="noopener"
                title="Get it on Google Play"
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  style={{ height: '48px', width: 'auto' }}
                />
              </Link>
            )}
            <IconButton
              color="inherit"
              onClick={onShareClick}
              aria-label="Share"
            >
              <ShareIcon fontSize="medium" />
            </IconButton>
            <IconButton
              onClick={onToggleTheme}
              color="inherit"
              aria-label="Change Theme"
            >
              {isDarkMode ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
