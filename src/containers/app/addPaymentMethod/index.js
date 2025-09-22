import {useNavigation} from '@react-navigation/native';
import {
  CardField,
  createPaymentMethod,
  createToken,
  StripeProvider,
} from '@stripe/stripe-react-native';
import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import Loader from '../../../components/loader';
import {appColors} from '../../../constants';
import {stripePublishKey} from '../../../constants/variables';
import {setCardDetails} from '../../../redux/slices/CardDetailes';
import {SavePaymentCard} from '../../../services/payment';

const AddPaymentMethod = () => {
  const navigation = useNavigation();
  const modalRef = useRef();
  const dispatch = useDispatch();
  const [isCardValid, setIsCardValid] = useState(false);
  const [currentCard, setCurrentCard] = useState();
  const {user} = useSelector(state => state.LoginSlice);
  const [isLoading, setIsLoading] = useState(false);

  const createTokenForStripe = async details => {
    if (!details.complete) {
      console.log('Card details are incomplete');
      return;
    }

    try {
      setIsLoading(true);
      const tokenResponse = await createToken({
        type: 'Card',
        number: details.number,
        expMonth: details.expiryMonth,
        expYear: details.expiryYear,
        cvc: details.cvc,
      });
      const result = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: tokenResponse?.token?.card,
        billingDetails: {
          email: user?.email,
        },
      });

      setIsLoading(false);

      if (tokenResponse.error) {
        console.log('Token creation failed', tokenResponse.error);
        return;
      }

      const params = {
        tokenId: tokenResponse.token.id,
        cardId: tokenResponse.token.card.id,
        pmId: result?.paymentMethod.id,
        last4: details.last4,
        brand: details.brand,
      };

      setCurrentCard(params);

      dispatch(setCardDetails(params));
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating token:', error);
    }
  };

  const handleCardChange = details => {
    setIsCardValid(details.complete);
    if (details.complete) {
      createTokenForStripe(details);
    }
  };

  const handleAddCard = async () => {
    try {
      setIsLoading(true);
      let params = {
        paymentId: currentCard?.tokenId,
        email: user?.userDetails?.email,
        userId: user?.userDetails?._id,
      };

      const response = await SavePaymentCard(params);
      console.log(response?.data, 'datadatadatadata');
      setIsLoading(false);
      if (response.status == 200 || response?.status == 201) {
        let data = response?.data;
        modalRef.current.isVisible({
          status: 'ok',
          message: response?.data?.message,
          handlePressOk: () => {
            modalRef.current.backdropPress();
            navigation.goBack();
          },
        });
      } else {
        modalRef.current.isVisible({
          status: 'error',
          mesage: response?.data?.message || 'Something went wrrong',
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'errorerrorerror');
    }
  };
  const isButtonDisabled = !isCardValid;
  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading} />
      <CommonAlert ref={modalRef} />
      <AppHeader
        height={width(20)}
        heading={'Add Card Details'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.goBackIcon}
      />

      <View style={{paddingHorizontal: width(3)}}>
        <StripeProvider publishableKey={stripePublishKey}>
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={styles.cardStyle}
            style={styles.cardField}
            onCardChange={handleCardChange}
          />
        </StripeProvider>

        <Button
          handlePressBtn={handleAddCard}
          btnFontSize={12}
          btnTitle={'Add'}
          disabled={isButtonDisabled}
          btnTextStyle={{
            color: isButtonDisabled ? appColors.black : appColors.white,
          }}
          buttonContainer={{
            backgroundColor: isButtonDisabled
              ? appColors.gray
              : appColors.darkBlue,
            borderColor: isButtonDisabled ? appColors.gray : appColors.darkBlue,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: width(3),
          }}
        />
      </View>
    </View>
  );
};

export default AddPaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  cardStyle: {
    fontSize: 12,
    textColor: appColors.black,
    placeholderColor: appColors.black,
    backgroundColor: appColors.white,
    borderRadius: 12,
    borderWidth: 1,
  },
});
