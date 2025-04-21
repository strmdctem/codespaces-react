import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeFirebase } from './firebase';
import './index.css';

initializeFirebase();

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      dark: '#0d0237',
      main: '#000080',
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

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      alert('BackButtonHandler: Native Platform Detected'); // Debugging line
      // Register the backbutton event and override default behavior using e.detail.register()
      const backButtonListener = CapacitorApp.addListener('backButton', (e) => {
        // Use e.detail.register to set a high priority handler
        alert('BackButtonHandler: listener triggered'); // Debugging line
        if (window.history.length > 1) {
          alert('BackButtonHandler: canGoBack = true'); // Debugging line
          window.history.back();
        } else {
          CapacitorApp.exitApp();
        }
      });
      return () => {
        backButtonListener.remove();
      };
    }
  }, []);

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      </ThemeProvider>
    </StrictMode>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
