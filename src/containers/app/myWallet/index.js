import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {appIcons, appImages, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import {appColors} from '../../../constants';
import {clearPayment, fetchWalletData} from '../../../services/wallet';
import Loader from '../../../components/loader';
import CommonAlert from '../../../components/commanAlert';

export function TypeTab({tabType, handleChangeTabType}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: width(2),
        marginVertical: width(3),
        borderRadius: 12,
        backgroundColor: appColors.gray,
      }}>
      <View style={{width: width(40), marginVertical: width(0)}}>
        <Button
          handlePressBtn={() => handleChangeTabType('successful')}
          btnTitle={'Successful'}
          btnTextStyle={{color: appColors.white}}
          buttonContainer={{
            backgroundColor: '#143A70',
            borderColor: '#143A70',
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: width(3),
          }}
        />
      </View>
      <View style={{width: width(40), marginVertical: width(0)}}>
        <Button
          handlePressBtn={() => handleChangeTabType('pending')}
          btnTitle={'Pending'}
          btnTextStyle={{color: appColors.white}}
          buttonContainer={{
            backgroundColor: '#143A70',
            borderColor: '#143A70',
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: width(3),
          }}
        />
      </View>
    </View>
  );
}

const MyWallet = () => {
  const constants = useRef(null);
  const navigation = useNavigation();
  const {user} = useSelector(state => state.LoginSlice);
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const {cardDetails} = useSelector(state => state.CartDetailesSlice);

  useEffect(() => {
    handleFetchWalletData();
  }, []);
  const handleFetchWalletData = async () => {
    try {
      setIsLoading(true);
      const responce = await fetchWalletData(user?.userDetails?._id);
      setIsLoading(false);

      if (responce.status == 200 || responce.status == 201) {
        let data = responce.data;
        setWalletData(data);
      } else {
        constants.current.isVisible({
          status: 'error',
          message: responce.data.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('🚀 ~ handleFetchWalletData ~ error:', error);
    }
  };
  const handleClearPayment = () => {
    constants.current.isVisible({
      status: 'confirm',
      message: 'Are you sure you want to withdraw your payment?',
      handlePressOk: async () => {
        constants.current.backdropPress();
        try {
          setIsLoading(true);
          const responce = await clearPayment(user?.userDetails?._id);
          setIsLoading(false);

          if (responce.status == 200 || responce.status == 201) {
            handleFetchWalletData();
          } else {
            constants.current.isVisible({
              status: 'error',
              message: responce.data.message,
            });
          }
        } catch (error) {
          setIsLoading(false);
          console.log('🚀 ~ handleFetchWalletData ~ error:', error);
        }
      },
    });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader height={width(20)} showBackBtn={true} />
      <View style={{paddingHorizontal: width(3)}}>
        <Text
          style={{
            fontFamily: fontFamily.poppinsSemiBold,
            color: appColors.black,
            fontSize: 30,
            padding: width(4),
          }}>
          My Wallet
        </Text>
        <View
          style={{
            marginVertical: width(3),
            padding: width(3),
            backgroundColor: appColors.grayShadow,
            borderRadius: 12,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              padding: width(3),
              backgroundColor: appColors.white,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{height: '100%'}}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.black,
                  fontSize: 16,
                }}>
                Total Earnings
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsRegular,
                  color: appColors.black,
                  fontSize: 16,
                }}>
                $ {walletData?.totalEarnings}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: width(3),
              backgroundColor: appColors.white,
              borderRadius: 12,
              flexDirection: 'row',
              marginTop: width(3),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{height: '100%'}}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.black,
                  fontSize: 16,
                }}>
                Available Balance
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsRegular,
                  color: appColors.black,
                  fontSize: 16,
                }}>
                $ {walletData?.availableBalance}
              </Text>
            </View>
          </View>

          <Button
            btnTitle={'Withdrawal'}
            btnTextStyle={{
              color: appColors.white,
              fontFamily: fontFamily.poppinsBold,
            }}
            disabled={walletData?.availableBalance == 0}
            handlePressBtn={handleClearPayment}
            buttonContainer={{
              backgroundColor:
                walletData?.availableBalance == 0
                  ? appColors.gray
                  : appColors.lightMehroon,
              borderRadius: width(100),
              marginTop: width(3),
              paddingVertical: width(3),
            }}
          />
        </View>
        {cardDetails && (
          <View
            style={{
              padding: width(3),
              backgroundColor: appColors.grayShadow,
              borderRadius: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  fontSize: 14,
                  color: appColors.black,
                }}>
                Connected Account
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Payment')}
                style={{
                  height: width(5),
                  width: width(5),
                }}>
                <Image
                  source={appIcons.editIcon}
                  resizeMode="contain"
                  style={{
                    height: '100%',
                    width: '100%',
                    tintColor: appColors.gray,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                padding: width(3),
                backgroundColor: appColors.white,
                borderRadius: 12,
                marginTop: width(4),
              }}>
              <Text
                style={{
                  fontSize: 14,
                  marginVertical: width(2),
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.black,
                }}>
                {cardDetails?.holderName}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                <Text
                  style={{
                    fontSize: 14,
                    marginVertical: width(2),
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                    marginLeft: width(2),
                  }}>
                  {cardDetails?.accountNumber}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <CommonAlert ref={constants} />
      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default MyWallet;
