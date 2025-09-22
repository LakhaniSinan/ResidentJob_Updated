import {initializeApp} from 'firebase/app';
import React, {useEffect, useState} from 'react';
import 'react-native-get-random-values';
import {SafeAreaView} from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import CustomSplashScreen from './src/components/splashScreen';
import {notifications} from './src/constants/variables';
import Navigation from './src/navigation';
import store from './src/redux';

const firebaseConfig = {
  apiKey: 'AIzaSyC6nKmA8eK5I6wrSwHnDOz0YtkUxBJQBKo',
  authDomain: 'residentjob-4da34.firebaseapp.com',
  databaseURL: 'https://residentjob-4da34-default-rtdb.firebaseio.com',
  projectId: 'residentjob-4da34',
  storageBucket: 'residentjob-4da34.firebasestorage.app',
  messagingSenderId: '1064475164652',
  appId: '1:1064475164652:web:85a1c4b2a6a71751d44ac9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const AppContent = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
      {isSplashVisible ? <CustomSplashScreen /> : <Navigation />}
      <NotificationPopup ref={ref => (notifications.popup = ref)} />
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
