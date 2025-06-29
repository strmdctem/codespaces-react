import { Suspense, useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation
} from 'react-router-dom';
import AboutUs from './components/about-us/about-us';
import AppBottomNavigation from './components/bottom-navigation/bottom-navigation';
import ContactUs from './components/contact-us/contact-us';
import Disclaimer from './components/disclaimer/disclaimer';
import EMICalculator from './components/emi-calculator/emi-calculator';
import GoalCalculator from './components/goal-calculator/goal-calculator';
import Header from './components/header/header';
import Home from './components/home/home';
import InterestCalculator from './components/interest-calculator/interest-calculator';
import ArbitrageFund from './components/investment-options/arbitrage-fund';
import InvestmentOptionsAnalyzer from './components/investment-options/investment-options-analyzer';
import Loading from './components/loading/loading';
import LoanRateChangeCalculator from './components/loan-rate-change-calculator/loan-rate-change-calculator';
import LoanVsInvestmentCalculator from './components/loan-vs-investment/loan-vs-investment-calculator';
import MorePage from './components/more/more-page';
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
  <div
    className={`${isDarkMode ? 'app-dark' : 'app-light'} app-with-bottom-nav`}
  >
    <ScrollToTop />
    <Header
      onToggleNavigation={toggleNavigation}
      onToggleTheme={toggleTheme}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      isDarkMode={isDarkMode}
    />
    <Navigation isOpen={isNavigationOpen} onToggle={toggleNavigation} />
    <main className="main-content">
      <Outlet />
    </main>
    <AppBottomNavigation />
  </div>
);

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

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
          path: 'more',
          element: <MorePage />
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
          path: 'government-schemes/*',
          element: (
            <Suspense fallback={<Loading />}>
              <ViewSwitcher />
            </Suspense>
          )
        },
        {
          path: 'home-loan/*',
          element: (
            <Suspense fallback={<Loading />}>
              <ViewSwitcher />
            </Suspense>
          )
        },
        {
          path: 'non-equity-investment-options-analyzer/*',
          children: [
            {
              index: true,
              element: <InvestmentOptionsAnalyzer />
            },
            {
              path: 'arbitrage-fund',
              element: (
                <Suspense fallback={<Loading />}>
                  <ArbitrageFund />
                </Suspense>
              )
            }
          ]
        },
        {
          path: 'investment-options-analyzer/*',
          children: [
            {
              index: true,
              element: <InvestmentOptionsAnalyzer />
            },
            {
              path: 'arbitrage-fund',
              element: (
                <Suspense fallback={<Loading />}>
                  <ArbitrageFund />
                </Suspense>
              )
            }
          ]
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
            },
            {
              path: 'loan-rate-change-calculator',
              element: <LoanRateChangeCalculator />
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
