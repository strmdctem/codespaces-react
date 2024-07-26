import { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css';
import ContactUs from './components/contact-us/contact-us';
import Disclaimer from './components/disclaimer/disclaimer';
import FDBankView from './components/fd-bank-view/fd-bank-view';
import FDCalculator from './components/fd-calculator/fd-calculator';
import Header from './components/header/header';
import Home from './components/home/home';
import Navigation from './components/navigation/navigation';
import ViewSwitcher from './components/navigation/view-switcher';

const Layout = ({
  toggleTheme,
  isDarkMode,
  isNavigationOpen,
  toggleNavigation
}) => (
  <div className={isDarkMode ? 'app-dark' : 'app-light'}>
    <Header
      onToggleNavigation={toggleNavigation}
      onToggleTheme={toggleTheme}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      isDarkMode={isDarkMode}
    />
    <Navigation isOpen={isNavigationOpen} onToggle={toggleNavigation} />
    <main>
      <Outlet />
    </main>
  </div>
);

function App({ toggleTheme, isDarkMode }) {
  const [isNavigationOpen, setNavigationOpen] = useState(false);

  const toggleNavigation = () => {
    setNavigationOpen(!isNavigationOpen);
  };

  const appClass = isDarkMode ? 'app-dark' : 'app-light';

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          isNavigationOpen={isNavigationOpen}
          toggleNavigation={toggleNavigation}
        />
      ),
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/disclaimer',
          element: <Disclaimer />
        },
        {
          path: '/contact-us',
          element: <ContactUs />
        },
        {
          path: '/fixed-deposit-calculator',
          element: <FDCalculator />
        },
        {
          path: '/fixed-deposit',
          children: [
            {
              index: true, // This is the index route for /fixed-deposit
              element: <ViewSwitcher />
            },
            {
              path: 'calculator',
              element: <FDCalculator />
            },
            {
              path: ':bankName', // Child route for /fixed-deposit/:bankName
              element: <FDBankView /> // Removed the name prop since it's not directly usable this way
            }
          ]
        }
      ]
    }
  ]);

  return (
    <div className={appClass}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
