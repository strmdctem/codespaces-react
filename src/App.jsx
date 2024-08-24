import { lazy, Suspense, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider
} from 'react-router-dom';
import ContactUs from './components/contact-us/contact-us';
import Disclaimer from './components/disclaimer/disclaimer';
import Header from './components/header/header';
import Home from './components/home/home';
import Loading from './components/loading/loading';
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
          element: <Home isDarkMode={isDarkMode} />
        },
        {
          path: 'disclaimer',
          element: <Disclaimer />
        },
        {
          path: 'contact-us',
          element: <ContactUs />
        },
        {
          path: 'fixed-deposit/*',
          element: (
            <Suspense fallback={<Loading />}>
              <ViewSwitcher />
            </Suspense>
          )
        },
        {
          path: '*',
          element: <Navigate to="/" />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
