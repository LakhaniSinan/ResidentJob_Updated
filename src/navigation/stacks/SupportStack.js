import {createStackNavigator} from '@react-navigation/stack';
import FaqScreen from '../../containers/app/faq';
import Support from '../../containers/app/support';
import GetInTouch from '../../containers/app/getInTouch';

const Stack = createStackNavigator();

function SupportStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="FaqScreen" component={FaqScreen} />
      <Stack.Screen name="GetInTouch" component={GetInTouch} />
    </Stack.Navigator>
  );
}

export default SupportStack;
