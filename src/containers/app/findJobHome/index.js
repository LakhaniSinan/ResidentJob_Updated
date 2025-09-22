import messaging from '@react-native-firebase/messaging';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';

import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Loader from '../../../components/loader';
import {appColors} from '../../../constants';
import {helper} from '../../../helper';
import {getCalenderJobsByWorker} from '../../../services/createJob';
import {fetchAvailbleJob} from '../../../services/findjobHome';
import moment from 'moment';

const FindJobHome = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.LoginSlice);
  const [activeTab, setActiveTab] = useState('Available Jobs');
  const [availableJobs, setAvailableJobs] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'Available Jobs') {
        fetchAvailableJobs();
      } else {
        fetchAssignedJobs();
      }
    }, [activeTab]),
  );

  // FCM notification listeners
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(handleNotification)
      .catch(console.error);

    const unsubscribeOpened =
      messaging().onNotificationOpenedApp(handleNotification);
    const unsubscribeForeground = messaging().onMessage(remoteMessage => {
      const {title, body} = remoteMessage.notification || {};
      console.log(remoteMessage, 'remoteMessageremoteMessageASDASD');
      helper.notificationCall(title, body, () =>
        handleNotification(remoteMessage),
      );
    });

    return () => {
      unsubscribeOpened();
      unsubscribeForeground();
    };
  }, [handleNotification]);

  const handleNotification = useCallback(
    remoteMessage => {
      const type = remoteMessage?.data?.type;
      if (!type) return;

      if (type === 'Favourite') {
        navigation.navigate('MyFavourites');
      } else if (type === 'Matches') {
        navigation.navigate('Matches');
      }
    },
    [navigation],
  );

  const fetchAvailableJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchAvailbleJob({
        workerId: user?.userDetails?._id,
      });

      console.log(response?.data, 'responseresponseresponse');

      if ([200, 201].includes(response.status)) {
        setAvailableJobs(response?.data?.data || []);
      } else {
        console.warn('Fetch error:', response?.data?.message);
      }
    } catch (error) {
      console.error('Available jobs error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAssignedJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCalenderJobsByWorker(user?.userDetails?._id);
      if ([200, 201].includes(response.status)) {
        setAssignedJobs(response?.data?.data || []);
      } else {
        console.log('Assigned jobs error:', response?.data?.message);
      }
    } catch (error) {
      console.error('Assigned jobs error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getDateRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const jobIdMap = new Map();

  availableJobs.forEach(jobGroup => {
    const {jobId, jobs} = jobGroup;

    if (!jobIdMap.has(jobId) && Array.isArray(jobs) && jobs.length > 0) {
      jobIdMap.set(jobId, jobs[0]);
    }
  });

  const availableMarkedDates = availableJobs.reduce((acc, jobGroup) => {
    const {jobId, jobs} = jobGroup;

    // Only proceed if there's at least one jobs
    if (
      Array.isArray(jobs) &&
      jobs.length > 0 &&
      !acc._seenJobIds?.has(jobId)
    ) {
      const firstJob = jobs[0];

      const date = moment(firstJob.startDate).format('YYYY-MM-DD');

      if (date) {
        acc[date] = {
          customStyles: {
            container: {
              backgroundColor: appColors.primaryColor,
              borderRadius: 10,
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };
      }

      // Track seen jobIds
      acc._seenJobIds = acc._seenJobIds || new Set();
      acc._seenJobIds.add(jobId);
    }

    return acc;
  }, {});

  const assignedMarkedDates = assignedJobs.reduce((acc, job) => {
    // Add 1 day to each job date
    let jobDates = moment(job.jobDates).format('YYYY-MM-DD');

    console.log(jobDates, 'adjusted jobDate');

    acc[jobDates] = {
      customStyles: {
        container: {
          backgroundColor: appColors.primaryColor,
          borderRadius: 10,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    };
    return acc;
  }, {});

  const handleDaySelect = day => {
    if (activeTab === 'Available Jobs') {
      navigation.navigate('JobsByDate', {...day});
    } else {
      const job = assignedJobs.find(
        j => moment(j.jobDates).format('YYYY-MM-DD') === day.dateString,
      );

      if (job) {
        navigation.navigate('OnGoingHistoryDetails', job);
      }
    }
  };

  const renderTabButton = label => (
    <TouchableOpacity
      onPress={() => setActiveTab(label)}
      style={{
        padding: 10,
        borderRadius: 200,
        borderWidth: 0.4,
        width: width(45),
        alignItems: 'center',
        backgroundColor: activeTab === label ? appColors.primaryColor : 'white',
      }}>
      <Text
        style={{
          color: activeTab === label ? 'white' : 'black',
          fontFamily: fontFamily.poppinsBold,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        isDrawer
        height={width(30)}
        welcomeText
        userName={user?.fullname}
        headingColor={appColors.black}
        leftIcon={appIcons.drawerIcon}
        rightIcon={appIcons.notificationIcon}
        leftIconStyle={{height: 27, width: 27}}
        rightIconStyle={{height: width(12), width: width(12)}}
        onPressRightIcon={() => navigation.navigate('Notifications')}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: width(2),
          marginVertical: 10,
        }}>
        {renderTabButton('Available Jobs')}
        {renderTabButton('Accepted Jobs')}
      </View>

      <View style={{padding: width(3)}}>
        <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.primaryColor,
            textAlign: 'center',
            fontSize: 20,
            marginBottom: 10,
          }}>
          My Jobs Calendar
        </Text>
        <Calendar
          onDayPress={handleDaySelect}
          markedDates={
            activeTab === 'Available Jobs'
              ? availableMarkedDates
              : assignedMarkedDates
          }
          markingType="custom"
          theme={{
            todayTextColor: 'red',
            arrowColor: 'blue',
          }}
          disableAllTouchEventsForDisabledDays
        />
      </View>

      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default FindJobHome;
