import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {appIcons, appImages, fontFamily} from '../../../assets';
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
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetchHomeData();
      // console.log(response?.data, 'responseresponse');

      if (response.status == 200 || response.status == 201) {
        let data = response?.data.occupations;
        // console.log(data, 'datadatadata');
        setHomeData(data);
      } else {
        // modalRef.current.isVisible({
        //   status: 'error',
        //   message: response.data.message,
        // });
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
    console.log(item, 'itemitemitem');

    navigation.navigate('SearchStack', {
      screen: 'SearchScreen',
      params: item,
    });
  };

  const handleNotification = remoteMessage => {
    return;
    if (remoteMessage.data.type == 'Favourite') {
      navigation.navigate('MyFavourites');
      dispatch(handleGetFavourites(user?.userDetails?._id));
    } else if (remoteMessage.data.type == 'Matches') {
      navigation.navigate('Matches');
      dispatch(handleGetMatches(user?.userDetails?._id));
    }
  };

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) handleNotification(remoteMessage);
      })
      .catch(err => {
        console.log(err, 'ERRR');
      });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        if (remoteMessage) handleNotification(remoteMessage);
      },
    );

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      await dispatch(handleGetAllNotification(user?.userDetails?._id));
      console.log(remoteMessage, 'remoteMessageremoteMessage$@#$#$#$#');

      const {title, body} = remoteMessage?.notification || {};
      const safeTitle = title || remoteMessage?.data?.title || 'Notification';
      const safeBody = body || remoteMessage?.data?.body || 'You have a new message';

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
          refreshing={refreshing}
          onRefresh={() => handleFetchHomeData(true)}
          ListHeaderComponent={
            <View style={{padding: width(3)}}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.darkBlue,
                }}>
                Find your favorite Services
              </Text>

              <View
                style={{
                  height: width(40),
                  backgroundColor: 'red',
                  borderRadius: width(3),
                  marginTop: width(3),
                  overflow: 'hidden',
                }}>
                <Image
                  source={appImages.bannerImage}
                  style={{height: '100%', width: '100%'}}
                />
              </View>

              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.darkBlue,
                  marginVertical: width(3),
                }}>
                Category By Jobs
              </Text>
              <FlatList data={homeData} renderItem={renderCategory} />
            </View>
          }
        />
        <CommonAlert ref={modalRef} />
      </SafeAreaView>
    </>
  );
};

export default Home;
