import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Linking, Platform, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import { exitApp } from '@logicwind/react-native-exit-app';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {appImages, fontFamily} from '../../assets';
import {appColors} from '../../constants';
import Button from '../button';

let propsData = {};

const UpdatePopUp = React.forwardRef((props, ref) => {
  console.log(ref, 'refrefrefrefrefref');

  const {handleButton} = props;
  const [isVisible, ModalVisibility] = useState(false);
  const navigation = useNavigation();

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      console.log(params, 'paramsparamsparams');

      propsData = params;
      ModalVisibility(true);
    },
    backdropPress() {
      ModalVisibility(false);
    },
  }));

  console.log(propsData, 'propsDatapropsDatapropsData');

  return (
    <Modal
      style={{alignSelf: 'center', alignItems: 'center'}}
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      backdropOpacity={0.5}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}>
      <View
        style={{
          width: width(86),
          backgroundColor: 'white',
          borderRadius: width(2),
          padding: width(8),
        }}>
        <View style={{alignSelf: 'center'}}>
          <FastImage
            source={appImages.logo}
            style={{
              height: width(25),
              width: width(25),
              borderRadius: 100,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: width(4),
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
            textAlign: 'center',
            marginTop: width(5),
          }}>
          New Features Available!
        </Text>
        <Text
          style={{
            fontSize: width(2.5),
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
            textAlign: 'center',
            marginTop: width(5),
          }}>
          A new version brings performance boosts and exciting features. Please
          update to continue.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: width(5),
          }}>
          <View style={{width: '46%', height: width(14)}}>
            <Button
              handlePressBtn={() => {
                ModalVisibility(false);
                exitApp();
              }}
              btnFontSize={12}
              btnTitle={'Cancel'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
          <View style={{width: '46%', height: width(14)}}>
            <Button
              handlePressBtn={() => {
                Platform.OS == 'android'
                  ? Linking.openURL(propsData?.androidURL)
                  : Linking.openURL(propsData?.iosURL);
              }}
              btnFontSize={12}
              btnTitle={'Update'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default UpdatePopUp;
