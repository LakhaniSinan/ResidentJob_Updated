import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import Loader from '../../../components/loader';
import InputField from '../../../components/textInput';
import {appColors} from '../../../constants';
import {getAssingedWorkers} from '../../../services/createJob';
import {createReveiw} from '../../../services/reviews';

const RateUsScreen = ({route}) => {
  const jobData = route.params;
  const constants = useRef(null);
  const {user} = useSelector(state => state.LoginSlice);

  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerIndex, setSelectedWorkerIndex] = useState(null);

  const navigation = useNavigation();
  const selectedWorker =
    selectedWorkerIndex !== null ? workers[selectedWorkerIndex] : null;

  useEffect(() => {
    handleGetAssingedWorkers();
  }, []);

  const handleGetAssingedWorkers = async () => {
    try {
      setIsLoading(true);
      const response = await getAssingedWorkers({jobId: jobData?._id});

      if (response?.status === 200 || response?.status === 201) {
        setWorkers(response?.data?.workers || []);
      }
    } catch (error) {
      console.log('🚀 ~ handleGetAssingedWorkers ~ error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWorker = index => {
    if (selectedWorkerIndex === index) {
      setSelectedWorkerIndex(null);
      setReview('');
      setRatings(0);
      return;
    }

    const worker = workers[index];

    if (worker?.isReviewed) {
      setReview(worker?.review?.reviewText || '');
      setRatings(worker?.review?.rating || 0);
    } else {
      setReview('');
      setRatings(0);
    }

    setSelectedWorkerIndex(index);
  };

  const handleReviewSubmit = async () => {
    if (ratings === 0) {
      return constants.current.isVisible({
        status: 'error',
        message: 'Please select a rating.',
        handlePressOk: () => constants.current.backdropPress(),
      });
    }

    if (review.trim() === '') {
      return constants.current.isVisible({
        status: 'error',
        message: 'Please write a review before submitting.',
        handlePressOk: () => constants.current.backdropPress(),
      });
    }

    try {
      const payload = {
        jobId: jobData?._id,
        workerId: selectedWorker?.jobSeekerId?._id,
        customerId: user?.userDetails?._id,
        rating: ratings,
        reviewText: review,
      };

      setIsLoading(true);
      const response = await createReveiw(payload);
      setIsLoading(false);

      if (response?.status === 200 || response?.status === 201) {
        const updatedWorkers = workers.map((w, index) => {
          if (index === selectedWorkerIndex) {
            return {
              ...w,
              isReviewed: true,
              review: {
                rating: ratings,
                reviewText: review,
              },
            };
          }
          return w;
        });

        setWorkers(updatedWorkers);
        setSelectedWorkerIndex(null);
        setReview('');
        setRatings(0);

        constants.current.isVisible({
          status: 'ok',
          message: 'Review submitted successfully 💙',
          handlePressOk: () => constants.current.backdropPress(),
        });
      }
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
        <Text style={styles.headerText}>Rate Our Workers</Text>

        {workers.map((worker, index) => {
          const isReviewed = worker?.isReviewed;

          return (
            <View key={worker?.jobSeekerId?._id}>
              <TouchableOpacity
                onPress={() => handleOpenWorker(index)}
                style={[
                  styles.workerCard,
                  selectedWorkerIndex === index && styles.workerCardSelected,
                ]}>
                <Image
                  source={{uri: worker?.image}}
                  style={styles.workerImage}
                />
                <View style={styles.workerInfo}>
                  <Text style={styles.workerName}>
                    {worker?.jobSeekerId?.firstname}{' '}
                    {worker?.jobSeekerId?.lastname}
                  </Text>
                  <Text style={styles.workerTitle}>{worker?.jobTitle}</Text>
                </View>
                <Text style={styles.expandIcon}>
                  {selectedWorkerIndex === index ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>

              {selectedWorkerIndex === index && (
                <View style={styles.expandedContainer}>
                  {/* Rating */}
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Select Rating:</Text>
                    <StarRating
                      rating={ratings}
                      setRating={setRatings}
                      disabled={isReviewed}
                    />
                  </View>

                  <Text style={styles.reviewLabel}>Write A Review</Text>
                  <View style={styles.inputContainer}>
                    <InputField
                      placeholder="Share your experience with this worker"
                      placeholderTextColor={appColors.gray}
                      multiline
                      borderRadius={width(6)}
                      value={review}
                      isEditable={!isReviewed}
                      onChangeText={setReview}
                    />
                  </View>

                  <View style={styles.actionButtonsContainer}>
                    {!isReviewed && (
                      <TouchableOpacity
                        onPress={handleReviewSubmit}
                        style={styles.submitBtn}>
                        <Text style={styles.submitBtnText}>Submit Review</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedWorkerIndex(null);
                        setReview('');
                        setRatings(0);
                      }}
                      style={styles.cancelBtn}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.bottomSpace} />
        <View style={styles.continueButtonContainer}>
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
            btnTitle={'Go to History'}
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

const StarRating = ({rating, setRating, disabled}) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map(item => (
      <TouchableOpacity
        key={item}
        disabled={disabled}
        onPress={() => setRating(item)}
        style={{opacity: disabled ? 0.4 : 1}}>
        <Image
          source={item <= rating ? appIcons.starFilled : appIcons.starOutline}
          style={styles.starIcon}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  headerText: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 18,
    padding: width(3),
    color: appColors.black,
  },
  subHeaderText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
    paddingHorizontal: width(3),
    color: appColors.gray,
    marginBottom: width(2),
  },
  reviewLabel: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 14,
    paddingHorizontal: width(3),
    paddingTop: width(3),
    color: appColors.black,
  },
  ratingLabel: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 14,
    color: appColors.black,
    marginBottom: width(2),
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.lightBlue,
    margin: width(3),
    borderRadius: 15,
    padding: width(3),
  },
  workerCardSelected: {
    backgroundColor: '#E8D4F8',
    borderWidth: 2,
    borderColor: '#792DBD',
  },
  workerImage: {
    width: width(18),
    height: width(18),
    borderRadius: 50,
    marginRight: width(3),
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 15,
    color: appColors.black,
  },
  workerTitle: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 12,
    color: appColors.gray,
    marginTop: width(1),
  },
  expandIcon: {
    fontSize: 18,
    color: '#792DBD',
    fontWeight: 'bold',
  },
  expandedContainer: {
    backgroundColor: '#F9F9F9',
    marginHorizontal: width(3),
    marginBottom: width(3),
    borderRadius: 12,
    paddingHorizontal: width(3),
    paddingBottom: width(3),
  },
  ratingContainer: {
    paddingVertical: width(3),
    alignItems: 'center',
  },
  starRow: {
    flexDirection: 'row',
  },
  starIcon: {
    width: width(8),
    height: width(8),
    marginHorizontal: width(2),
    resizeMode: 'contain',
  },
  inputContainer: {
    paddingVertical: width(2),
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: width(2),
    marginTop: width(3),
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#792DBD',
    paddingVertical: width(3),
    borderRadius: width(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: appColors.white,
    fontFamily: fontFamily.poppinsBold,
    fontSize: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: appColors.gray,
    paddingVertical: width(3),
    borderRadius: width(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: appColors.white,
    fontFamily: fontFamily.poppinsBold,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width(5),
  },
  emptyText: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 18,
    color: appColors.black,
    marginBottom: width(5),
  },
  submitButton: {
    backgroundColor: appColors.lightMehroon,
    borderRadius: width(100),
    borderWidth: 1,
    borderColor: appColors.gray,
    paddingVertical: width(3),
  },
  buttonText: {
    color: appColors.white,
    fontFamily: fontFamily.poppinsBold,
  },
  bottomSpace: {
    height: width(10),
  },
  continueButtonContainer: {
    paddingHorizontal: width(3),
    paddingVertical: width(10),
    backgroundColor: 'transparent',
  },
});
