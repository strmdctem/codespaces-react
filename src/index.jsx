import { Alert } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Header from './components/header/header';
import { isMobile } from './components/utils';
import './index.css';

const firebaseConfig = {
  apiKey: 'AIzaSyAZ7xLlLbKEjvOswdRTWVay2QY4sMwgJZ8',
  authDomain: 'finrates-bdcb4.firebaseapp.com',
  projectId: 'finrates-bdcb4',
  storageBucket: 'finrates-bdcb4.appspot.com',
  messagingSenderId: '1075019299051',
  appId: '1:1075019299051:web:a251bba5b38ffe659826ae',
  measurementId: 'G-VZF7KL51S1'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
