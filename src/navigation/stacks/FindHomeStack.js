import {createStackNavigator} from '@react-navigation/stack';
import AddNewCard from '../../containers/app/addNewCard';
import FindJobHome from '../../containers/app/findJobHome';
import MyAllCategories from '../../containers/app/myAllCategories';
import MyAllJobs from '../../containers/app/myAllJobs';
import MyWallet from '../../containers/app/myWallet';
import Notifications from '../../containers/app/notifications';
import Payment from '../../containers/app/paymentScreen';
import WithDrawScreen from '../../containers/app/widthDrawalScreen';
import AddCategoryFood from '../../containers/app/addCategoryFood';
import AllFoodByCategory from '../../containers/app/allFoodByCategory';
import Chat from '../../containers/app/message';
import ChatBox from '../../containers/app/message/ChatBox';
import JobsByDate from '../../containers/app/jobsByDate';
import JobsDirections from '../../containers/app/jobsDirections';

const Stack = createStackNavigator();

function FindStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="FindJobHome" component={FindJobHome} />
      <Stack.Screen name="JobsByDate" component={JobsByDate} />
      <Stack.Screen name="MyWallet" component={MyWallet} />
      <Stack.Screen name="AddCategoryFood" component={AddCategoryFood} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="AddNewCard" component={AddNewCard} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="WithDrawScreen" component={WithDrawScreen} />
      <Stack.Screen name="AllFoodByCategory" component={AllFoodByCategory} />
      <Stack.Screen name="MyAllJobs" component={MyAllJobs} />
      <Stack.Screen name="MyAllCategories" component={MyAllCategories} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatBox" component={ChatBox} />
    </Stack.Navigator>
  );
}

export default FindStack;
