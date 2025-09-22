import { createStackNavigator } from '@react-navigation/stack';
import Settings from '../../containers/app/settings';
import ChangePassword from '../../containers/auth/changePassword';
import Login from '../../containers/app/Login';
import Registration from '../../containers/auth/Registration';
import VerifyOTP from '../../containers/auth/VerifyOTP';
import AuthSuccessScress from '../../containers/auth/AuthSuccess';
import ForgetPassword from '../../containers/auth/ForgetPassword';
import ResetPassword from '../../containers/auth/ResetPassword';
import TermsAndCondition from '../../containers/app/termsAndCondition';

const Stack = createStackNavigator();

function CustomerSettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CustomerSettings" component={Settings} />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="Registration"
        component={Registration}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="VerifyOTP"
        component={VerifyOTP}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="AuthSuccessScreen"
        component={AuthSuccessScress}
      />

      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ForgetPassword"
        component={ForgetPassword}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ResetPassword"
        component={ResetPassword}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ChangePassword"
        component={ChangePassword}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="TermsAndCondition"
        component={TermsAndCondition}
      />
    </Stack.Navigator>
  );
}

export default CustomerSettingsStack;
