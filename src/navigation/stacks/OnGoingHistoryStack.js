import {createStackNavigator} from '@react-navigation/stack';
import AddPaymentMethod from '../../containers/app/addPaymentMethod';
import JobsDirections from '../../containers/app/jobsDirections';
import OnGoingGroupDetail from '../../containers/app/onGoingGroupDetail';
import OnGoingHistoryDetails from '../../containers/app/onGoingHistoryDetails';
import OnGoingHistory from '../../containers/app/onGoingJobs';
import PaymentMethod from '../../containers/app/pymentScreen';
import RateUsScreen from '../../containers/app/reviews';
import TermsAndCondition from '../../containers/app/termsAndCondition';
import SearchScreen from '../../containers/app/searchScreen';

const Stack = createStackNavigator();

function OnGoingHistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnGoingHistory" component={OnGoingHistory} />
      <Stack.Screen name="onGoingGroupDetail" component={OnGoingGroupDetail} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} />
      <Stack.Screen name="JobsDirections" component={JobsDirections} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen
        name="OnGoingHistoryDetails"
        component={OnGoingHistoryDetails}
      />
      <Stack.Screen name="RateUsScreen" component={RateUsScreen} />
    </Stack.Navigator>
  );
}

export default OnGoingHistoryStack;
