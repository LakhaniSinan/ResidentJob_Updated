import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {AirbnbRating} from 'react-native-ratings';
import {appIcons, fontFamily} from '../../assets';
import {appColors} from '../../constants';

const TeamCard = ({item, index, selectedService, handleClickCategory}) => {
  return (
    <TouchableOpacity
      onPress={() => handleClickCategory(item)}
      key={index}
      style={{
        marginTop: width(2),
        flexDirection: 'row',
        height: width(35),
        marginHorizontal: width(2),
        padding: width(3),
      }}>
      <View
        style={{
          height: width(20),
          width: width(20),
          borderRadius: width(3),
          overflow: 'hidden',
        }}>
        <Image
          source={{uri: item?.image}}
          resizeMode="cover"
          style={{height: '100%', width: '100%'}}
        />
      </View>
      <View
        style={{
          width: width(70),
          paddingHorizontal: width(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
            }}>
            {item?.fullname}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.poppinsRegular,
              color: appColors.black,
              marginLeft: width(2),
            }}>
            ({item?.jobTitle ? item?.jobTitle : selectedService})
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsRegular,
              color: appColors.black,
            }}>
            {item?.location}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: width(5),
              width: width(5),
              borderRadius: width(100),
              overflow: 'hidden',
            }}>
            <Image
              source={appIcons.coinsIcon}
              resizeMode="cover"
              style={{height: '100%', width: '100%'}}
            />
          </View>
          <Text
            style={{
              fontFamily: fontFamily.poppinsSemiBold,
              color: appColors.black,
              marginLeft: 10,
            }}>
            {item.hourlyRate}/hr
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinsRegular,
              color: appColors.black,
              marginTop: width(2),
            }}>
            ({item?.averageRating?.toFixed(1) || 0})
          </Text>

          <AirbnbRating
            count={5}
            size={20}
            isDisabled
            showRating={false}
            defaultRating={item?.averageRating}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TeamCard;
