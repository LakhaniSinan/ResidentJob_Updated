import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import { useDispatch } from 'react-redux';
import { appImages, fontFamily } from '../../assets';
import AuthHeader from '../../components/authHeader';
import Button from '../../components/button';
import { appColors } from '../../constants';

const AuthSuccessScress = ({ route }) => {
  const state = route.params;
  console.log(state, 'statestatestatestate123');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const goToLogin = () => {
    // dispatch(setUserData(null));
    // AsyncStorage.removeItem('userData');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login', params: { type: state.registrationType } }],
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: appColors.white,
      }}>
      <AuthHeader showGoBack={true} />
      {state?.type == 'register' && (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: width(90),
            }}>
            <Image
              source={appImages.greenCheckImg}
              resizeMode="contain"
              style={{ height: width(50), width: width(50) }}
            />
            <Text
              style={{
                color: appColors.black,
                fontFamily: fontFamily.poppinsBold,
                fontSize: 32,
                textAlign: 'center',
              }}>
              Success
            </Text>
            <Text
              style={{
                color: appColors.black,
                fontFamily: fontFamily.poppinsRegular,
                textAlign: 'center',
                fontSize: 13,
              }}>
              Registration Sucessfull
            </Text>
            <Text
              style={{
                color: appColors.white,
                fontFamily: fontFamily.poppinsRegular,
                textDecorationLine: 'underline',
              }}>
              {/* {data?.email ? data?.email : data} */}
            </Text>
          </View>
          <View>
            <View style={{ width: width(70) }}>
              <Button
                btnTitle="Go To Login"
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
                handlePressBtn={goToLogin}
              />
            </View>
          </View>
        </View>
      )}
      {state?.type == 'forgot' && (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: appColors.black,
              fontFamily: fontFamily.poppinsBold,
              fontSize: 32,
            }}>
            Forgot Password
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: width(90),
            }}>
            <Image
              source={appImages.greenCheckImg}
              resizeMode="contain"
              style={{ height: width(50), width: width(50) }}
            />
            <Text
              style={{
                color: appColors.black,
                fontFamily: fontFamily.poppinsRegular,
                textAlign: 'center',
                fontSize: 13,
                width: width(70),
              }}>
              Password reset code has been sent on your registered email
            </Text>
            <Text
              style={{
                color: appColors.white,
                fontFamily: fontFamily.poppinsRegular,
                textDecorationLine: 'underline',
              }}>
              {/* {data?.email ? data?.email : data} */}
            </Text>
          </View>
          <View style={{ width: width(70), marginTop: width(10) }}>
            <Button
              btnTitle="Done"
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
              handlePressBtn={() => navigation.navigate('VerifyOTP', state)}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AuthSuccessScress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width(3),
    backgroundColor: appColors.primaryColor,
    justifyContent: 'center',
  },
});
