import { CommonActions, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { height, width } from 'react-native-dimension';
import { useSelector } from 'react-redux';
import { fontFamily } from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import DateRangePicker from '../../../components/customDatePicker';
import CustomPicker from '../../../components/customPicker';
import GooglePlacesInput from '../../../components/googlePlaceInput';
import Loader from '../../../components/loader';
import InputField from '../../../components/textInput';
import { appColors } from '../../../constants';
import { createJob } from '../../../services/createJob';
import CommonAlert from '../../../components/commanAlert';

const SelectionForm = ({ route }) => {
  const jobRef = useRef();
  const constants = useRef(null);
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startDate, setStartDate] = useState('00:00');
  const [endDate, setEndDate] = useState('00:00');
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [jobType, setJobType] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [openDate, setOpenDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.LoginSlice);

  const handleCreateJob = () => {
    const currentDate = moment().startOf('day');
    const userDate = moment(selectedDate).startOf('day');
    if (!jobType || !selectedLocation?.userAddress || !jobDescription) {
      return constants.current.isVisible({
        status: 'error',
        message: 'All fields are required',
      });
    } else if (userDate.isBefore(currentDate)) {
      return constants.current.isVisible({
        status: 'error',
        message: 'Selected date is not available',
      });
    }
    setIsLoading(true);
    let params = {
      jobType,
      jobAddress: selectedLocation?.userAddress,
      jobLat: selectedLocation?.latLng?.lat,
      jobLong: selectedLocation?.latLng?.lng,
      jobStartTime: startDate,
      jobEndTime: endDate,
      jobNotes: jobDescription,
      customerId: user?.userDetails?._id,
      providerId: route.params?._id,
      jobDate: moment(selectedDate).format('YYYY-MM-DD'),
      totalHours: calculateTotalHours(startDate, endDate),
      totalCost:
        route?.params?.hourlyRate * calculateTotalHours(startDate, endDate),
    };

    console.log(params, 'paramsparams123123321321');

    createJob(params)
      .then(response => {
        if (response.status == 201 || response.status == 200) {
          constants.current.isVisible({
            status: 'ok',
            message: response.data.message,
            handlePressOk: () => {
              constants.current.backdropPress();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'OnGoingHistoryStack' }],
                }),
              );
            },
          });
        } else {
          constants.current.isVisible({
            status: 'error',
            message: response.data.message,
          });
        }
      })
      .catch(err => {
        constants.current.isVisible({
          status: 'error',
          message: 'Please fill all fields',
          handlePressOk: () => {
            constants.current.backdropPress();
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const calculateTotalHours = (startTime, endTime) => {
    const start = moment(startTime, 'h:mm A');
    const end = moment(endTime, 'h:mm A');

    if (end.isBefore(start)) {
      return 'End time cannot be before start time';
    }

    const duration = moment.duration(end.diff(start));
    return (duration.asMinutes() / 60).toFixed(2);
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>
        <AppHeader height={width(20)} showBackBtn={true} />
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: width(6), marginTop: width(10) }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.black,
                fontSize: 29,
              }}>
              Select Form
            </Text>
            <View style={{ marginTop: width(1) }}>
              <CustomPicker
                ref={jobRef}
                marginVertical={width(4)}
                labelll="Job Type"
                value={jobType}
                listData={[{ name: 'Part-time' }, { name: 'Full-time' }]}
                handleSelectValue={(name, value) => setJobType(value.name)}
              />
            </View>
            <View style={{ marginTop: width(3) }}>
              <GooglePlacesInput
                showLeftIcon
                showRightIcon
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                placeholder={'Select your locations'}
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.dateContainer}
                onPress={() => setOpenDate(true)}>
                <Text
                  style={{
                    fontFamily: fontFamily.poppinsSemiBold,
                    color: appColors.gray,
                  }}>
                  {selectedDate !== null
                    ? moment(selectedDate).format('MM/DD/YYYY')
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={openDate}
                date={new Date()}
                onConfirm={date => {
                  setOpenDate(false);
                  setSelectedDate(date);
                }}
                onCancel={() => {
                  setOpenEnd(false);
                }}
              />
            </View>
            {selectedDate && (
              <DateRangePicker
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                openStart={openStart}
                setOpenStart={setOpenStart}
                openEnd={openEnd}
                setOpenEnd={setOpenEnd}
              />
            )}
            <View style={{ marginTop: width(2) }}>
              <InputField
                inputLabel="Your Message"
                placeholder="Add Description"
                placeholderTextColor={appColors.gray}
                multiline={true}
                borderRadius={width(6)}
                value={jobDescription}
                onChangeText={text => setJobDescription(text)}
              />
            </View>
            <View style={{ marginVertical: width(10) }}>
              <Button
                handlePressBtn={handleCreateJob}
                btnTitle={'Send'}
                btnTextStyle={{
                  color: appColors.white,
                }}
                buttonContainer={{
                  backgroundColor: appColors.darkBlue,
                  paddingVertical: width(3),
                  borderRadius: width(3),
                }}
              />
            </View>
          </View>
        </ScrollView>
        <CommonAlert ref={constants} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: width(5),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height(3),
    color: '#002366',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#008080',
    borderRadius: 10,
    marginBottom: height(2),
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#A9A9A9',
  },
  textInput: {
    height: 50,
    paddingHorizontal: width(3),
    fontSize: 16,
    color: '#000000',
  },
  textArea: {
    height: height(20),
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 10,
    padding: width(3),
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#000000',
    marginBottom: height(3),
  },
  paymentButton: {
    backgroundColor: '#002366',
    paddingVertical: height(2),
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateContainer: {
    height: width(13),
    backgroundColor: appColors.white,
    marginTop: width(3),
    justifyContent: 'center',
    paddingHorizontal: width(5),
    borderRadius: width(100),
    borderWidth: 1,
    borderColor: appColors.gray,
  },
});

export default SelectionForm;
