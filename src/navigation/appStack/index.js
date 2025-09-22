import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import AllCategory from '../../containers/app/allCategory';
import AllFoodByCategory from '../../containers/app/allFoodByCategory';
import ChatWithAdmin from '../../containers/app/chatWithAdmin';
import MyReviews from '../../containers/app/myReviews';
import OnGoingHistoryDetails from '../../containers/app/onGoingHistoryDetails';
import OnGoingHistory from '../../containers/app/onGoingJobs';
import Settings from '../../containers/app/settings';
import ChangePassword from '../../containers/auth/changePassword';
import Login from '../../containers/app/Login';
// import HomeBottom from '../bottomNavigation';
// import CustomDrawerContent from '../CustomDrawer';
import MessageStack from './messageStack';

const Drawer = createDrawerNavigator();

function AppStack() {
  const { user } = useSelector(state => state.LoginSlice);
  useFocusEffect(
    useCallback(() => {
      try {
        const messagesRef = ref(
          getDatabase(),
          `messages/${user?.userDetails?._id}/6757326bc25e5799b56786a6`,
        );
        onValue(messagesRef, snapshot => {
          const data = snapshot.val();
          // Alert.alert('New Message From Admin');
        });
      } catch (error) {
        console.log(error, 'errorrrrrrrrrrr');
      }
    }, []),
  );

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      {/* <Drawer.Screen name="HomeBottom" component={HomeBottom} /> */}
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen
        name="OnGoingHistoryDetails"
        component={OnGoingHistoryDetails}
      />
      <Drawer.Screen name="OnGoingHistory" component={OnGoingHistory} />
      <Drawer.Screen name="AllCategory" component={AllCategory} />
      <Drawer.Screen name="MyReviews" component={MyReviews} />
      <Drawer.Screen name="AllFoodByCategory" component={AllFoodByCategory} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
      <Drawer.Screen name="Message" component={MessageStack} />
      <Drawer.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ChatWithAdmin"
        component={ChatWithAdmin}
      />
    </Drawer.Navigator>
  );
}

export default AppStack;
