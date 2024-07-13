import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Disclaimer from './components/disclaimer/disclaimer';
import FDBankView from './components/fd-bank-view/fd-bank-view';
import Header from './components/header/header';
import Home from './components/home/home';
import ViewSwitcher from './components/navigation/view-switcher';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/disclaimer',
    element: <Disclaimer />
  },
  {
    path: '/fixed-deposit',
    children: [
      {
        index: true, // This is the index route for /fixed-deposit
        element: <ViewSwitcher />
      },
      {
        path: ':bankName', // Child route for /fixed-deposit/:bankName
        element: <FDBankView /> // Removed the name prop since it's not directly usable this way
      }
    ]
  }
]);

function App() {
  return (
    <>
      <Header />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
