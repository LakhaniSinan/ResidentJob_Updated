import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import AntDesign from '@react-native-vector-icons/ant-design';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useDispatch, useSelector} from 'react-redux';
import {appImages, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CustomCheckBox from '../../../components/customcheckBox';
import {appColors} from '../../../constants';
import {setCardDetails} from '../../../redux/slices/CardDetailes';

const Payment = ({route}) => {
  const state = route.params;
  const navigation = useNavigation();
  const {cardDetails} = useSelector(state => state.CartDetailesSlice);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <AppHeader height={width(20)} showBackBtn={true} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: width(3),
          marginTop: width(3),
        }}>
        <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
            fontSize: 16,
          }}>
          Stripe Payment
        </Text>
        <Image
          source={appImages.stripeImg}
          resizeMode="contain"
          style={{width: width(20), height: width(10)}}
        />
      </View>
      {!cardDetails ? (
        <View
          style={{
            justifyContent: 'center',
            margin: width(3),
            marginTop: width(5),
          }}>
          <Button
            handlePressBtn={() => navigation.navigate('AddNewCard')}
            btnFontSize={12}
            btnTitle={'Add Stripe Card'}
            startIcon={
              <AntDesign
                name={'pluscircleo'}
                size={20}
                color={appColors.white}
              />
            }
            btnTextStyle={{color: appColors.white}}
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
      ) : (
        <View>
          <View
            style={{
              height: width(25),
              borderRadius: 12,
              flexDirection: 'row',
              borderWidth: 0.4,
              borderRadius: 12,
              borderColor: appColors.gray,
              elevation: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: width(3),
              paddingHorizontal: width(2.5),
            }}>
            <View
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: width(20),
                  width: width(25),
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: appColors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={appImages.stripeImg}
                  resizeMode="contain"
                  style={{
                    width: width(20),
                    height: width(10),
                    borderWidth: 1,
                    borderColor: appColors.black,
                    borderRadius: 12,
                  }}
                />
              </View>
              <View
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginHorizontal: width(3),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                    fontSize: 14,
                  }}>
                  {cardDetails?.holderName}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                    fontSize: 12,
                  }}>
                  {cardDetails?.accountNumber}
                </Text>
              </View>
            </View>
            <View style={styles.checkboxContainer}>
              <CustomCheckBox
                checked={true}
                type={'checkout'}
                containerStyles={{
                  borderWidth: 1,
                  borderColor: appColors.lightMehroon,
                  backgroundColor: appColors.lightMehroon,
                }}
                onChange={() => {}}
                handleNavigateToLabelType={() => {}}
              />
            </View>
          </View>
          <View style={{paddingHorizontal: width(3)}}>
            <Button
              handlePressBtn={() => {
                dispatch(setCardDetails(null));
              }}
              btnFontSize={12}
              btnTitle={'Remove Card'}
              startIcon={
                <MaterialIcons
                  name={'delete'}
                  size={20}
                  color={appColors.white}
                />
              }
              btnTextStyle={{color: appColors.white}}
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
        </View>
      )}
      <View style={{margin: width(3)}}>
        <Button
          handlePressBtn={() => {
            navigation.navigate('WithDrawScreen', state);
          }}
          btnFontSize={12}
          disabled={!cardDetails}
          btnTitle={'Next'}
          btnTextStyle={{color: appColors.white}}
          buttonContainer={{
            backgroundColor: !cardDetails
              ? appColors.gray
              : appColors.lightMehroon,
            borderColor: !cardDetails ? appColors.gray : appColors.lightMehroon,
            borderWidth: 1,
            borderRadius: 100,
            paddingVertical: width(3.2),
          }}
        />
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: width(1),
  },
  bottomRightText: {
    paddingVertical: width(1),
    color: appColors.white,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width(4),
    marginVertical: width(3),
  },
});
