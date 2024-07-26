import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header({
  onToggleNavigation,
  onToggleTheme,
  isDarkMode
}) {
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
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/" className="logo-link">
              <span className="logo">F</span>
              in
              <span className="logo">R</span>
              ates
            </a>
          </Typography>
          <Stack direction="row">
            {/* <IconButton color="inherit">
              <InstallDesktopOutlinedIcon />
            </IconButton> */}
            <IconButton onClick={onToggleTheme} color="inherit">
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
