import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import CategoryCard from '../../../components/categoryCard';
import Loader from '../../../components/loader';
import TopServicesCard from '../../../components/topServiceCard';
import {appColors} from '../../../constants';
import {helper} from '../../../helper';
import {fetchHomeData} from '../../../services/home';
import CommonAlert from '../../../components/commanAlert';
import {handleGetAllNotification} from '../../../redux/slices/Notification';

const Home = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);
  const modalRef = useRef();
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    handleFetchHomeData();
  }, []);

  const handleFetchHomeData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setIsLoading(true);

      const response = await fetchHomeData();

      if (response.status == 200 || response.status == 201) {
        setHomeData(response?.data.occupations);
      }
    } catch (error) {
      console.log('🚀 ~ handleFetchHomeData ~ error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderCategory = ({item, index}) => {
    return (
      <CategoryCard
        type={'home'}
        item={item}
        index={index}
        handleClickCategory={handleClickCategory}
      />
    );
  };

  const renderTopService = ({item, index}) => {
    return <TopServicesCard type={'home'} item={item} index={index} />;
  };

  const handleClickCategory = item => {
    const jobsArray = Array.isArray(item) ? item : [item];

    navigation.navigate('SearchStack', {
      screen: 'SearchScreen',
      params: {job: jobsArray},
    });
  };

  const handleNotification = remoteMessage => {
    return;
  };

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) handleNotification(remoteMessage);
      });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        if (remoteMessage) handleNotification(remoteMessage);
      },
    );

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      await dispatch(handleGetAllNotification(user?.userDetails?._id));

      const {title, body} = remoteMessage?.notification || {};
      const safeTitle = title || remoteMessage?.data?.title || 'Notification';
      const safeBody =
        body || remoteMessage?.data?.body || 'You have a new message';

      helper.notificationCall(safeTitle, safeBody, () => {
        handleNotification(remoteMessage);
      });
    });

    return () => {
      unsubscribeOpened();
      unsubscribeForeground();
    };
  }, []);

  return (
    <>
      <Loader isLoading={isLoading} />

      <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
        <AppHeader
          isDrawer
          height={width(30)}
          welcomeText={true}
          rightIconStyle={{height: width(12), width: width(12)}}
          rightIcon={appIcons.notificationIcon}
          onPressRightIcon={() => navigation.navigate('Notifications')}
          headingColor={appColors.black}
          leftIcon={appIcons.drawerIcon}
          userName={user?.fullname}
          leftIconStyle={{height: 27, width: 27}}
        />

        <FlatList
          ListHeaderComponent={
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.darkBlue,
                padding: width(3),
              }}>
              Find your favorite Services
            </Text>
          }
          data={homeData}
          renderItem={renderCategory}
          refreshing={refreshing}
          onRefresh={() => handleFetchHomeData(true)}
        />

        {/* Floating Create Job Button */}
        {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('SearchStack')}
          style={{
            position: 'absolute',
            bottom: width(5),
            right: width(5),
            backgroundColor: appColors.primaryColor,
            paddingHorizontal: width(5),
            paddingVertical: width(2),
            borderRadius: width(10),
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}>
          <Text
            style={{
              color: appColors.white,
              fontFamily: fontFamily.poppinsSemiBold,
            }}>
            Create Job
          </Text>
        </TouchableOpacity> */}

        <CommonAlert ref={modalRef} />
      </SafeAreaView>
    </>
  );
};

export default Home;
