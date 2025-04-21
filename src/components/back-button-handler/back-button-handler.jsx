import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useEffect } from 'react';

const BackButtonHandler = ({ children }) => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      alert('BackButtonHandler: Native Platform Detected'); // Debugging line
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        alert(`BackButtonHandler: canGoBack = ${canGoBack}`); // Debugging line
        if (!canGoBack) {
          CapacitorApp.exitApp(); // Exit the app
        } else {
          window.history.back(); // Navigate back
        }
      });

      return () => {
        CapacitorApp.removeAllListeners('backButton'); // Clean up listener
      };
    }
  }, []);

  return children; // Render children inside this component
};

export default BackButtonHandler;
