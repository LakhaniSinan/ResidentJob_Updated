import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import Carousel from 'react-native-snap-carousel';
import {appIcons, fontFamily} from '../../assets';
import {appColors} from '../../constants';

const FoodCard = ({
  item,
  index,
  foodCardType,
  handleDeleteFood,
  handleEditFood,
}) => {
  const [showAllReview, setShowAllReview] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItemImage = ({item}) => {
    return (
      <View style={styles.profileImageContainer}>
        <Image
          source={{uri: item}}
          resizeMode="contain"
          style={styles.profileImage}
        />
      </View>
    );
  };

  return (
    <View style={styles.reviewCardContainer}>
      <Carousel
        data={item.images}
        renderItem={renderItemImage}
        sliderWidth={width(86.5)}
        itemWidth={width(86.5)}
        onSnapToItem={index => setActiveSlide(index)}
      />
      <View style={styles.customIndicatorContainer}>
        {item?.images?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              activeSlide === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
      {/* <Text sstyle={styles.name}>Category Name: {item?.categoryName}</Text> */}
      <Text style={styles.name}>Food Name: {item?.name}</Text>
      <Text
        numberOfLines={showAllReview ? undefined : 2}
        style={styles.reviewText}>
        Food Description: {item?.description}
      </Text>
      {item?.feedback?.length > 50 && (
        <TouchableOpacity onPress={() => setShowAllReview(!showAllReview)}>
          <Text style={styles.readMoreText}>
            {showAllReview ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
      )}
      {foodCardType == 'jobSeeker' && (
        <View
          style={{
            height: width(14),
            width: width(25),
            position: 'absolute',
            top: 0,
            right: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: appColors.white,
              borderRadius: 100,
              padding: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => handleEditFood(item, index)}>
            <Image
              source={appIcons.editIcon}
              resizeMode="contain"
              style={{
                width: width(6),
                tintColor: appColors.black,
                height: width(6),
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: appColors.white,
              borderRadius: 100,
              padding: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => handleDeleteFood(item, index)}>
            <Image
              source={appIcons.binIcon}
              resizeMode="contain"
              style={{
                width: width(6),
                tintColor: appColors.red,
                height: width(6),
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FoodCard;

const styles = StyleSheet.create({
  profileImageContainer: {
    position: 'relative',
    height: width(40),
    width: '100%',
    overflow: 'hidden',
    backgroundColor: appColors.spnishGray,
    borderRadius: width(3),
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  customIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: appColors.black,
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
  name: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 15,
    color: appColors.black,
    marginTop: 8,
  },
  reviewText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 14,
    color: appColors.lightBlack,
    marginVertical: 8,
  },
  readMoreText: {
    fontFamily: fontFamily.poppinsBold,
    textAlign: 'right',
    textDecorationLine: 'underline',
    fontSize: 14,
    color: appColors.black,
  },
  reviewCardContainer: {
    width: width(93),
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
