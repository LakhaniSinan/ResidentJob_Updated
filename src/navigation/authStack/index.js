import {
  HeaderStyleInterpolators,
  TransitionSpecs,
  createStackNavigator,
} from '@react-navigation/stack';
import AuthSuccessScress from '../../containers/auth/AuthSuccess';
import Login from '../../containers/auth/Login';
import Registration from '../../containers/auth/Registration';
import VerifyOTP from '../../containers/auth/VerifyOTP';
import WelcomeScreens from '../../containers/auth/WelcomeScreens';
import ForgetPassword from '../../containers/auth/ForgetPassword';
import ResetPassword from '../../containers/auth/ResetPassword';
import ChangePassword from '../../containers/auth/changePassword';
import TermsAndCondition from '../../containers/app/termsAndCondition';

const Stack = createStackNavigator();

export const MyTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({current, next, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        ...MyTransition,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        name="WelcomeScreens"
        component={WelcomeScreens}
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
        name="Login"
        component={Login}
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

export default AuthStack;
