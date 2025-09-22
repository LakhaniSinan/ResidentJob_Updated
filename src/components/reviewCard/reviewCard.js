import moment from 'moment';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {AirbnbRating} from 'react-native-ratings';
import {appColors} from '../../constants';
import {fontFamily} from '../../assets';

const RenderReviewCard = ({item, height}) => {
  const [showAllReview, setShowAllReview] = useState(false);

  return (
    <View
      style={
        showAllReview || height
          ? styles.showFullReviewCardContainer
          : styles.reviewCardContainer
      }>
      <View style={styles.row}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{uri: item?.image}}
            resizeMode="cover"
            style={styles.profileImage}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {item?.jobSeekerId?.firstname}{' '}
            {item?.lastname ? item?.lastname : ''}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        {/* <AirbnbRating
          ratingContainerStyle={styles.ratingContainer}
          count={5}
          showRating={false}
          isDisabled={true}
          defaultRating={item.rating}
          size={18}
        /> */}
        {/* <Text style={styles.reviewDate}>
          {moment(item?.createdAt).format('MM/DD/YYYY hh:mm A')}
        </Text> */}
      </View>
      {/* <Text
        numberOfLines={showAllReview ? undefined : 6}
        style={styles.reviewText}>
        {item?.reviewText}
      </Text>
      {item?.reviewText?.length > 300 && (
        <TouchableOpacity onPress={() => setShowAllReview(!showAllReview)}>
          <Text style={styles.readMoreText}>
            {showAllReview ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default RenderReviewCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    height: width(12),
    width: width(12),
    overflow: 'hidden',
    borderRadius: width(6),
    borderWidth: 1,
    borderColor: appColors.gray,
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  userInfo: {
    marginLeft: width(3),
  },
  name: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 15,
    color: appColors.black,
  },
  userAddress: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 12,
    color: appColors.lightText,
  },
  ratingContainer: {
    height: width(10),
  },
  reviewDate: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
    color: appColors.lightText,
    marginLeft: width(3),
  },
  reviewText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
    color: appColors.lightBlack,
    marginVertical: width(2),
  },
  readMoreText: {
    fontFamily: fontFamily.poppinsBold,
    textAlign: 'right',
    textDecorationLine: 'underline',
    fontSize: 14,
    color: appColors.black,
  },
  reviewCardContainer: {
    width: width(90),
    marginVertical: width(3),
    borderRadius: width(3),
    backgroundColor: appColors.white,
    padding: width(3),
    marginHorizontal: width(3),
    height: width(70),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  showFullReviewCardContainer: {
    width: width(90),
    marginVertical: width(3),
    borderRadius: width(3),
    backgroundColor: appColors.white,
    padding: width(3),
    marginHorizontal: width(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
