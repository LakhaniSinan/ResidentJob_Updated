import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';
import moment from 'moment';
import Button from '../button';
import {useSelector} from 'react-redux';

const OnGoingHistoryCard = ({
  item,
  index,
  handleClickCategory,
  handleNavigate,
}) => {
  const {user} = useSelector(state => state.LoginSlice);

  return (
    <View
      key={index}
      style={{
        marginTop: width(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: width(4),
        backgroundColor: appColors.white,
        borderWidth: 1,
        borderColor: appColors.black,
        height: width(35),
        marginHorizontal: width(2),
        padding: width(3),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}>
      <View
        style={{
          height: width(30),
          width: width(20),
          borderRadius: width(3),
          overflow: 'hidden',
        }}>
        <Image
          source={{
            uri:
              user?.userDetails?.role == 'hire'
                ? item?.providerDetails?.image
                : item?.customerId?.image,
          }}
          resizeMode="cover"
          style={{height: '100%', width: '100%'}}
        />
      </View>
      <View
        style={{
          paddingHorizontal: width(2),
          width: width(70),
        }}>
        <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
          }}>
          {user?.userDetails?.role == 'hire'
            ? item?.providerDetails?.fullname
            : item?.customerId?.fullname}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.poppinsRegular,
            color: appColors.black,
            fontSize: 12,
          }}>
          Date: {moment(item?.jobDate).format('DD MMM YYYY-hh:mm A')}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.poppinsRegular,
            color: appColors.black,
            fontSize: 12,
          }}>
          Duration: {item?.jobStartTime}-{item?.jobEndTime}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{height: width(11), width: width(27)}}>
            <Button
              handlePressBtn={() => handleClickCategory(item)}
              btnFontSize={12}
              btnTitle={'View Details'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
          <View style={{height: width(11), width: width(37)}}>
            <Button
              handlePressBtn={handleNavigate}
              btnFontSize={12}
              btnTitle={'Chat'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default OnGoingHistoryCard;
