import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';

import MapView, {Marker} from 'react-native-maps';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import Loader from '../../../components/loader';
import {appColors} from '../../../constants';
import {checkIn, checkOut, fetchJobDetails} from '../../../services/createJob';

const calculateTotalCost = data => {
  let totalCost = 0;

  data?.job?.forEach(jobItem => {
    const adminValue = parseFloat(jobItem.adminValue);
    const totalHours = parseFloat(jobItem.totalHours);
    const requiredPeoples = parseInt(jobItem.requiredPeoples);
    const start = new Date(jobItem.startDate);
    const end = new Date(jobItem.endDate);
    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const cost = adminValue * totalHours * requiredPeoples * totalDays;
    totalCost += cost;
  });

  return totalCost.toFixed(2);
};

const getTodaysCheckInOut = checkInOutArray => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = checkInOutArray.find(entry => {
    const entryDate = new Date(entry.date).toISOString().split('T')[0];
    return entryDate === today;
  });

  return todayRecord || null;
};

const OnGoingHistoryDetails = ({route}) => {
  const item = route.params;
  console.log(item, 'itemitemitemitemitemitem123413');

  const _id = item?.groupJob?._id || item?._id || item?.jobId;
  console.log(_id, '_id_id_id_id_id');

  const [workerDetails, setWorkerDetails] = useState(null);
  const navigation = useNavigation();
  const modalRef = useRef();
  const {user} = useSelector(state => state.LoginSlice);
  const [historyDetails, setHistoryDetails] = useState(null);
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchJobDetailData();
    }, [_id]),
  );
  const fetchJobDetailData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchJobDetails({
        jobId: _id,
        profileId: user?.userDetails?._id,
      });

      setIsLoading(false);
      if (response?.status === 200 || response?.status == 201) {
        const matchedJobs = response?.data?.jobDetails?.job?.filter(
          j => j.name === response?.data?.workerDetails?.role,
        );

        if (matchedJobs.length > 0) {
          setHistoryDetails({
            ...response.data.jobDetails,
            job: matchedJobs,
          });
        } else {
          setHistoryDetails(response.data.jobDetails);
        }

        setWorkerDetails(response.data.workerDetails);
        setReview(response.data.review);
      } else {
        modalRef.current.isVisible({
          status: 'error',
          message: response?.data?.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'errorerrorerrorASDF');
    }
  };

  const renderJobItem = ({item}) => {
    console.log(item, 'itemitemitem6534523y680');

    return (
      <View>
        <InfoBlock
          title="Appointment Date"
          value={`From ${moment(item?.startDate).format(
            'DD/MM/YYYY',
          )} to ${moment(item?.endDate).format('DD/MM/YYYY')}`}
        />
        <InfoBlock
          title="Start Time - End Time"
          value={`${item?.startTime} - ${item?.endTime}`}
        />
        <InfoBlock title="Total Hours" value={`${item?.totalHours} Hours`} />
        {/* <InfoBlock title="Price/Hours" value={`$${item?.adminValue} /hrs`} /> */}
        <InfoBlock
          title="Persons Required"
          value={`Number of Persons: ${item?.requiredPeoples}`}
        />
      </View>
    );
  };

  const InfoBlock = ({title, value}) => (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const handleMarkAttendence = async type => {
    modalRef.current.isVisible({
      status: 'confirm',
      message: `Are you sure you want to ${type}?`,
      handlePressOk: async () => {
        try {
          let params = {
            profileId: user?.userDetails?._id,
            jobId: _id,
            role: workerDetails?.role,
          };

          setIsLoading(true);
          const response =
            type == 'Check In' ? await checkIn(params) : await checkOut(params);
          setIsLoading(false);
          if (response?.status === 200 || response?.status === 201) {
            modalRef.current.isVisible({
              status: 'ok',
              message: `${type} at ${moment().format('hh:mm A')}`,
              handlePressOk: () => {
                modalRef.current.backdropPress();
                fetchJobDetailData();
              },
            });
          } else {
            modalRef.current.isVisible({
              status: 'error',
              message: response?.data?.message,
            });
          }
        } catch (error) {
          setIsLoading(false);
          console.log(error, 'errorerrorerrorTIMERER');
        }
      },
    });
  };

  const today = moment().format('YYYY-MM-DD');

  const hasCheckedInToday = workerDetails?.checkInOut?.some(entry =>
    entry?.checkInTime
      ? moment(entry?.checkInTime).format('YYYY-MM-DD')
      : '' === today,
  );

  const hasCheckedOutToday = workerDetails?.checkInOut?.some(entry =>
    entry?.checkOutTime
      ? moment(entry?.checkOutTime).format('YYYY-MM-DD')
      : '' === today,
  );

  let isToday = getTodaysCheckInOut(workerDetails?.checkInOut || []);
  const jobStatus = historyDetails?.jobStatus;
  const jobStart = moment(historyDetails?.job?.[0]?.startDate);
  const jobEnd = moment(historyDetails?.job?.[0]?.endDate);
  const currentDate = moment();

  const isWithinDateRange =
    currentDate.isSameOrAfter(jobStart, 'day') &&
    currentDate.isSameOrBefore(jobEnd, 'day');

  const shouldShowButtons =
    historyDetails?.paymentStatus == 'Paid' &&
    jobStatus !== 'Cancelled' &&
    jobStatus !== 'Completed' &&
    isWithinDateRange;

  const handleNavigateToDirections = () => {
    navigation.navigate('JobsDirections', historyDetails);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        height={width(20)}
        heading={'Job Details'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.goBackIcon}
      />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <InfoBlock
          title="Appointment #ID"
          value={`#${historyDetails?.jobId}`}
        />

        <FlatList
          data={historyDetails?.job || []}
          renderItem={renderJobItem}
          keyExtractor={(_, index) => index.toString()}
        />

        {historyDetails && (
          <View style={{padding: width(3)}}>
            <Text style={styles.detailTitle}>Location</Text>
            <View style={styles.mapContainer}>
              <TouchableOpacity
                onPress={handleNavigateToDirections}
                style={{
                  position: 'absolute',
                  zIndex: 9,
                  height: width(8),
                  width: width(30),
                  bottom: 10,
                  right: 10,
                  backgroundColor: appColors.lightMehroon,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsBold,
                    fontSize: 12,
                    color: appColors.white,
                  }}>
                  Directions
                </Text>
              </TouchableOpacity>
              <MapView
                style={styles.map}
                region={{
                  latitude: parseFloat(historyDetails?.latitude),
                  longitude: parseFloat(historyDetails?.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(historyDetails?.latitude),
                    longitude: parseFloat(historyDetails?.longitude),
                  }}
                  title="Location"
                />
              </MapView>
            </View>
          </View>
        )}

        <InfoBlock value={historyDetails?.address} />
        {historyDetails?.jobStatus !== 'Cancelled' && (
          <View
            style={{
              marginHorizontal: width(2),
            }}>
            {workerDetails?.checkInOut?.length > 0 ? (
              <>
                <Text style={styles.detailTitle}>Attendence Record</Text>
                <View
                  style={{
                    marginTop: width(2),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: appColors.primaryColor,
                    paddingHorizontal: width(2),
                    paddingRight: width(4),
                  }}>
                  <Text
                    style={{
                      color: appColors.white,
                      width: width(20),
                      fontSize: 16,
                      fontFamily: fontFamily.poppinsBold,
                    }}>
                    Date
                  </Text>
                  <Text
                    style={{
                      color: appColors.white,
                      fontSize: 16,
                      fontFamily: fontFamily.poppinsBold,
                    }}>
                    Check-In
                  </Text>
                  <Text
                    style={{
                      color: appColors.white,
                      fontSize: 16,
                      fontFamily: fontFamily.poppinsBold,
                      textAlign: 'right',
                    }}>
                    Check-Out
                  </Text>
                </View>
              </>
            ) : null}
            {workerDetails?.checkInOut?.map((item, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: width(2),
                  borderColor: appColors.black,
                  borderWidth: 1,
                  justifyContent: 'space-between',
                }}
                key={index}>
                <Text
                  style={{
                    color: appColors.black,
                    width: width(30),
                    borderRightWidth: 1,
                    borderRightColor: appColors.black,
                    paddingVertical: width(2),
                  }}>
                  {moment(item?.date).format('DD/MM/YYYY')}
                </Text>
                <Text
                  style={{
                    color: appColors.black,
                    width: width(30),
                    padding: width(2),
                    borderRightWidth: 1,
                    borderRightColor: appColors.black,
                  }}>
                  {item?.checkInTime
                    ? moment(item?.checkInTime).format('hh:mm A')
                    : 'N/A'}
                </Text>
                <Text
                  style={{
                    color: appColors.black,
                    width: width(30),
                    padding: width(2),
                    textAlign: 'center',
                  }}>
                  {item?.checkOutTime
                    ? moment(item?.checkOutTime).format('hh:mm A')
                    : 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        )}
        {historyDetails?.jobStatus == 'Cancelled' && (
          <View
            style={{
              marginHorizontal: width(2),
              marginVertical: width(4),
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.gray,
              }}>
              Appointment has been cancelled.
            </Text>
          </View>
        )}
        {shouldShowButtons && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={styles.footer}>
              <Button
                handlePressBtn={() => handleMarkAttendence('Check In')}
                btnTitle="Check In"
                btnFontSize={12}
                btnTextStyle={{color: appColors.white}}
                buttonContainer={{
                  backgroundColor: appColors.primaryColor,
                  borderColor: appColors.primaryColor,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: width(3),
                }}
              />
            </View>
            <View style={styles.footer}>
              <Button
                handlePressBtn={() => handleMarkAttendence('Check Out')}
                btnTitle="Check Out"
                btnFontSize={12}
                btnTextStyle={{color: appColors.white}}
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
        )}
      </ScrollView>
      <CommonAlert ref={modalRef} />
      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default OnGoingHistoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  detailContainer: {
    padding: width(3),
    borderBottomWidth: 1,
    marginBottom: width(2),
    borderColor: appColors.black,
    borderRadius: width(2),
    backgroundColor: appColors.white,
  },
  detailTitle: {
    fontFamily: fontFamily.poppinsSemiBold,
    color: appColors.black,
  },
  detailValue: {
    fontFamily: fontFamily.poppinsRegular,
    color: appColors.black,
    marginTop: width(1),
  },
  footer: {
    paddingHorizontal: width(4),
    marginVertical: width(3),
    width: width(50),
  },
  mapContainer: {
    height: width(70),
    borderRadius: width(4),
    borderColor: appColors.platinum,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
