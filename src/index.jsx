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
}
// Enhanced Light Theme with Better Contrast
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565c0', // Stronger professional blue
      light: '#42a5f5', // Brighter lighter blue
      dark: '#0d47a1', // Much darker blue
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc', // Lighter gray-blue for better mobile contrast
      paper: '#ffffff' // Pure white for cards and papers
    },
    text: {
      primary: '#1a202c', // Even darker text for better mobile readability
      secondary: '#4a5568' // Stronger medium gray for mobile
    },
    action: {
      hover: 'rgba(0, 0, 0, 0.06)', // More noticeable hover effect for mobile
      selected: 'rgba(0, 0, 0, 0.12)', // Clearer selection state
      disabled: 'rgba(0, 0, 0, 0.26)', // Clear disabled state
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(0, 0, 0, 0.12)' // Better focus indication
    }
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.08)', // Enhanced subtle card shadow
    '0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.08)', // Better small elevation
    '0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.06)', // Enhanced medium elevation
    '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.06)', // Better high elevation
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Very high elevation
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 40px 70px -12px rgba(0, 0, 0, 0.35)'
  ]
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Brighter blue for dark mode
      light: '#60a5fa', // Even lighter blue
      dark: '#2563eb', // Darker blue
      contrastText: '#ffffff'
    },
    background: {
      default: '#0f172a', // Dark blue-gray
      paper: '#1e293b' // Lighter dark blue-gray
    },
    text: {
      primary: '#f1f5f9', // Light gray for readability
      secondary: '#cbd5e1' // Medium light gray
    }
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.8)',
    '0 1px 3px 0 rgb(0 0 0 / 0.9), 0 1px 2px -1px rgb(0 0 0 / 0.9)',
    '0 4px 6px -1px rgb(0 0 0 / 0.9), 0 2px 4px -2px rgb(0 0 0 / 0.9)',
    '0 10px 15px -3px rgb(0 0 0 / 0.9), 0 4px 6px -4px rgb(0 0 0 / 0.9)',
    '0 20px 25px -5px rgb(0 0 0 / 0.9), 0 8px 10px -6px rgb(0 0 0 / 0.9)',
    '0 25px 50px -12px rgb(0 0 0 / 0.95)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.95)',
    '0 40px 70px -12px rgba(0, 0, 0, 0.98)'
  ]
});

const Main = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedPreference = localStorage.getItem('isDarkMode');
    if (storedPreference !== null) {
      return JSON.parse(storedPreference);
    }
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });
  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
