import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import AllFoodByCategory from '../../containers/app/allFoodByCategory';
import ChatWithAdmin from '../../containers/app/chatWithAdmin';
import MyReviews from '../../containers/app/myReviews';
import OnGoingHistoryDetails from '../../containers/app/onGoingHistoryDetails';
import OnGoingHistory from '../../containers/app/onGoingJobs';
import Settings from '../../containers/app/settings';
import ChangePassword from '../../containers/auth/changePassword';
// import HomeBottom from '../bottomNavigation';
// import MessageStack from '.';
import JobsDirections from '../../containers/app/jobsDirections';
import WorkerCustomDrawer from './CustomDrawer';
import WorkerBottom from './WorkerBottom';
import TermsAndCondition from '../../containers/app/termsAndCondition';
import PrivacyPolicy from '../../containers/app/privacyPolicy';
import JobsTermsAndConditions from '../../containers/app/jobsTermsAndConditions';

const Drawer = createDrawerNavigator();

function WorkerDrawer() {
  const {user} = useSelector(state => state.LoginSlice);
  return (
    <Drawer.Navigator
      drawerContent={props => <WorkerCustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Drawer.Screen name="HomeBottom" component={WorkerBottom} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen
        name="OnGoingHistoryDetails"
        component={OnGoingHistoryDetails}
      />
      <Drawer.Screen name="OnGoingHistory" component={OnGoingHistory} />
      <Drawer.Screen name="MyReviews" component={MyReviews} />
      <Drawer.Screen name="TermsAndCondition" component={TermsAndCondition} />
      <Drawer.Screen
        name="JobsTermsAndConditions"
        component={JobsTermsAndConditions}
      />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Drawer.Screen name="AllFoodByCategory" component={AllFoodByCategory} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
      {/* <Drawer.Screen name="Message" component={MessageStack} /> */}
      <Drawer.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ChatWithAdmin"
        component={ChatWithAdmin}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="JobsDirections"
        component={JobsDirections}
      />
    </Drawer.Navigator>
  );
}

export default WorkerDrawer;
