import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';
import UpdatePopUp from '../components/updatePopup';
import ProfileScreen from '../containers/profile';
import { getSettings } from '../services/setting';
import AuthStack from './authStack';
import CustomerDrawer from './customer/CustomerDrawer';
import WorkerDrawer from './worker/WorkerDrawer';

const Navigation = () => {
  const { user } = useSelector(state => state.LoginSlice);
  const updateVar = useRef(null);

  useEffect(() => {
    getAdminSettings();
  }, []);

  const getAdminSettings = async () => {
    try {
      const response = await getSettings();
      let data = response?.data?.data;
      if (response.status === 200 || response.status === 201) {
        checkAppVersion(data);
      } else {
        console.error('Failed to fetch data: Invalid status', response.status);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const checkAppVersion = apiRess => {
    console.log(apiRess, 'apiRessapiRessapiRess');

    if (apiRess) {
      let result = DeviceInfo.getBuildNumber();

      console.log(result, 'resultresultresult');
      console.log(result, apiRess, apiRess.iosPopup, "VADAS");

      if (Platform.OS == 'android') {
        if (Number(result) !== Number(apiRess.androidVersion) && apiRess.androidPopup == true) {
          // updateVar.current.isVisible(apiRess);
        } else {
          updateVar.current.backdropPress();
        }
      } else {
        if (Number(result) !== Number(apiRess.iosVersion) && apiRess.iosPopup == true) {
          setTimeout(() => {
            updateVar.current.isVisible(apiRess);
          }, 2000);
        } else {
          updateVar.current.backdropPress();
        }
      }
    }
  };
  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.userDetails?.role !== 'hire' && user.jobSeekerDetails == null ? (
        <ProfileScreen />
      ) : user.userDetails?.role !== 'hire' && user.jobSeekerDetails != null ? (
        <WorkerDrawer />
      ) : (
        <CustomerDrawer />
      )}
      <UpdatePopUp ref={updateVar} />
    </NavigationContainer>
  );
};

export default Navigation;
