import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch} from 'react-redux';
import {appImages, fontFamily} from '../../assets';
import {appColors} from '../../constants';
import {setUserData} from '../../redux/slices/Login';

const WelcomeScreens = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleGOTOCustomerHome = () => {
    const dummyData = {
      userDetails: {
        role: 'hire',
        status: true,
      },
    };
    AsyncStorage.setItem('user', JSON.stringify(dummyData));
    AsyncStorage.setItem('token', JSON.stringify('ABCD1234'));
    dispatch(setUserData(dummyData));
  };


  console.log("hahaahaahha");
  

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.primaryColor}}>
      <ImageBackground
        source={appImages.welcomeBgImage}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.white,
          }}>
          Sign Up with email
        </Text> */}

        <TouchableOpacity
          onPress={handleGOTOCustomerHome}
          style={{
            height: width(13),
            width: '100%',
            borderRadius: width(100),
            alignItems: 'center',
            marginHorizontal: width(3),
            justifyContent: 'center',
            backgroundColor: appColors.lightSky,
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
            }}>
            Customer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login', {type: 'worker'})}
          style={{
            height: width(13),
            width: '100%',
            borderRadius: width(100),
            alignItems: 'center',
            margin: width(3),
            justifyContent: 'center',
            backgroundColor: appColors.lightSky,
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
            }}>
            Login As Worker 
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WelcomeScreens;
