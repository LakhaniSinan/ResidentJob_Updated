import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useDispatch, useSelector} from 'react-redux';
import {appIcons, appImages, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import CustomCheckBox from '../../../components/customcheckBox';
import Loader from '../../../components/loader';
import {appColors} from '../../../constants';
import {setCardDetails} from '../../../redux/slices/CardDetailes';
import {deleteCard, fetchSavedCard} from '../../../services/payment';
import {updateJobAfterPayment} from '../../../services/wallet';

const PaymentMethod = ({route}) => {
  const item = route.params;
  const {user} = useSelector(state => state.LoginSlice);
  const {cardDetails} = useSelector(state => state.CartDetailesSlice);

  const modalRef = useRef();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      handleFetchCard();
    }, []),
  );
  const handleFetchCard = async () => {
    try {
      setIsLoading(true);
      const responce = await fetchSavedCard(user?.userDetails?._id);
      setIsLoading(false);
      console.log(responce?.data, 'responceresponceresponceresponce');

      if (responce.status == 200 || responce.status == 201) {
        dispatch(setCardDetails(responce?.data?.data?.data || []));
      } else {
        console.log(responce.data.error, 'responce.data.message,');
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'errorerrorerror12343576');
    }
  };

  const handleDeleteCard = async () => {
    try {
      modalRef.current.isVisible({
        status: 'confirm',
        message: 'are you sure you want to remove this card?',
        handlePressOk: async () => {
          modalRef.current.backdropPress();
          const responce = await deleteCard({
            paymentId: cardDetails[0]?.id,
            userId: user?.userDetails?._id,
          });
          if (responce.status == 200 || responce.status == 201) {
            modalRef.current.isVisible({
              status: 'ok',
              message: responce.data.message,
              handlePressOk: () => {
                modalRef.current.backdropPress();
                handleFetchCard();
              },
            });
          } else {
            modalRef.current.isVisible({
              status: 'error',
              message: responce.data.message,
            });
          }
        },
      });
    } catch (error) {
      console.log(error, 'errorerrorerror76534524123');
    }
  };

  const renderItem = () => (
    <View
      style={{
        height: width(25),
        borderRadius: 12,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: appColors.gray,
        elevation: 1,
        alignItems: 'center',
        backgroundColor: appColors.white,
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
            style={{width: width(20), height: width(10)}}
          />
        </View>
        <View
          style={{
            // borderRadius: 12,
            overflow: 'hidden',
            marginHorizontal: width(3),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
              fontSize: 12,
            }}>
            {cardDetails[0]?.card?.brand?.toUpperCase()}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
              fontSize: 12,
            }}>{`**** **** **** ${cardDetails[0]?.card?.last4}`}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'column'}}>
        <TouchableOpacity
          onPress={handleDeleteCard}
          style={styles.checkboxContainer}>
          <MaterialIcons name={'delete'} size={20} color={appColors.black} />
        </TouchableOpacity>
        <View style={styles.checkboxContainer}>
          <CustomCheckBox
            checked={true}
            type={'checkout'}
            containerStyles={{
              borderWidth: 1,
              borderColor: appColors.white,
            }}
            onChange={() => {}}
            handleNavigateToLabelType={() => {}}
          />
        </View>
      </View>
    </View>
  );
  const handlePayForJob = async () => {
    try {
      setIsLoading(true);
      const params = {
        userId: user?.userDetails?._id,
        amount: item?.grandTotal,
        jobId: item?.jobId,
        paymentId: cardDetails?.[0]?.id,
        paymentStatus: 'Paid',
      };

      const responce = await updateJobAfterPayment(item?._id, params);

      setIsLoading(false);
      if (responce?.status == 200 || responce?.status == 201) {
        modalRef.current.isVisible({
          status: 'ok',
          message: responce?.data?.message,
          handlePressOk: () => {
            modalRef.current.backdropPress();
            navigation.reset({
              index: 0,
              routes: [{name: 'OnGoingHistoryStack'}],
            });
          },
        });
      } else {
        modalRef.current.isVisible({
          status: 'error',
          message: 'Something went wrong',
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        height={width(20)}
        heading={'Stripe Payment'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.goBackIcon}
      />
      <View style={{flex: 1, padding: width(5)}}>
        {cardDetails?.length > 0 ? (
          renderItem()
        ) : (
          <View style={{height: width(20)}}>
            <Button
              handlePressBtn={() => navigation.navigate('AddPaymentMethod')}
              btnFontSize={12}
              btnTitle={'Add New Card'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.darkBlue,
                borderColor: appColors.darkBlue,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
        )}
      </View>
      <View style={{height: width(20), paddingHorizontal: width(5)}}>
        <Button
          btnFontSize={12}
          handlePressBtn={handlePayForJob}
          disabled={cardDetails == null}
          btnTitle={'Pay'}
          btnTextStyle={{
            color: cardDetails != null ? appColors.white : appColors.black,
          }}
          buttonContainer={{
            backgroundColor:
              cardDetails != null ? appColors.darkBlue : appColors.gray,
            borderRadius: 12,
            paddingVertical: width(3),
          }}
        />
      </View>
      <Loader isLoading={isLoading} />
      <CommonAlert ref={modalRef} />
    </View>
  );
};
export default PaymentMethod;

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
