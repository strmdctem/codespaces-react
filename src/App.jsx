import { Suspense, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider
} from 'react-router-dom';
import AboutUs from './components/about-us/about-us';
import ContactUs from './components/contact-us/contact-us';
import Disclaimer from './components/disclaimer/disclaimer';
import EMICalculator from './components/emi-calculator/emi-calculator';
import GoalCalculator from './components/goal-calculator/goal-calculator';
import Header from './components/header/header';
import Home from './components/home/home';
import InterestCalculator from './components/interest-calculator/interest-calculator';
import Loading from './components/loading/loading';
import LoanVsInvestmentCalculator from './components/loan-vs-investment/loan-vs-investment-calculator';
import CalculatorSwitcher from './components/navigation/calculator-switcher';
import Navigation from './components/navigation/navigation';
import ViewSwitcher from './components/navigation/view-switcher';
import PPFCalculator from './components/ppf/ppf-calculator';
import PrivacyPolicy from './components/privacy-policy/privacy-policy';
import SIPCalculator from './components/sip-calculator/sip-calculator';
import STPCalculator from './components/stp-calculator/stp-calculator';
import SWPCalculator from './components/swp-calculator/swp-calculator';
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

// const ViewSwitcher = lazy(
//   () => import('./components/navigation/view-switcher')
// );

const App = ({ toggleTheme, isDarkMode }) => {
  const [isNavigationOpen, setNavigationOpen] = useState(false);
  //const navigate = useNavigate();

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
          path: 'about-us',
          element: <AboutUs />
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
          path: 'ppf/*',
          element: (
            <Suspense fallback={<Loading />}>
              <ViewSwitcher />
            </Suspense>
          )
        },
        {
          path: 'calculators/*',
          element: (
            <Suspense fallback={<Loading />}>
              <CalculatorSwitcher />
            </Suspense>
          )
        },
        {
          path: 'calculator/*',
          children: [
            {
              path: 'interest-calculator',
              element: <InterestCalculator />
            },
            {
              path: 'emi-calculator',
              element: <EMICalculator />
            },
            {
              path: 'sip-calculator',
              element: <SIPCalculator />
            },
            {
              path: 'stp-calculator',
              element: <STPCalculator />
            },
            {
              path: 'swp-calculator',
              element: <SWPCalculator />
            },
            {
              path: 'goal-calculator',
              element: <GoalCalculator />
            },
            {
              path: 'ppf-calculator',
              element: <PPFCalculator />
            },
            {
              path: 'loan-prepay-vs-investment-calculator',
              element: <LoanVsInvestmentCalculator />
            }
          ]
        },
        {
          path: 'privacy-policy',
          element: <PrivacyPolicy />
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
