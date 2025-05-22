import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeFirebase } from './firebase';
import './index.css';

initializeFirebase();

if (Capacitor.isNativePlatform()) {
  if (!window.androidBackButtonListenerAdded) {
    window.androidBackButtonListenerAdded = true;
    window.addEventListener('androidBackButton', () => {
      if (window.location.pathname !== '/') {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });
  }

  // const fetchVersionAndUpdate = async () => {
  //   alert('fetchVersionAndUpdate called 1'); // Testing alert
  //   try {
  //     const response = await fetch('https://finrates.co.in/version.json', {
  //       cache: 'no-store'
  //     });
  //     if (!response.ok) {
  //       alert('Failed to fetch version.json'); // Testing alert
  //       console.warn('Failed to fetch version.json');
  //       return;
  //     }
  //     const { timestamp } = await response.json();
  //     alert(`Version fetched: ${timestamp}`); // Testing alert
  //     const localVersion = localStorage.getItem('appVersion');
  //     alert(`Local version: ${localVersion}`); // Testing alert

  //     if (localVersion !== timestamp) {
  //       localStorage.setItem('appVersion', timestamp);
  //       alert('Version1 updated, reloading...'); // Testing alert
  //       window.location.reload(true);
  //     }
  //   } catch (error) {
  //     alert('Error fetching version.json'); // Testing alert
  //     console.warn('Error fetching version.json:', error);
  //   }
  // };

  // fetchVersionAndUpdate();
}

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
    //setIsDarkMode(!isDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
    window.location.reload();
  };

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
