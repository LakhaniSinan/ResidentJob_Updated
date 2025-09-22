import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {AirbnbRating} from 'react-native-ratings';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import Loader from '../../../components/loader';
import InputField from '../../../components/textInput';
import {appColors} from '../../../constants';
import {createReveiw} from '../../../services/reviews';
import {useSelector} from 'react-redux';
import CommonAlert from '../../../components/commanAlert';

const RateUsScreen = ({route}) => {
  const state = route.params;
  const constants = useRef(null);
  const {user} = useSelector(state => state.LoginSlice);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const navigation = useNavigation();

  const handleReviewSubmit = async () => {
    if (review.trim() === '') {
      constants.current.isVisible({
        status: 'error',
        message: 'Please write a review before submiting.',
        handlePressOk: () => constants.current.backdropPress(),
      });
      return;
    }
    try {
      let payload = {
        jobId: state?._id,
        providerId: state?.assignedWorkers[0]?.jobSeekerId,
        customerId: user?.userDetails?._id,
        rating: ratings,
        reviewText: review,
      };

      console.log(payload, 'payloadpayloadpayload');

      return;
      setIsLoading(true);
      const response = await createReveiw(payload);
      setIsLoading(false);
      setIsReviewSubmitted(true);
      setReview('');
      constants.current.isVisible({
        status: 'ok',
        message: 'Thank you for your review! Your feedback means a lot to us.',
        handlePressOk: () => {
          constants.current.backdropPress();
          navigation.goBack();
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.log('🚀 ~ handleReviewSubmit ~ error:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        height={width(20)}
        heading={'Give Us Rating'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.goBackIcon}
      />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.ratingContainer}>
          <AirbnbRating
            showRating={false}
            size={40}
            defaultRating={0}
            onFinishRating={count => setRatings(count)}
          />
        </View>

        <Text style={styles.headerText}>Write A Review</Text>

        <View style={styles.inputContainer}>
          <InputField
            placeholder="Write a review"
            placeholderTextColor={appColors.gray}
            multiline={true}
            borderRadius={width(6)}
            value={review}
            onChangeText={text => setReview(text)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            handlePressBtn={handleReviewSubmit}
            btnFontSize={12}
            btnTitle={'Submit'}
            btnTextStyle={styles.buttonText}
            buttonContainer={styles.submitButton}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            handlePressBtn={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'OnGoingHistoryStack'}],
                }),
              )
            }
            btnFontSize={12}
            btnTitle={'Continue with out rating'}
            btnTextStyle={styles.buttonText}
            buttonContainer={styles.submitButton}
          />
        </View>
      </ScrollView>
      <CommonAlert ref={constants} />
      <Loader isLoading={isLoading} />
    </View>
  );
};

export default RateUsScreen;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 18,
    padding: width(3),
    color: appColors.black,
  },
  ratingContainer: {
    height: width(30),
    backgroundColor: appColors.lightBlue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: width(3),
  },
  inputContainer: {
    padding: width(3),
  },
  buttonContainer: {
    paddingHorizontal: width(3),
    justifyContent: 'center',
    height: width(14),
    marginVertical: width(2),
  },
  buttonText: {
    color: appColors.white,
    fontFamily: fontFamily.poppinsBold,
  },
  submitButton: {
    backgroundColor: appColors.lightMehroon,
    borderRadius: width(100),
    borderWidth: 1,
    borderColor: appColors.gray,
    marginTop: width(3),
    paddingVertical: width(3),
  },
  appreciationMessage: {
    padding: width(3),
    marginTop: width(5),
    alignItems: 'center',
  },
  appreciationText: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 16,
    color: appColors.black,
    textAlign: 'center',
  },
});
