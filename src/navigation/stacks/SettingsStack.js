import { createStackNavigator } from '@react-navigation/stack';
import Settings from '../../containers/app/settings';
import ChangePassword from '../../containers/auth/changePassword';
import ProfileScreen from '../../containers/profile';
import TermsAndCondition from '../../containers/app/termsAndCondition';

const Stack = createStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Settings" component={ProfileScreen} />
      <Stack.Screen name="CustomerSettings" component={Settings} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />

    </Stack.Navigator>
  );
}

export default SettingsStack;
