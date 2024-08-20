import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAZ7xLlLbKEjvOswdRTWVay2QY4sMwgJZ8',
  authDomain: 'finrates-bdcb4.firebaseapp.com',
  projectId: 'finrates-bdcb4',
  storageBucket: 'finrates-bdcb4.appspot.com',
  messagingSenderId: '1075019299051',
  appId: '1:1075019299051:web:a251bba5b38ffe659826ae',
  measurementId: 'G-VZF7KL51S1'
};

export function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}
