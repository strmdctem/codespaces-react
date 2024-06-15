import { useState } from 'react';
import './App.css';
import Header from './components/header/header';
import Navigation from './components/navigation/navigation';
import ViewSwitcher from './components/navigation/view-switcher';

function App() {
  const [isNavigationOpen, setNavigationOpen] = useState(false);

  const toggleNavigation = () => {
    setNavigationOpen(!isNavigationOpen);
  };

  return (
    <>
      <Header
        onToggleNavigation={toggleNavigation}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      />
      <Navigation isOpen={isNavigationOpen} onToggle={toggleNavigation} />
      <ViewSwitcher />
    </>
  );
}

export default App;
