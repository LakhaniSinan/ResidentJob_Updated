import {createStackNavigator} from '@react-navigation/stack';
import ChefProfiles from '../../containers/app/chefProfiles';
import Login from '../../containers/app/Login';
import SearchScreen from '../../containers/app/searchScreen';
import SelectionForm from '../../containers/app/selectionForm';
import AuthSuccessScress from '../../containers/auth/AuthSuccess';
import ForgetPassword from '../../containers/auth/ForgetPassword';
import Registration from '../../containers/auth/Registration';
import ResetPassword from '../../containers/auth/ResetPassword';
import VerifyOTP from '../../containers/auth/VerifyOTP';
import {ChangePassword} from '../../services/authentication';
import TermsAndCondition from '../../containers/app/termsAndCondition';

const Stack = createStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="SearchScreen"
        component={SearchScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="ChefProfiles"
        component={ChefProfiles}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="SelectionForm"
        component={SelectionForm}
      />
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

export default SearchStack;
