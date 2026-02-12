import React, {useCallback, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import CommonAlert from '../../../components/commanAlert';
import Loader from '../../../components/loader';
import {appColors} from '../../../constants';
import {getWorkerReviews} from '../../../services/reviews';
import {useSelector} from 'react-redux';

const WorkerReviewsScreen = ({route}) => {
  const {jobId} = route.params;
  const {user} = useSelector(state => state.LoginSlice);

  const navigation = useNavigation();
  const alertRef = useRef();

  const [reviews, setReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [workerInfo, setWorkerInfo] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchWorkerReviews();
    }, [user, jobId]),
  );

  const fetchWorkerReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getWorkerReviews({
        workerId: user?.userDetails?._id,
        jobId,
      });

      console.log(response,'responseresponseresponseresponseresponseresponse');
      

      if (response?.status === 200 || response?.status === 201) {
        setReviews(response?.data?.review || null);
        setWorkerInfo(response?.data?.worker);
      } else {
        alertRef.current?.isVisible({
          status: 'error',
          message: response?.data?.message || 'Failed to load reviews',
          handlePressOk: () => alertRef.current?.backdropPress(),
        });
      }
    } catch (error) {
      console.log('🚀 ~ fetchWorkerReviews ~ error:', error);
      alertRef.current?.isVisible({
        status: 'error',
        message: 'Error loading reviews',
        handlePressOk: () => alertRef.current?.backdropPress(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getWorkerReviews({
        workerId: user?.userDetails?._id,
        jobId,
      });

      if (response?.status === 200 || response?.status === 201) {
        setReviews(response?.data?.review || null);
        setWorkerInfo(response?.data?.worker);
      }
    } catch (error) {
      console.log('🚀 ~ handleRefresh ~ error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderStars = rating => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(item => (
          <Image
            key={item}
            source={item <= rating ? appIcons.starFilled : appIcons.starOutline}
            style={styles.largeStarIcon}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({item}) => (
    <View style={styles.reviewCard}>
      <View style={styles.customerHeader}>
        <View style={styles.customerDetailsSection}>
          <Text style={styles.customerName}>
            {item?.customer?.firstname} {item?.customer?.lastname}
          </Text>
          <Text style={styles.customerEmail}>{item?.customer?.email}</Text>
          <Text style={styles.customerContact}>{item?.customer?.contact}</Text>
        </View>
      </View>

      <View style={styles.reviewContentSection}>
        <View style={styles.smallStarsContainer}>
          {[1, 2, 3, 4, 5].map(starItem => (
            <Image
              key={starItem}
              source={
                starItem <= item?.rating
                  ? appIcons.starFilled
                  : appIcons.starOutline
              }
              style={styles.smallStarIcon}
            />
          ))}
          <Text style={styles.ratingNumber}>{item?.rating}</Text>
        </View>
        <Text style={styles.reviewDate}>
          {new Date(item?.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.reviewText}>{item?.reviewText}</Text>
      </View>
    </View>
  );

  const renderEmptyReviews = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No reviews yet</Text>
      <Text style={styles.emptySubText}>
        This worker hasn't received any reviews yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        height={width(20)}
        heading={'Worker Reviews'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.goBackIcon}
      />

      {workerInfo && (
        <View style={styles.workerHeaderSection}>
          <Image
            source={{uri: workerInfo?.image}}
            style={styles.workerImage}
          />
          <View style={styles.workerDetails}>
            <Text style={styles.workerName}>
              {workerInfo?.jobSeekerId?.firstname}{' '}
              {workerInfo?.jobSeekerId?.lastname}
            </Text>
            <Text style={styles.workerTitle}>{workerInfo?.jobTitle}</Text>
          </View>
        </View>
      )}

      {reviews && (
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Rating</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(item => (
                <Image
                  key={item}
                  source={
                    item <= reviews?.rating
                      ? appIcons.starFilled
                      : appIcons.starOutline
                  }
                  style={styles.largeStarIcon}
                />
              ))}
            </View>
            <Text style={styles.ratingNumber}>{reviews?.rating}</Text>
          </View>

          <View style={styles.customerCardSection}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.customerCard}>
              <Text style={styles.labelText}>Name</Text>
              <Text style={styles.valueText}>
                {reviews?.customer?.firstname} {reviews?.customer?.lastname}
              </Text>

              <Text style={styles.labelText}>Email</Text>
              <Text style={styles.valueText}>{reviews?.customer?.email}</Text>

              <Text style={styles.labelText}>Contact</Text>
              <Text style={styles.valueText}>{reviews?.customer?.contact}</Text>
            </View>
          </View>

          <View style={styles.reviewTextSection}>
            <Text style={styles.sectionTitle}>Review</Text>
            <View style={styles.reviewTextCard}>
              <Text style={styles.reviewText}>{reviews?.reviewText}</Text>
              <Text style={styles.reviewDate}>
                {new Date(reviews?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View style={{height: width(10)}} />
        </ScrollView>
      )}

      {!reviews && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No review yet</Text>
          <Text style={styles.emptySubText}>
            This worker hasn't received any review yet
          </Text>
        </View>
      )}

      <CommonAlert ref={alertRef} />
      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default WorkerReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  workerHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.lightBlue,
    marginHorizontal: width(3),
    marginVertical: width(3),
    borderRadius: 15,
    padding: width(4),
  },
  workerImage: {
    width: width(20),
    height: width(20),
    borderRadius: 50,
    marginRight: width(3),
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 16,
    color: appColors.black,
  },
  workerTitle: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 13,
    color: appColors.gray,
    marginTop: width(1),
  },
  ratingSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: width(5),
    marginVertical: width(3),
    alignItems: 'center',
    marginHorizontal: width(3),
  },
  ratingLabel: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 16,
    color: appColors.black,
    marginBottom: width(2),
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width(2),
    marginVertical: width(2),
  },
  largeStarIcon: {
    width: width(12),
    height: width(12),
    resizeMode: 'contain',
  },
  ratingNumber: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 28,
    color: '#792DBD',
    marginTop: width(2),
  },
  customerCardSection: {
    paddingHorizontal: width(3),
    marginVertical: width(2),
  },
  sectionTitle: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 16,
    color: appColors.black,
    marginBottom: width(2),
  },
  customerCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: width(4),
    borderLeftWidth: 4,
    borderLeftColor: '#792DBD',
  },
  labelText: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: 12,
    color: appColors.gray,
    marginTop: width(2),
  },
  valueText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
    color: appColors.black,
    marginTop: width(1),
  },
  reviewTextSection: {
    paddingHorizontal: width(3),
    marginVertical: width(2),
  },
  reviewTextCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: width(4),
    borderLeftWidth: 4,
    borderLeftColor: '#792DBD',
  },
  reviewText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
    color: appColors.black,
    lineHeight: 22,
  },
  reviewDate: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 12,
    color: appColors.gray,
    marginTop: width(3),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 18,
    color: appColors.black,
    marginBottom: width(2),
  },
  emptySubText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
    color: appColors.gray,
  },
});
