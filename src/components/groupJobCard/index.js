import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';
import Button from '../button';
import moment from 'moment';

const GroupJobCard = ({item, heading}) => {
  console.log(item, 'itemitemitemitem');

  const {user} = useSelector(state => state.LoginSlice);
  const navigation = useNavigation();
  const onDetailPress = () => {
    navigation.navigate(
      user?.userDetails?.role == 'worker'
        ? 'OnGoingHistoryDetails'
        : 'onGoingGroupDetail',
      {...item, heading},
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          borderWidth: 1,
          paddingHorizontal: 5,
          paddingVertical: 10,
          borderRadius: 5,
          marginHorizontal: 10,
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Created At
          </Text>
          <Text
            style={{
              marginLeft: 10,
              color: 'black',
              fontFamily: fontFamily.poppinsBold,
            }}>
            {moment(item?.createdAt).format('MMM/DD/YYYY')}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Job Status:
          </Text>
          <Text
            style={{
              marginLeft: 10,
              color: 'black',
              fontFamily: fontFamily.poppinsBold,
            }}>
            {item?.groupJob?.jobStatus == 'Cancelled' ||
            item?.groupJob?.jobStatus == 'Completed'
              ? item?.groupJob?.jobStatus
              : item.jobStatus || item?.status}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Job Id:
          </Text>
          <Text style={{marginLeft: 10, color: 'black'}}>
            #{item?.groupJob?.jobId || item?.jobId}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Job Address:
          </Text>
          <Text style={{marginLeft: 10, color: 'black', width: '65%'}}>
            {item?.groupJob?.address || item?.address}
          </Text>
        </View>
        <View style={{width: '95%', alignSelf: 'center', marginTop: 10}}>
          <Button
            handlePressBtn={() => onDetailPress(item)}
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
      </View>
    </SafeAreaView>
  );
};

export default GroupJobCard;
