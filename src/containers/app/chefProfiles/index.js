import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import Carousel from 'react-native-snap-carousel';
import {fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import FoodCard from '../../../components/foodCard';
import Loader from '../../../components/loader';
import RenderReviewCard from '../../../components/reviewCard/reviewCard';
import {appColors} from '../../../constants';
import {fetchDetails} from '../../../services/details';

const ChefProfiles = ({route}) => {
  const navigation = useNavigation();
  const state = route.params;
  const carouselRef = useRef();
  const [chefDetails, setChefDetails] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getChefDetails();
  }, []);

  const getChefDetails = () => {
    setIsLoading(true);

    fetchDetails(state?._id)
      .then(response => {
        if (response && response.status === 200) {
          setChefDetails(response.data);
        } else {
          setError('Failed to load chef details');
        }
      })
      .catch(err => {
        setError('Something went wrong. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const averageRating =
    chefDetails?.reviews?.reduce((sum, review) => sum + review.ratings, 0, 0) /
      chefDetails?.reviews?.length || 0;

  const renderItem = ({item}) => {
    console.log('Rendering item:', item);
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
        {item?.foods?.map((foodItem, index) => {
          console.log('Rendering food card:', foodItem);
          return <FoodCard key={index} item={foodItem} index={index} />;
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <Loader isLoading={isLoading} />
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
            source={{uri: chefDetails?.image}}
            resizeMode="cover"
            style={{height: '100%', width: '100%'}}
          />
        </View>
      </View>
      {/* <FlatList
        ListHeaderComponent={ */}
      {/* <View>
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
            {chefDetails?.fullname}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.poppinsRegular,
              color: appColors.black,
              marginLeft: width(2),
            }}>
            ({chefDetails?.jobTitle || 'N/A'})
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fontFamily.poppinsSemiBold,
            color: appColors.black,
            textAlign: 'center',
            fontSize: 22,
          }}>
          {`$${chefDetails?.hourlyRate || 'N/A'}/hr`}
        </Text>
        <View
          style={{
            marginVertical: width(3),
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.black,
                fontSize: 28,
              }}>
              {chefDetails?.reviews?.length || '0'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.poppinsRegular,
                color: appColors.black,
              }}>
              Reviews
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.black,
                fontSize: 28,
              }}>
              {chefDetails?.jobs || '0'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.poppinsRegular,
                color: appColors.black,
              }}>
              Jobs
            </Text>
          </View>
        </View>
      </View> */}

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
                {chefDetails?.fullname}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsRegular,
                  color: appColors.black,
                  marginLeft: width(2),
                }}>
                ({chefDetails?.jobTitle || 'N/A'})
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                textAlign: 'center',
                fontSize: 22,
              }}>
              {`$${chefDetails?.hourlyRate || 'N/A'}/hr`}
            </Text>
            <View
              style={{
                marginVertical: width(3),
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                    fontSize: 28,
                  }}>
                  {chefDetails?.reviews?.length || '0'}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsRegular,
                    color: appColors.black,
                  }}>
                  Reviews
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    color: appColors.black,
                    fontSize: 28,
                  }}>
                  {chefDetails?.jobs || '0'}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsRegular,
                    color: appColors.black,
                  }}>
                  Jobs
                </Text>
              </View>
            </View>
            <Carousel
              ref={carouselRef}
              data={chefDetails?.reviews || []}
              renderItem={({item}) => <RenderReviewCard item={item} />}
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
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.black,
                fontSize: 28,
                paddingHorizontal: width(4),
              }}>
              All Foods
            </Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={chefDetails?.foods || []}
        ListEmptyComponent={
          <Text
            style={{
              fontFamily: fontFamily.poppinsSemiBold,
              color: appColors.black,
              fontSize: 16,
              textAlign: 'center',
              paddingHorizontal: width(4),
            }}>
            No Food Found!
          </Text>
        }
        renderItem={({item}) => {
          return <FoodCard item={item} />;
        }}
      />
      <View
        style={{
          padding: width(3),
          alignItems: 'flex-end',
          backgroundColor: 'transparent',
        }}>
        <View
          style={{
            width: width(35),
            backgroundColor: 'transparent',
          }}>
          <Button
            btnTitle={'Select'}
            btnTextStyle={{
              color: appColors.white,
              fontFamily: fontFamily.poppinsBold,
            }}
            handlePressBtn={() =>
              navigation.navigate('SelectionForm', chefDetails)
            }
            buttonContainer={{
              backgroundColor: appColors.darkBlue,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: appColors.gray,
              paddingVertical: width(2),
            }}
            endIcon={
              <FontAwesome6
                name={'arrow-right'}
                size={25}
                color={appColors.white}
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChefProfiles;
