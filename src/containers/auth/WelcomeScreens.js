import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
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
import {View} from 'react-native';

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

  console.log('hahaahaahha');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.primaryColor}}>
      <ImageBackground
        source={appImages.welcomeBgImage}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: width(50),
            width: width(50),
            borderRadius: 100,
            overflow: 'hidden',
            marginBottom: width(40),
          }}>
          <Image
            source={appImages.newImage}
            resizeMode="cover"
            style={{height: '100%', width: '100%'}}
          />
        </View>

        <View
          style={{
            width: '100%',
            paddingHorizontal: width(2),
          }}>
          <TouchableOpacity
            onPress={handleGOTOCustomerHome}
            style={{
              height: width(13),
              borderRadius: width(100),
              alignItems: 'center',
              marginHorizontal: width(3),
              justifyContent: 'center',
              backgroundColor: appColors.darkYellow,
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.black,
              }}>
              Resident
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login', {type: 'worker'})}
            style={{
              height: width(13),
              borderRadius: width(100),
              alignItems: 'center',
              margin: width(3),
              justifyContent: 'center',
              backgroundColor: appColors.darkYellow,
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.black,
              }}>
              Login As Worker
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WelcomeScreens;
