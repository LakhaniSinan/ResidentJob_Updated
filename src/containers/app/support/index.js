import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {appIcons, appImages, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import {appColors} from '../../../constants';

const Support = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        height={width(20)}
        heading={'Support'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.drawerIcon}
        isDrawer
      />
      <View style={{paddingHorizontal: width(6)}}>
        <View
          style={{
            marginVertical: width(3),
            height: width(40),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={appImages.customerService}
            resizeMode={'contain'}
            style={{height: '100%'}}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('GetInTouch')}
          style={{
            height: width(20),
            flexDirection: 'row',
            borderRadius: width(5),
            marginTop: width(3),
            alignItems: 'center',
            backgroundColor: appColors.white,
            justifyContent: 'space-between',
            paddingHorizontal: width(8),
            borderColor: appColors.black,
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
            }}>
            Get in Touch
          </Text>
          <Image
            source={appIcons.contactIcon}
            style={{width: 30}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FaqScreen')}
          style={{
            height: width(20),
            flexDirection: 'row',
            borderRadius: width(5),
            marginTop: width(3),
            alignItems: 'center',
            backgroundColor: appColors.white,
            justifyContent: 'space-between',
            paddingHorizontal: width(8),
            borderColor: appColors.black,
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
            }}>
            FAQ
          </Text>
          <Image
            source={appIcons.chatIcon}
            style={{width: 30}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Support;

const styles = StyleSheet.create({});
