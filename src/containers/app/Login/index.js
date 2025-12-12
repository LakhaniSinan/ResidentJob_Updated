import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import {width} from 'react-native-dimension';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import Loader from '../../../components/loader';
import InputField from '../../../components/textInput';
import {appColors} from '../../../constants';
import {setUserData} from '../../../redux/slices/Login';
import {loginUser} from '../../../services/authentication';

const Login = ({route}) => {
  const {type} = route?.params || {type: 'hire'};
  const constants = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // New state
  const [inputVal, setInputVal] = useState({
    email: '',
    password: '',
    token: '',
  });

  // Load saved email & password from AsyncStorage
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

  const handleChange = (name, value) => {
    setInputVal({...inputVal, [name]: value});
  };

  const handleLogin = async () => {
    if (inputVal.email === '' || inputVal.password === '') {
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

    setIsLoading(true);
    try {
      const response = await loginUser(payload);
      setIsLoading(false);
      if (response?.status === 200) {
        const data = response.data.data;
        const token = data.token;

        dispatch(setUserData(data));
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        await AsyncStorage.setItem('token', JSON.stringify(token));

        // Save credentials only if rememberMe is checked
        if (rememberMe) {
          await AsyncStorage.setItem('savedEmail', inputVal.email);
          await AsyncStorage.setItem('savedPassword', inputVal.password);
        } else {
          await AsyncStorage.removeItem('savedEmail');
          await AsyncStorage.removeItem('savedPassword');
        }

        navigation.reset({index: 0, routes: [{name: 'HomeBottom'}]});
      } else {
        constants.current.isVisible({
          status: 'error',
          message: response.data.message,
          handlePressOk: () => constants.current.backdropPress(),
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'LOGIN ERROR');
    }
  };

  return (
    <>
      <CommonAlert ref={constants} />
      <Loader isLoading={isLoading} />
      <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
        <AppHeader
          height={width(20)}
          heading={`Login As ${type === 'hire' ? 'Customer' : 'Worker'}`}
          headingColor={appColors.white}
          leftIconStyle={{height: 27, width: 27}}
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, justifyContent: 'space-evenly'}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{marginTop: width(5), width: width(95)}}>
                <InputField
                  placeholder="Email"
                  placeholderTextColor={appColors.gray}
                  value={inputVal.email}
                  onChangeText={value => handleChange('email', value)}
                />
              </View>
              <View style={{marginTop: width(5), width: width(95)}}>
                <InputField
                  placeholder="Password"
                  placeholderTextColor={appColors.gray}
                  value={inputVal.password}
                  onChangeText={text => handleChange('password', text)}
                  secureTextEntry={!showPass}
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

              {/* Remember Me Checkbox */}
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
                onPress={() => navigation.navigate('ForgetPassword', {type})}>
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

              <View style={{width: width(95)}}>
                <Button
                  btnTitle="Login"
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
                  style={{marginLeft: width(2)}}>
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
