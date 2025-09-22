import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';
import moment from 'moment';

const NotificationCard = ({item, index}) => {
  return (
    <View
      key={index}
      style={{
        padding: width(3),
        borderRadius: 9,
        margin: width(1),
        marginVertical: width(2),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: appColors.black,
        borderBottomWidth: 1,
      }}>
      <View
        style={{
          justifyContent: 'space-between',
          marginLeft: width(2),
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fontFamily.poppinsBold,
            fontSize: 14,
            color: appColors.black,
          }}>
          {item?.title}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fontFamily.poppinsRegular,
            fontSize: 12,
            color: appColors.black,
          }}>
          {item?.body}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fontFamily.poppinsRegular,
            fontSize: 12,
            color: appColors.gray,
            marginLeft: width(1),
          }}>
          {moment(item?.createdAt).format('MM/DD/YYYY hh:mm A')}
        </Text>
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({});
