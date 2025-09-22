import moment from 'moment';
import React from 'react';
import {Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';

const FindCategoryCard = ({item, index, type, handleClickCategory}) => {
  return (
    <View
      onPress={() => handleClickCategory(item)}
      key={index}
      style={{
        marginTop: width(2),
        marginHorizontal: width(2),
        width: width(90),
        padding: width(3),
        alignItems: 'center',
        backgroundColor: appColors.darkYellow,
        flexDirection: 'row',
        borderRadius: width(3),
      }}>
      <View
        style={{
          width: width(15),
          borderRadius: width(2),
          backgroundColor: appColors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
            fontSize: 28,
          }}>
          {moment(item?.jobDate).format('DD')}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.poppinsSemiBold,
            color: appColors.black,
            fontSize: 16,
          }}>
          {moment(item?.jobDate).format('MMM')}
        </Text>
      </View>
      <View>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fontFamily.poppinsSemiBold,
            color: appColors.black,
            marginLeft: width(3),
            fontSize: 12,
            width: width(55),
          }}>
          {item?.jobAddress}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: appColors.black,
            marginLeft: width(3),
            fontFamily: fontFamily.poppinsSemiBold,
          }}>
          ({item?.jobType}) ({item?.jobStartTime} - {item?.jobEndTime})
        </Text>
      </View>
    </View>
  );
};

export default FindCategoryCard;

const asd = {
  __v: 0,
  _id: '679e359d15ec9ed5a16b6b6a',
  createdAt: '2025-02-01T14:54:21.689Z',
  customerId: '679bca0cfeac01fceb2e144b',
  isProviderPaid: true,
  isReviewed: true,
  jobAddress:
    'XX4V+XMG, Sector 14-E Sector 14 E Shamsi Colony, Karachi, Karachi City, Sindh, Pakistan',
  jobDate: '2025-02-01',
  jobEndTime: '10:00 PM',
  jobLat: '24.9578441',
  jobLong: '66.9937938',
  jobNotes: 'asdfg',
  jobStartTime: '8:00 PM',
  jobStatus: 'Completed',
  jobType: 'Full-time',
  providerId: '679b73f79d150966597466e3',
  totalCost: 30,
  totalHours: 2,
  updatedAt: '2025-02-01T15:07:38.173Z',
};
