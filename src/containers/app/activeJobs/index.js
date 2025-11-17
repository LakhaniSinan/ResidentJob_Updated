import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import GroupJobCard from '../../../components/groupJobCard';
import {appColors} from '../../../constants';
import {fetchGroupJobs} from '../../../services/createJob';

const ActiveJobsScreen = ({route}) => {
  const type = route.params;
  const [filteredData, setFilteredData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);

  useFocusEffect(
    useCallback(() => {
      fetchJobData();
    }, []),
  );

  const fetchJobData = async () => {
    setFilteredData([]);
    try {
      setIsRefreshing(true);
      const response = await fetchGroupJobs(user?.userDetails?._id);
      console.log(response, 'responseresponseresponse');

      if (response?.status === 200 || response?.status === 201) {
        let data = response.data?.data || [];
        setFilteredData(data);
      }
    } catch (error) {
      console.log('🚀 ~ fetchJobData ~ error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderCategory = ({item, index}) => {
    return <GroupJobCard item={item} heading={'Group Jobs'} />;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        height={width(20)}
        heading={type === 'activeJobs' ? 'Active Jobs' : 'My Jobs'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.drawerIcon}
        isDrawer
      />

      <FlatList
        data={filteredData}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCategory}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: width(20)}} />}
        refreshing={isRefreshing}
        onRefresh={fetchJobData}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!isRefreshing && (
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.black,
                  fontSize: 16,
                }}>
                No Job Found Yet!
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ActiveJobsScreen;
