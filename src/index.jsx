import { Alert } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Header from './components/header/header';
import { isMobile } from './components/utils';
import { initializeFirebase } from './firebase';
import './index.css';

initializeFirebase();

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      dark: '#0d0237',
      main: '#13044f',
      light: '#423672'
    }
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      dark: '#0d0237',
      main: '#fff',
      light: '#423672'
    }
  }
});

const DesktopWarning = () => (
  <>
    <Header></Header>
    <Alert severity="info">
      Our desktop site is currently under construction. please visit our site on
      a mobile device.
    </Alert>
  </>
);

const Main = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem('isDarkMode')) || false
  );
  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
  };

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!isMobile() ? (
          <DesktopWarning />
        ) : (
          <App toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        )}
      </ThemeProvider>
    </StrictMode>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
