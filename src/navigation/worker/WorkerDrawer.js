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
// import HomeBottom from '../bottomNavigation';
// import MessageStack from '.';
import WorkerCustomDrawer from './CustomDrawer';
import WorkerBottom from './WorkerBottom';

const Drawer = createDrawerNavigator();

function WorkerDrawer() {

    const { user } = useSelector(state => state.LoginSlice);
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
        </Drawer.Navigator>
    );
}

export default WorkerDrawer;
