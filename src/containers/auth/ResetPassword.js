import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Alert, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {appIcons, fontFamily} from '../../assets';
import AuthHeader from '../../components/authHeader';
import Button from '../../components/button';
import InputField from '../../components/textInput';
import {appColors} from '../../constants';
import Ionicons from '@react-native-vector-icons/ionicons';
import {ChangePassword} from '../../services/authentication';
import Loader from '../../components/loader';
import CommonAlert from '../../components/commanAlert';
import AppHeader from '../../components/appHeader';

const ResetPassword = () => {
  const route = useRoute();
  console.log(route, 'routerouterouteroute');

  const modalRef = useRef();
  const email = route.params?.email || '';
  const type = route.params?.type || '';
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isloading, setIsLoading] = useState(false);

  const params = {
    code: otp,
    email: email,
    password: password,
    type: type,
  };

  const handleUpdatePassword = () => {
    if (!otp || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    ChangePassword(params)
      .then(response => {
        if (response.status === 200) {
          modalRef.current.isVisible({
            status: 'ok',
            message: response.data.message,
            handlePressOk: () => {
              navigation.navigate('WelcomeScreens');
            },
          });
          console.log('Success', 'Password updated successfully.');
        } else {
          modalRef.current.isVisible({
            status: 'error',
            message: response.data.message,
          });
          console.log(
            'Error',
            response?.data?.message || 'Failed to update password.',
          );
        }
      })
      .catch(error => {
        console.error('Error:', error);
        console.log(
          'Error',
          'An error occurred while updating the password. Please try again.',
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Loader isLoading={isloading} />
      <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
        <AppHeader
          height={width(20)}
          heading={'Password Reset'}
          headingColor={appColors.white}
          leftIconStyle={{height: 27, width: 27}}
          leftIcon={appIcons.goBackIcon}
        />

        <View style={{paddingHorizontal: width(3), marginTop: width(10)}}>
          <InputField
            placeholder={'Enter Your OTP'}
            placeholderTextColor={appColors.gray}
            value={otp}
            maxLength={4}
            keyboardType={'numeric'}
            onChangeText={setOtp}
          />
          <View style={{marginTop: width(4)}}>
            <InputField
              placeholder={'Password'}
              placeholderTextColor={appColors.gray}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              endIcon={
                <Ionicons
                  name={showPass ? 'eye-outline' : 'eye-off-outline'}
                  color={appColors.gray}
                  size={23}
                />
              }
              onEndIconPress={() => setShowPass(!showPass)}
            />
          </View>
          <View style={{marginTop: width(4)}}>
            <InputField
              placeholder={'Confirm Password'}
              placeholderTextColor={appColors.gray}
              secureTextEntry={!showRePass}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              endIcon={
                <Ionicons
                  name={showRePass ? 'eye-outline' : 'eye-off-outline'}
                  color={appColors.gray}
                  size={23}
                />
              }
              onEndIconPress={() => setShowRePass(!showRePass)}
            />
          </View>
          <Button
            btnTitle={'Save Changes'}
            btnTextStyle={{
              color: appColors.white,
              fontFamily: fontFamily.poppinsBold,
            }}
            buttonContainer={{
              backgroundColor: appColors.lightMehroon,
              borderRadius: width(100),
              borderWidth: 1,
              borderColor: appColors.gray,
              marginTop: width(3),
              paddingVertical: width(3),
              opacity: 1,
            }}
            handlePressBtn={handleUpdatePassword}
            disabled={isloading}
          />
        </View>
        <CommonAlert ref={modalRef} />
      </SafeAreaView>
    </>
  );
};

export default ResetPassword;
