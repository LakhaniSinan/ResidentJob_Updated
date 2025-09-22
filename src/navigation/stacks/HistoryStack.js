import {createStackNavigator} from '@react-navigation/stack';
import OnGoingHistory from '../../containers/app/onGoingJobs';
import OnGoingHistoryDetails from '../../containers/app/onGoingHistoryDetails';
import RateUsScreen from '../../containers/app/reviews';
import TermsAndCondition from '../../containers/app/termsAndCondition';

const Stack = createStackNavigator();

function HistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnGoingHistory" component={OnGoingHistory} />
      <Stack.Screen
        name="OnGoingHistoryDetails"
        component={OnGoingHistoryDetails}
      />
      <Stack.Screen name="RateUsScreen" component={RateUsScreen} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
    </Stack.Navigator>
  );
}

export default HistoryStack;
