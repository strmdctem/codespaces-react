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

// Lazy load all calculator components
const EMICalculator = lazy(
  () => import('./components/emi-calculator/emi-calculator')
);
const GoalCalculator = lazy(
  () => import('./components/goal-calculator/goal-calculator')
);
const InterestCalculator = lazy(
  () => import('./components/interest-calculator/interest-calculator')
);
const SIPCalculator = lazy(
  () => import('./components/sip-calculator/sip-calculator')
);
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
  //const navigate = useNavigate();

  const toggleNavigation = () => {
    setNavigationOpen(!isNavigationOpen);
  };

  // useEffect(() => {
  //   const backButtonListener = CapacitorApp.addListener(
  //     'backButton',
  //     ({ canGoBack }) => {
  //       if (canGoBack) {
  //         navigate(-1);
  //       } else {
  //         CapacitorApp.exitApp(); // Exit the app if there's no history
  //       }
  //     }
  //   );

  //   return () => {
  //     backButtonListener.remove(); // Clean up the listener on unmount
  //   };
  // }, [navigate]);

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
          path: 'calculators/*',
          children: [
            {
              path: 'interest-calculator',
              element: (
                <Suspense fallback={<Loading />}>
                  <InterestCalculator />
                </Suspense>
              )
            },
            {
              path: 'emi-calculator',
              element: (
                <Suspense fallback={<Loading />}>
                  <EMICalculator />
                </Suspense>
              )
            },
            {
              path: 'sip-calculator',
              element: (
                <Suspense fallback={<Loading />}>
                  <SIPCalculator />
                </Suspense>
              )
            },
            {
              path: 'goal-calculator',
              element: (
                <Suspense fallback={<Loading />}>
                  <GoalCalculator />
                </Suspense>
              )
            }
          ]
        },
        {
          path: '*',
          element: <Navigate to="/" />
        }
      ]
    }
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
