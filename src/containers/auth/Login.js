import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getApp
} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  requestPermission,
  registerDeviceForRemoteMessages,
  AuthorizationStatus
} from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Switch
} from 'react-native';
import { width } from 'react-native-dimension';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch } from 'react-redux';
import { appIcons, fontFamily } from '../../assets';
import AuthHeader from '../../components/authHeader';
import Button from '../../components/button';
import Loader from '../../components/loader';
import InputField from '../../components/textInput';
import { appColors } from '../../constants';
import { setUserData } from '../../redux/slices/Login';
import { loginUser } from '../../services/authentication';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import { googleLogin } from '../../services/socialLogin';
import AppHeader from '../../components/appHeader';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import CommonAlert from '../../components/commanAlert';

const Login = ({ route }) => {

  const { type } = route?.params;
  console.log(type, 'typetypetype');
  const constants = useRef(null);
  const [rememberMe, setRememberMe] = useState(false)
  
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        if (savedEmail || savedPassword) {
          setInputVal(prev => ({
            ...prev,
            email: savedEmail || '',
            password: savedPassword || '',
          }));
          setRememberMe(true); // Checkbox checked if credentials exist
        }
      } catch (error) {
        console.log('Error loading saved credentials', error);
      }
    };
    loadSavedCredentials();
  }, []);


  const setupFCM = async () => {
    try {
      const app = getApp();
      const messaging = getMessaging(app);

      // 1. Register
      await messaging.registerDeviceForRemoteMessages();

      // 2. Request permission
      const authStatus = await messaging.requestPermission({
        sound: true,
        badge: true,
        alert: true,
      });

      if (
        authStatus !== AuthorizationStatus.AUTHORIZED &&
        authStatus !== AuthorizationStatus.PROVISIONAL
      ) {
        console.log("❌ Push permission not granted");
        return null;
      }

      // 3. Delay for iOS
      if (Platform.OS === "ios") {
        await new Promise(res => setTimeout(res, 1000));
      }

      // 4. Get FCM token
      const fcmToken = await messaging.getToken();
      setInputVal({ ...inputVal, token: fcmToken })
      console.log("✅ Got FCM token:", fcmToken);
      return fcmToken;
    } catch (e) {
      console.log("🚨 Error in setupFCM:", e);
      return null;
    }
  };

  useEffect(() => {
    setupFCM();
  }, []);


  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [inputVal, setInputVal] = useState({
    email: '',
    password: '',
    token: '',
  });


  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1064475164652-s7p3ld0brarmi7i6fa1sl316n5l4jl2i.apps.googleusercontent.com',
      profileImageSize: 120,
    });
  }, []);

  const handleChange = (name, value) => {
    setInputVal({ ...inputVal, [name]: value });
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      let params = {
        name: userInfo.user.name,
        image: userInfo.user.photo,
        email: userInfo.user.email,
        fcm: inputVal.token,
        role: type,
        loginType: 'Google',
        appleUserId: '',
        identityToken: '',
        isFirstLogin: false,
      };
      console.log(params, 'paramsparamsparams');
      socialLogin(params);
    } catch (error) {
      console.log(error, 'errorrrrrrrrrrrrrrrrrr');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };

  const socialLogin = async data => {
    setIsLoading(true);
    googleLogin(data)
      .then(responseee => {
        setIsLoading(false);
        console.log(responseee?.data, 'responseeeresponseeeresponseee');

        if (responseee.status == 200 || responseee.status == 201) {
          let data = responseee.data.data;
          console.log(data, 'datadatadata');

          let token = responseee.data.data.token;
          dispatch(setUserData(data));
          AsyncStorage.setItem('userData', JSON.stringify(data));
          AsyncStorage.setItem('token', JSON.stringify(token));
        } else {
          constants.current.isVisible({
            status: 'error',
            message: responseee.data.message,
          });
        }
      })
      .catch(errrr => { });
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('🍎 Starting Apple Sign In...');

      // Check if Apple authentication is available (iOS 13+)
      const isSupported = await appleAuth.isSupported;
      console.log('📱 Apple Sign In supported:', isSupported);

      if (!isSupported) {
        setIsLoading(false);
        Alert.alert(
          'Not Supported',
          'Apple Sign In requires iOS 13 or later. Please use email/password or Google login.',
          [{ text: 'OK' }],
        );
        return;
      }

      console.log('🔐 Requesting Apple authentication...');

      // Request Apple authentication with comprehensive error handling
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });


      // Get the credential state for additional verification
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );


      if (credentialState === appleAuth.State.AUTHORIZED) {
        // User is authenticated - extract user data
        const { identityToken, email, fullName, user } = appleAuthRequestResponse;

        // Validate that we have proper user information
        let userName = '';
        if (fullName?.givenName || fullName?.familyName) {
          const firstName = fullName.givenName || '';
          const lastName = fullName.familyName || '';
          userName = `${firstName} ${lastName}`.trim();
        }

        // Check if we have proper user details

        // Prepare data for backend to match API structure
        let params = {
          name: userName,
          email: email,
          image: '', // Apple doesn't provide profile images
          appleUserId: user, // Changed from appleId to match backend
          identityToken: identityToken,
          fcm: inputVal.token,
          role: type,
          loginType: 'Apple',
          isFirstLogin: false,
        };

        // Call social login with Apple data
        socialLoginApple(params);
      } else {
        setIsLoading(false);
        console.log(
          '❌ Apple authentication failed - credential state:',
          credentialState,
        );

        let errorMessage = 'Apple Sign In authentication failed.';
        if (credentialState === appleAuth.State.REVOKED) {
          errorMessage =
            'Apple Sign In access has been revoked. Please try again.';
        } else if (credentialState === appleAuth.State.NOT_FOUND) {
          errorMessage =
            'Apple Sign In credentials not found. Please try again.';
        }

        Alert.alert('Authentication Failed', errorMessage, [{ text: 'OK' }]);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('🚨 Apple login error:', error);

      // Handle specific Apple Sign In errors
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('👤 User canceled Apple Sign In');
        // Don't show alert for user cancellation
        return;
      } else if (error.code === appleAuth.Error.FAILED) {
        Alert.alert(
          'Sign In Failed',
          'Apple Sign In failed. Please check your internet connection and try again.',
          [{ text: 'OK' }],
        );
      } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
        Alert.alert(
          'Invalid Response',
          'Received invalid response from Apple. Please try again.',
          [{ text: 'OK' }],
        );
      } else if (error.code === appleAuth.Error.NOT_HANDLED) {
        Alert.alert(
          'Not Supported',
          'Apple Sign In is not properly configured. Please use email/password login.',
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert(
          'Sign In Error',
          'Apple Sign In encountered an unexpected error. Please try again or use email/password login.',
          [{ text: 'OK' }],
        );
      }
    }
  };

  const socialLoginApple = async data => {
    try {
      setIsLoading(true);

      // Use the same social login endpoint but with Apple-specific data
      const response = await googleLogin(data); // This handles all social logins

      setIsLoading(false);

      if (response.status === 200 || response.status === 201) {
        const userData = response.data.data;
        const userToken = response.data.data.token;

        console.log(
          '🎉 Apple login successful for user:',
          userData?.name || 'Unknown',
        );

        // Store user data and navigate
        dispatch(setUserData(userData));
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem('token', JSON.stringify(userToken));

        // Show success message
        console.log('💾 Apple login data saved successfully');
      } else {
        console.log('❌ Apple login API error:', response?.data?.message);
        constants.current.isVisible({
          status: 'error',
          message:
            response?.data?.message || 'Apple login failed. Please try again.',
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('🚨 Apple social login network error:', error);

      // Handle different types of errors
      let errorMessage = 'Apple login failed. Please try again.';

      if (error.message && error.message.includes('Network')) {
        errorMessage =
          'Network error. Please check your internet connection and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please try logging in again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      constants.current.isVisible({
        status: 'error',
        message: errorMessage,
      });
    }
  };


  const handleLogin = () => {
    if (inputVal.email == '' || inputVal.password == '') {
      constants.current.isVisible({
        status: 'error',
        message: 'Please enter email and password',
      });
      return;
    }
    let payload = {
      email: inputVal.email,
      password: inputVal.password,
      fcm: inputVal.token,
      type,
    };
    console.log(payload, 'payloadpayloadpayload');

    setIsLoading(true);
    loginUser(payload)
      .then(async response => {
        setIsLoading(false);
        if (response && response.status == 200) {
          let data = response.data.data;
          let token = response.data.data.token;
          dispatch(setUserData(data));
          AsyncStorage.setItem('userData', JSON.stringify(data));
          AsyncStorage.setItem('token', JSON.stringify(token));

          if (rememberMe) {
            await AsyncStorage.setItem('savedEmail', inputVal.email);
            await AsyncStorage.setItem('savedPassword', inputVal.password);
          } else {
            await AsyncStorage.removeItem('savedEmail');
            await AsyncStorage.removeItem('savedPassword');
          }
        } else {
          constants.current.isVisible({
            status: 'error',
            message: response.data.message,
            handlePressOk: () => constants.current.backdropPress(),
          });
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error, 'ERRERERERERERERREERR');
      });
  };

  return (
    <>
      <CommonAlert ref={constants} />
      <Loader isLoading={isLoading} />
      <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>
        <AppHeader
          height={width(20)}
          heading={`Login As ${type == 'hire' ? 'Customer' : 'Worker'}`}
          headingColor={appColors.white}
          leftIconStyle={{ height: 27, width: 27 }}
          leftIcon={appIcons.goBackIcon}
        />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
            }}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                textAlign: 'left',
                paddingHorizontal: width(3),
              }}></Text>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ marginTop: width(5), width: width(95) }}>
                <InputField
                  placeholder="Email"
                  placeholderTextColor={appColors.gray}
                  value={inputVal.email}
                  onChangeText={value => handleChange('email', value)}
                />
              </View>
              <View style={{ marginTop: width(5), width: width(95) }}>
                <InputField
                  placeholder={'Password'}
                  placeholderTextColor={appColors.gray}
                  value={inputVal.password}
                  onChangeText={text => handleChange('password', text)}
                  secureTextEntry={showPass ? false : true}
                  endIcon={
                    <Ionicons
                      name={!showPass ? 'eye-off-outline' : 'eye-outline'}
                      color={appColors.gray}
                      size={23}
                    />
                  }
                  onEndIconPress={() => setShowPass(!showPass)}
                />
              </View>


              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: width(95),
                  marginTop: width(2),
                }}>
                <Switch
                  value={rememberMe}
                  onValueChange={value => setRememberMe(value)}
                  trackColor={{
                    false: appColors.gray,
                    true: appColors.lightMehroon,
                  }}
                  thumbColor={appColors.white}
                />
                <Text
                  style={{
                    marginLeft: width(2),
                    fontFamily: fontFamily.poppinsRegular,
                    color: appColors.black,
                  }}>
                  Remember Me
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgetPassword', { type })}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsSemiBold,
                    width: width(90),
                    marginTop: width(3),
                    textAlign: 'right',
                    color: appColors.lightMehroon,
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: width(95),
                }}>
                <Button
                  btnTitle={'Login'}
                  btnTextStyle={{
                    color: appColors.white,
                    fontFamily: fontFamily.poppinsBold,
                  }}
                  handlePressBtn={handleLogin}
                  buttonContainer={{
                    backgroundColor: appColors.lightMehroon,
                    borderRadius: width(100),
                    borderWidth: 1,
                    borderColor: appColors.gray,
                    marginTop: width(3),
                    paddingVertical: width(3),
                  }}
                />
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: width(5),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  marginTop: width(10),
                }}>
                <View
                  style={{
                    backgroundColor: appColors.black,
                    padding: 0.3,
                    width: width(20),
                    marginVertical: width(3),
                  }}
                />
                {/* <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                  }}>
                  or use social sign up
                </Text> */}

                <View
                  style={{
                    backgroundColor: appColors.black,
                    padding: 0.3,
                    width: width(20),
                    marginVertical: width(3),
                  }}
                />
              </View>
              {type == 'hire' && (
                <View
                  style={{
                    width: width(90),
                  }}>
                  <Button
                    isShadow={true}
                    handlePressBtn={handleGoogleLogin}
                    btnTitle={'Continue with Google'}
                    btnTextStyle={{
                      color: appColors.black,
                      fontFamily: fontFamily.poppinsBold,
                    }}
                    startIcon={
                      <Image
                        source={appIcons.googleIcon}
                        resizeModed="contain"
                        style={{ height: width(10), width: width(10) }}
                      />
                    }
                    buttonContainer={{
                      backgroundColor: appColors.white,
                      borderRadius: width(100),
                      borderWidth: 1,
                      borderColor: appColors.gray,
                      paddingVertical: width(3),
                    }}
                  />

                  {Platform.OS === 'ios' && (
                    <Button
                      handlePressBtn={handleAppleLogin}
                      btnTitle={'Continue with Apple'}
                      isShadow={true}
                      btnTextStyle={{
                        color: appColors.black,
                        fontFamily: fontFamily.poppinsBold,
                      }}
                      startIcon={
                        <Image
                          source={appIcons.appleIcon}
                          resizeModed="contain"
                          style={{ height: width(10), width: width(10) }}
                        />
                      }
                      buttonContainer={{
                        backgroundColor: appColors.white,
                        borderRadius: width(100),
                        borderWidth: 1,
                        borderColor: appColors.gray,
                        marginTop: width(3),
                        paddingVertical: width(3),
                      }}
                    />
                  )}
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: width(10),
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsRegular,
                    color: appColors.black,
                  }}>
                  Don’t have account?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Registration', type)}
                  style={{ marginLeft: width(2) }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.poppinsBold,
                      color: appColors.blue,
                      textDecorationLine: 'underline',
                    }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Login;
