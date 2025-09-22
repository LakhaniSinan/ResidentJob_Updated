import React, {useState} from 'react';
import {SafeAreaView, Text, View, Alert} from 'react-native';
import {width} from 'react-native-dimension';
import {appIcons, fontFamily} from '../../assets';
import Button from '../../components/button';
import {useNavigation} from '@react-navigation/native';
import AuthHeader from '../../components/authHeader';
import InputField from '../../components/textInput';
import {ForgotPassword} from '../../services/authentication';
import {appColors} from '../../constants';
import Loader from '../../components/loader';
import AppHeader from '../../components/appHeader';

const ForgetPassword = ({route}) => {
  const {type} = route.params;
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = email => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError('Email is required.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendCode = async () => {
    if (!validateEmail(email)) return;

    setLoading(true);
    try {
      const response = await ForgotPassword({email});
      setLoading(false);

      if (response && response.status === 200) {
        console.log('Success', 'OTP has been sent to your email.');
        navigation.navigate('ResetPassword', {email, type});
      } else {
        console.log('lalalalalal');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Error',
        'An error occurred while sending the OTP. Please try again.',
      );
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
        <AppHeader
          height={width(20)}
          heading={'Forget Password'}
          headingColor={appColors.white}
          leftIconStyle={{height: 27, width: 27}}
          leftIcon={appIcons.goBackIcon}
        />

        <View
          style={{
            paddingHorizontal: width(3),
            height: width(40),
            justifyContent: 'space-evenly',
            marginTop: width(10),
          }}>
          <InputField
            placeholder="Email"
            placeholderTextColor={appColors.gray}
            value={email}
            onChangeText={value => setEmail(value)}
            errorText={emailError}
          />
          <Button
            btnTitle={'Send'}
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
            }}
            handlePressBtn={handleSendCode}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ForgetPassword;
