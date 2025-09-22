import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import Carousel from 'react-native-snap-carousel';
import {appImages, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import FoodCard from '../../../components/foodCard';
import {appColors} from '../../../constants';
import {dummyFoodData, dummyReviewData} from '../../../utills/dummyData';
import RenderReviewCard from '../../../components/reviewCard/reviewCard';
import {fetchAllReviews} from '../../../services/reviews';
import {useSelector} from 'react-redux';
import Loader from '../../../components/loader';
import {all} from 'axios';

const ChefProfiles = ({route}) => {
  const carouselRef = useRef();
  // const navigation = useNavigation();
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);

  const state = route.params;
  // const averageRating =
  //   state?.review?.reduce((sum, review) => sum + review.ratings, 0, 0) /
  //     state?.review?.length || 0;
  useEffect(() => {
    handleFetchAllReviews();
  }, []);

  const handleFetchAllReviews = async () => {
    try {
      setIsLoading(true);
      const responce = await fetchAllReviews(user?.userDetails?._id);

      if (responce.status == 200 || responce.status == 201) {
        setAllReviews(responce?.data?.reviews);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('🚀 ~ handleFetchAllReviews ~ error:', error);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
            fontSize: 18,
            marginTop: width(3),
            marginLeft: width(3),
          }}>
          {item?.foodCategory}
        </Text>
        <FlatList
          data={item?.foodData}
          renderItem={({item, index}) => <FoodCard item={item} index={index} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader height={width(40)} showBackBtn={true} profileHeader={true} />
      <View
        style={{
          alignItems: 'center',
          marginTop: -width(20),
        }}>
        <View
          style={{
            height: width(40),
            width: width(40),
            borderRadius: width(100),
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: user?.image}}
            resizeMode="cover"
            style={{height: '100%', width: '100%'}}
          />
        </View>
      </View>
      <FlatList
        ListHeaderComponent={
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: width(3),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.black,
                }}>
                {user?.userDetails?.role == 'jobSeeker' ? 'Provider' : 'Customer'}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsRegular,
                  color: appColors.black,
                  marginLeft: width(2),
                }}>
                (MasterChef)
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                textAlign: 'center',
                fontSize: 22,
              }}>
              {`$${user.hourlyRate}/hr`}
            </Text>
            <View
              style={{
                marginVertical: width(3),
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                    fontSize: 28,
                  }}>
                  {allReviews?.length > 9
                    ? allReviews?.length
                    : `0${allReviews?.length}`}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsRegular,
                    color: appColors.black,
                  }}>
                  Reviews
                </Text>
              </View>
              {/* <View
                style={{
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                    fontSize: 28,
                  }}>
                  0
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsRegular,
                    color: appColors.black,
                  }}>
                  Jobs
                </Text>
              </View> */}
            </View>
            <Carousel
              ref={carouselRef}
              data={allReviews}
              renderItem={({item, index}) => (
                <RenderReviewCard item={item} index={index} />
              )}
              sliderWidth={width(100)}
              itemWidth={width(93)}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              activeSlideAlignment={'start'}
              horizontal={true}
              enableSnap={true}
              loop={false}
              contentContainerCustomStyle={{paddingHorizontal: width(5)}}
            />
          </View>
        }
        data={dummyFoodData}
        renderItem={renderItem}
      />
      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default ChefProfiles;
