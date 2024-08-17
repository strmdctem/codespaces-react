import { lazy, Suspense, useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Header from './components/header/header';
import Navigation from './components/navigation/navigation';
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
const Home = lazy(() => import('./components/home/home'));
const Disclaimer = lazy(() => import('./components/disclaimer/disclaimer'));
const ContactUs = lazy(() => import('./components/contact-us/contact-us'));
const ViewSwitcher = lazy(
  () => import('./components/navigation/view-switcher')
);

const App = ({ toggleTheme, isDarkMode }) => {
  const [isNavigationOpen, setNavigationOpen] = useState(false);

  const toggleNavigation = () => {
    setNavigationOpen(!isNavigationOpen);
  };

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
          index: true,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Home isDarkMode={isDarkMode} />
            </Suspense>
          )
        },
        {
          path: 'disclaimer',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Disclaimer />
            </Suspense>
          )
        },
        {
          path: 'contact-us',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ContactUs />
            </Suspense>
          )
        },
        {
          path: 'fixed-deposit/*',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ViewSwitcher />
            </Suspense>
          )
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
