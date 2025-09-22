import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import { appColors } from '../../../constants';
import { Commands } from 'react-native-maps/lib/MapViewNativeComponent';
import CommonAlert from '../../../components/commanAlert';

const WithDrawScreen = ({ route }) => {
  const state = route.params;
  const constants = useRef(null);
  const navigation = useNavigation();

  const handleWithdraw = async () => {
    constants.current.isVisible({
      status: 'maintainence',
      message: 'Payment withdrawal is under maintenance.',
      handlePressOk: () => {
        constants.current.backdropPress();
        navigation.navigate('FindJobHome');
      },
    });
  };

  const handleClearPayment = async () => { };
  const handleWidthPayment = () => { };

  return (
    <View style={{ flex: 1, backgroundColor: appColors.white }}>
      <AppHeader showBackBtn={true} height={width(20)} />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingHorizontal: width(3),
        }}>
        <View>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
              fontSize: 29,
              textAlign: 'center',
              marginVertical: width(5),
            }}>
            Withdraw Amount
          </Text>
          <View
            style={{
              height: width(50),
              borderRadius: 12,
              borderWidth: 0.5,
              borderColor: appColors.black,
              backgroundColor: appColors.spnishGray,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                fontSize: 25,
                color: appColors.black,
              }}>
              $ 500
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fontFamily.pop,
              color: appColors.black,
              textAlign: 'center',
              marginTop: width(2),
            }}>
            Available Balance : $ 500
          </Text>
        </View>

        <View style={{ marginBottom: width(6) }}>
          <Button
            handlePressBtn={handleWithdraw}
            btnFontSize={12}
            btnTitle={'Withdraw'}
            btnTextStyle={{
              color: appColors.white,
              fontFamily: fontFamily.poppinsBold,
            }}
            buttonContainer={{
              backgroundColor: appColors.lightMehroon,
              borderColor: appColors.lightMehroon,
              borderWidth: 1,
              borderRadius: 100,
              paddingVertical: width(3.2),
            }}
          />
        </View>
      </View>
      <CommonAlert ref={constants} />
    </View>
  );
};

export default WithDrawScreen;
