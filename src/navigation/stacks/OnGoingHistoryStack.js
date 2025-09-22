import {createStackNavigator} from '@react-navigation/stack';
import ActiveJobsScreen from '../../containers/app/activeJobs';
import AddPaymentMethod from '../../containers/app/addPaymentMethod';
import OnGoingGroupDetail from '../../containers/app/onGoingGroupDetail';
import OnGoingHistoryDetails from '../../containers/app/onGoingHistoryDetails';
import PaymentMethod from '../../containers/app/pymentScreen';
import RateUsScreen from '../../containers/app/reviews';
import OnGoingHistory from '../../containers/app/onGoingJobs';
import TermsAndCondition from '../../containers/app/termsAndCondition';

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
      <Stack.Screen
        name="OnGoingHistoryDetails"
        component={OnGoingHistoryDetails}
      />
      <Stack.Screen name="RateUsScreen" component={RateUsScreen} />
    </Stack.Navigator>
  );
}

export default OnGoingHistoryStack;
