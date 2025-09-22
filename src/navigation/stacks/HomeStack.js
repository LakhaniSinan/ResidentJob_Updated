import {createStackNavigator} from '@react-navigation/stack';
import AllCategory from '../../containers/app/allCategory';
import CategoryDetails from '../../containers/app/categoryDetails';
import ChefProfiles from '../../containers/app/chefProfiles';
import Home from '../../containers/app/home';
import Chat from '../../containers/app/message';
import Notifications from '../../containers/app/notifications';
import PaymentMethod from '../../containers/app/pymentScreen';
import SelectionForm from '../../containers/app/selectionForm';
import AddPaymentMethod from '../../containers/app/addPaymentMethod';
import ChatBox from '../../containers/app/message/ChatBox';
import SearchScreen from '../../containers/app/searchScreen';
import TermsAndCondition from '../../containers/app/termsAndCondition';
import ActiveJobsScreen from '../../containers/app/activeJobs';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ActiveJobsScreen" component={ActiveJobsScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ChefProfiles" component={ChefProfiles} />
      <Stack.Screen name="SelectionForm" component={SelectionForm} />
      <Stack.Screen name="AllCategory" component={AllCategory} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatBox" component={ChatBox} />
    </Stack.Navigator>
  );
}

export default HomeStack;
