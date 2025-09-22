import React from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import {appColors} from '../../../constants';
import {allCatgories} from '../../../utills/dummyData';
import FindCategoryCard from '../../../components/findCategoryCard';
import {useNavigation} from '@react-navigation/native';

const MyAllJobs = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader showBackBtn={true} height={width(20)} />
      <FlatList
        data={allCatgories}
        ListHeaderComponent={
          <View style={{padding: width(4)}}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                fontSize: 30,
              }}>
              My Current Jobs
            </Text>
          </View>
        }
        contentContainerStyle={{alignItems: 'center'}}
        renderItem={({item, index}) => {
          return (
            <FindCategoryCard
              type={'home'}
              item={item}
              index={index}
              handleClickCategory={() =>
                navigation.navigate('OnGoingHistoryStack')
              }
            />
          );
        }}
        ListFooterComponent={<View style={{height: width(10)}} />}
      />
    </SafeAreaView>
  );
};

export default MyAllJobs;
