import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {width} from 'react-native-dimension';
import {appIcons, appImages, fontFamily} from '../../assets';
import AuthHeader from '../../components/authHeader';
import {appColors} from '../../constants';
import Button from '../../components/button';
import {useNavigation} from '@react-navigation/native';
import {registerUser} from '../../services/authentication';
import {sendOtp} from '../../services/authentication';
import Loader from '../../components/loader';
import CommonAlert from '../../components/commanAlert';
import AppHeader from '../../components/appHeader';

const VerifyOTP = ({route}) => {
  const constants = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const params = route.params;
  const CELL_COUNT = 4;
  const navigation = useNavigation();
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [value, setValue] = useState('');
  const [hasError, setHasError] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerifyOTP = async () => {
    if (!value) {
      return constants.current.isVisible({
        status: 'error',
        message: 'Please enter 4-digits code first',
      });
    }

    try {
      setIsLoading(true);
      const response = await registerUser({
        otp: value,
        ...params,
        fullname: params.firstname + params.lastname,
      });
      setIsLoading(false);
      if (response && response.status === 200 && response.data) {
        navigation.navigate('AuthSuccessScreen', {
          user: response.data,
          type: 'register',
          registrationType: params.type,
        });
      } else {
        constants.current.isVisible({
          status: 'error',
          message: response.data.message,
          handlePressOk: () => constants.current.backdropPress(),
        });
      }
    } catch (error) {
      setHasError('An error occurred. Please try again.');
      console.error('Registration Error:', error.message || error);
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    const resendParams = {
      email: params.email,
      contact: params.contact,
      type: params.type,
    };
    setIsLoading(true);
    sendOtp(resendParams)
      .then(response => {
        setIsLoading(false);
        if (response.status == 200 || response.status === 201) {
          constants.current.isVisible({
            status: 'ok',
            message: response.data?.message,
          });
        } else {
          console.error('Failed to resend OTP:', response);
          constants.current.isVisible({
            status: 'error',
            message: response.data?.message,
          });
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error while resending OTP:', error.message || error);
      });
  };

  return (
    <>
      <CommonAlert ref={constants} />
      <Loader isLoading={isLoading} />
      <ScrollView style={{flex: 1, backgroundColor: appColors.white}}>
        <AppHeader
          height={width(20)}
          heading={'Verify Account'}
          headingColor={appColors.white}
          leftIconStyle={{height: 27, width: 27}}
          leftIcon={appIcons.goBackIcon}
        />
        <View
          style={{flex: 1, paddingHorizontal: width(4), alignItems: 'center'}}>
          <Text
            style={{
              color: appColors.lightTextColor,
              fontFamily: fontFamily.poppinsRegular,
              textAlign: 'center',
              fontSize: 13,
            }}>
            Please enter the 4-digit code sent to {params.email}
          </Text>
          <Image
            source={appImages.verifyEmail}
            resizeMode="contain"
            style={{height: width(50), width: width(50)}}
          />
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[
                  !hasError ? styles.cell : styles.cellErr,
                  isFocused && styles.focusCell,
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          {hasError !== '' && (
            <Text
              style={{
                fontFamily: fontFamily.poppinsRegular,
                color: appColors.red,
              }}>
              {hasError}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: width(3),
            }}>
            <Text
              style={{
                color: appColors.black,
                fontFamily: fontFamily.poppinsRegular,
              }}>
              Didn't Receive The OTP?
            </Text>
            <TouchableOpacity onPress={handleResendOTP}>
              <Text
                style={{
                  color: appColors.blue,
                  fontFamily: fontFamily.poppinsBold,
                  marginHorizontal: width(1),
                }}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{width: width(70), marginTop: width(10)}}>
            <Button
              btnTitle="Verify"
              btnTextStyle={{
                color: appColors.white,
                fontFamily: fontFamily.poppinsBold,
              }}
              buttonContainer={{
                backgroundColor: appColors.lightMehroon,
                borderRadius: width(100),
                marginTop: width(3),
                borderWidth: 1,
                borderColor: appColors.gray,
                paddingVertical: width(3),
              }}
              handlePressBtn={handleVerifyOTP}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {marginTop: 25},
  cell: {
    width: 74,
    height: 74,
    lineHeight: 53,
    marginHorizontal: 4,
    fontSize: 25,
    borderRadius: 9,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.grayShadow,
    color: appColors.black,
    marginVertical: 10,
    paddingTop: 9,
  },
  cellErr: {
    width: 74,
    height: 74,
    lineHeight: 53,
    marginHorizontal: 4,
    fontSize: 25,
    borderRadius: 9,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.grayShadow,
    color: appColors.black,
    marginVertical: 10,
    paddingTop: 9,
    borderColor: 'red',
    borderWidth: width(0.3),
  },
  focusCell: {backgroundColor: appColors.grayShadow},
});

export default VerifyOTP;
