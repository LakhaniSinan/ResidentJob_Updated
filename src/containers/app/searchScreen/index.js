import Entypo from '@react-native-vector-icons/entypo';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import CustomCheckBox from '../../../components/customcheckBox';
import GooglePlacesInput from '../../../components/googlePlaceInput';
import Loader from '../../../components/loader';
import InputField from '../../../components/textInput';
import {appColors} from '../../../constants';
import {GetJobTitle} from '../../../services/authentication';
import {
  createJobForAdmin,
  updateJobForAdmin,
} from '../../../services/createJob';
import {createGorupJob, updatedJob} from '../../../services/groupJob';
import {getSettings} from '../../../services/setting';
import {styles} from './style';

const SearchScreen = ({route}) => {
  const item = route.params;
  console.log(item, 'itemitemitemitemitemitemitem');

  const constants = useRef(null);
  const {user} = useSelector(state => state.LoginSlice);
  const navigation = useNavigation();
  const [settings, setSettings] = useState(null);
  const [promo, setPromo] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState({type: '', index: null});
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const showSub = Keyboard.addListener('keyboardDidShow', () =>
        setIsKeyboardVisible(true),
      );
      const hideSub = Keyboard.addListener('keyboardDidHide', () =>
        setIsKeyboardVisible(false),
      );
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []),
  );

  useEffect(() => {
    if (item?.type === 'edit') {
      setSelectedLocation({
        userAddress: item?.address,
        latLng: {
          lat: Number(item?.latitude),
          lng: Number(item?.longitude),
        },
      });

      setPromo(item?.appliedPromo ?? '');
    }
  }, [item]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialData();
      setPromo(item?.appliedPromo?.code);
    }, [JSON.stringify(item?.job)]),
  );

  useFocusEffect(
    useCallback(() => {
      handleFetchSettings();
    }, []),
  );

  const handleFetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getSettings();
      if (res.status === 200 || res.status == 201) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch Terms & Conditions', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const response = await GetJobTitle();
      console.log(response, 'responseresponseresponseresponse');

      if (response.status === 200 || response.status === 201) {
        const oldJobs = item?.job ?? [];
        const isEdit = item?.type === 'edit';

        const updated = response.data.data.map(jobItem => {
          const match = oldJobs.find(j => j._id === jobItem._id);

          if (isEdit && match) {
            return {
              ...jobItem,
              isSelected: true,
              requiredPeoples: match.requiredPeoples,
              startDate: moment(match.startDate).format('YYYY-MM-DD'),
              endDate: moment(match.endDate).format('YYYY-MM-DD'),
              startTime: match.startTime,
              endTime: match.endTime,
              totalHours: match.totalHours,
              hourlyRate: String(match.hourlyRate),
            };
          }

          // --- CASE 2: HOME PAGE MODE ---
          // Only check the job selected by the user from home page
          const isSelectedFromHomepage = oldJobs.some(
            j => j._id === jobItem._id,
          );

          return {
            ...jobItem,
            isSelected: isSelectedFromHomepage,
            requiredPeoples: 1,
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            totalHours: '',
            hourlyRate: String(jobItem.price), // default rate
          };
        });

        setJobTitles(updated);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJobTitleSelection = index => {
    setJobTitles(prev =>
      prev.map((job, i) =>
        i === index ? {...job, isSelected: !job.isSelected} : job,
      ),
    );
  };
  const handleChangeJobField = (index, field, value) => {
    setJobTitles(prev =>
      prev.map((job, i) => {
        if (i === index) {
          let updatedJob = {...job};

          // ✅ Check if dates are selected before allowing time selection
          if (
            (field === 'startTime' || field === 'endTime') &&
            (!updatedJob.startDate || !updatedJob.endDate)
          ) {
            constants.current.isVisible({
              status: 'error',
              message:
                'Please select start and end dates before selecting times.',
            });
            return job;
          }

          // ✅ Convert time to "hh:00 A" format
          if (field === 'startTime' || field === 'endTime') {
            const formattedTime = moment(value).format('hh:00 A');
            updatedJob[field] = formattedTime;

            // ✅ Reset end time when start time is changed and end time was previously selected
            if (field === 'startTime' && updatedJob.endTime) {
              updatedJob.endTime = '';
              updatedJob.totalHours = '';
            }
          } else {
            updatedJob[field] = value;
          }

          // ✅ Check time difference between startTime and endTime
          if (field === 'endTime' && updatedJob.startTime) {
            let startMoment = moment(updatedJob.startTime, 'hh:mm A');
            let endMoment = moment(updatedJob.endTime, 'hh:mm A');

            // Handle overnight (e.g. 9PM to 3AM next day)
            if (endMoment.isBefore(startMoment)) {
              // Automatically update end date to next day
              const currentEndDate = moment(updatedJob.endDate);
              const newEndDate = moment(updatedJob.startDate).add(1, 'day');

              // Update the end date
              updatedJob.endDate = newEndDate.format('YYYY-MM-DD');

              // Show info message about automatic date update
              setTimeout(() => {
                constants.current.isVisible({
                  status: 'ok',
                  message: `End date automatically updated to ${newEndDate.format(
                    'MM/DD/YYYY',
                  )} due to overnight timing.`,
                });
              }, 100);

              endMoment.add(1, 'day');
            }

            const totalHours = endMoment.diff(startMoment, 'hours', true);

            if (totalHours < 6) {
              constants.current.isVisible({
                status: 'error',
                message:
                  'Minimum difference between startTime and endTime should be 6 hours',
              });
              return job;
            } else {
              updatedJob.totalHours = totalHours.toFixed();
            }
          }

          // ✅ Check if endDate is before startDate
          if (field === 'endDate' && updatedJob.startDate) {
            const startDate = moment(updatedJob.startDate, 'YYYY-MM-DD');
            const endDate = moment(value, 'YYYY-MM-DD');

            if (endDate.isBefore(startDate, 'day')) {
              constants.current.isVisible({
                status: 'error',
                message: 'End Date cannot be before Start Date.',
              });
              return job;
            }

            // ✅ Minimum 6 hour difference check with date+time
            const startDateTime = moment(
              `${updatedJob.startDate} ${updatedJob.startTime || '00:00 AM'}`,
              'YYYY-MM-DD hh:mm A',
            );
            let endDateTime = moment(
              `${value} ${updatedJob.endTime || '11:59 PM'}`,
              'YYYY-MM-DD hh:mm A',
            );

            // Handle overnight shifts (if same day and end time is before start time)
            if (
              startDate.isSame(endDate, 'day') &&
              updatedJob.endTime &&
              updatedJob.startTime
            ) {
              const startTime = moment(updatedJob.startTime, 'hh:mm A');
              const endTime = moment(updatedJob.endTime, 'hh:mm A');

              if (endTime.isBefore(startTime)) {
                endDateTime.add(1, 'day');
              }
            }

            const dateDiffInHours = endDateTime.diff(
              startDateTime,
              'hours',
              true,
            );

            if (dateDiffInHours < 6) {
              alert(
                'You cannot select this end Date. Minimum 6 hours difference required.',
              );
              return job;
            }
          }

          return updatedJob;
        }
        return job;
      }),
    );
  };

  // const handleChangeJobField = (index, field, value) => {
  //   setJobTitles(prev =>
  //     prev.map((job, i) => {
  //       if (i === index) {
  //         let updatedJob = {...job};

  //         // Reset job
  //         if (field === 'resetJob' && value) {
  //           return {
  //             ...updatedJob,
  //             isSelected: false,
  //             requiredPeoples: 1,
  //             startDate: '',
  //             endDate: '',
  //             startTime: '',
  //             endTime: '',
  //             totalHours: '',
  //           };
  //         }

  //         // Check if dates are selected before allowing time selection
  //         if (
  //           (field === 'startTime' || field === 'endTime') &&
  //           (!updatedJob.startDate || !updatedJob.endDate)
  //         ) {
  //           constants.current.isVisible({
  //             status: 'error',
  //             message:
  //               'Please select start and end dates before selecting times.',
  //           });
  //           return job;
  //         }

  //         // Format startTime/endTime
  //         if (field === 'startTime' || field === 'endTime') {
  //           const formattedTime = moment(value).format('hh:00 A');
  //           updatedJob[field] = formattedTime;

  //           // Reset endTime if startTime changes
  //           if (field === 'startTime') {
  //             updatedJob.endTime = '';
  //             updatedJob.totalHours = '';
  //           }

  //           // Calculate totalHours if both start and end time exist
  //           if (updatedJob.startTime && updatedJob.endTime) {
  //             let startMoment = moment(updatedJob.startTime, 'hh:mm A');
  //             let endMoment = moment(updatedJob.endTime, 'hh:mm A');

  //             if (endMoment.isBefore(startMoment)) {
  //               endMoment.add(1, 'day'); // overnight handling
  //             }

  //             const totalHours = endMoment.diff(startMoment, 'hours', true);
  //             updatedJob.totalHours = totalHours.toFixed(); // ✅ string or number
  //           }
  //         } else {
  //           updatedJob[field] = value;
  //         }

  //         return updatedJob;
  //       }
  //       return job;
  //     }),
  //   );
  // };

  const handleAdd = async () => {
    const selectedJobs = jobTitles?.filter(job => job.isSelected);

    if (!selectedJobs?.length) {
      return constants.current?.isVisible({
        status: 'error',
        message: 'At least one job should be selected.',
      });
    }

    let allFieldsFilled = selectedJobs?.every(
      job =>
        job.startDate &&
        job.endDate &&
        job.startTime &&
        job.endTime &&
        job.totalHours &&
        Number(job.totalHours) > 0, // ✅ ensures totalHours is > 0
    );

    if (!allFieldsFilled) {
      return constants.current?.isVisible({
        status: 'error',
        message: 'Please fill in all required fields for selected job titles.',
      });
    }

    if (!selectedLocation) {
      return constants.current.isVisible({
        status: 'error',
        message: 'Please enter location',
      });
    }

    if (!selectedLocation?.latLng?.lat || !selectedLocation?.latLng?.lng) {
      return constants.current.isVisible({
        status: 'error',
        message:
          'Please select your location again — it seems your map coordinates were reset?',
      });
    }

    try {
      let newArra;
      let totalAmount = 0;

      newArra = selectedJobs.map(item => {
        const momentDate1 = moment(item.endDate);
        const momentDate2 = moment(item.startDate);
        let differenceInDays = momentDate1.diff(momentDate2, 'days') + 1;

        const amount =
          Number(item.hourlyRate) *
          Number(item.totalHours) *
          Number(item.requiredPeoples) *
          differenceInDays;

        totalAmount += amount;

        return {...item};
      });

      let params = {
        job: newArra,
        address: selectedLocation?.userAddress,
        latitude: selectedLocation?.latLng.lat,
        longitude: selectedLocation?.latLng.lng,
        jobStatus: 'Pending',
        createdBy: user?.userDetails?._id,
        jobType: newArra.length > 1 ? 'Group' : 'Single',
        totalCost: totalAmount,
        qst: settings.qst,
        gst: settings.gst,
        promoCode: promo,
      };

      setLoading(true);
      const groupJobResponse =
        item?.type === 'edit'
          ? await updatedJob(item?._id, params)
          : await createGorupJob(params);

      if (![200, 201].includes(groupJobResponse.status)) {
        setLoading(false);
        return constants.current.isVisible({
          status: 'error',
          message:
            groupJobResponse?.data?.message || 'Failed to create group job',
        });
      }

      let roles = groupJobResponse?.data?.data?.job.map(jobItem => ({
        role: jobItem?.name,
        requiredCount: Number(jobItem?.requiredPeoples),
        totalHoursPerDay: Number(jobItem?.totalHours),
        startDate: jobItem?.startDate,
        endDate: jobItem?.endDate,
        startTime: jobItem?.startTime,
        endTime: jobItem?.endTime,
      }));

      let payload = {
        jobId: groupJobResponse?.data?.data?._id,
        roles,
      };

      const adminJobResponse =
        item?.type === 'edit'
          ? await updateJobForAdmin(payload)
          : await createJobForAdmin(payload);

      setLoading(false);

      if ([200, 201].includes(adminJobResponse.status)) {
        constants.current.isVisible({
          status: 'ok',
          message: groupJobResponse?.data?.message,
          handlePressOk: () => {
            constants.current.backdropPress();
            fetchInitialData();
            setSelectedLocation(null);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'OnGoingHistoryStack'}],
              }),
            );
          },
        });
      } else {
        constants.current.isVisible({
          status: 'error',
          message:
            adminJobResponse?.data?.message || 'Failed to create job for admin',
        });
      }
    } catch (error) {
      console.log('🚀 ~ handleAdd ~ error:', error);
      setLoading(false);
      constants.current.isVisible({
        status: 'error',
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong. Please try again.',
      });
    }
  };

  const renderJobTitle = ({item, index}) => {
    return (
      <View style={styles.jobTitleContainer}>
        <CustomCheckBox
          checked={item.isSelected}
          type="checkout"
          containerStyles={styles.checkboxContainer}
          label={item.name}
          onChange={() => handleJobTitleSelection(index)}
        />

        {item.isSelected && (
          <View style={styles.inputContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.labelBold}>Start Date</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setOpenDatePicker({type: 'startDate', index})}>
                  <Text style={styles.datePickerText}>
                    {item.startDate
                      ? moment(item.startDate).format('MM/DD/YYYY')
                      : '(mm/dd/yyyy)'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.labelBold}>End Date</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setOpenDatePicker({type: 'endDate', index})}>
                  <Text style={styles.datePickerText}>
                    {item.endDate
                      ? moment(item.endDate).format('MM/DD/YYYY')
                      : '(mm/dd/yyyy)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Start Time and End Time Fields */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.labelBold}>Start Time</Text>
                <TouchableOpacity
                  style={[
                    styles.datePickerButton,
                    (!item.startDate || !item.endDate) && {opacity: 0.5},
                  ]}
                  disabled={!item.startDate || !item.endDate}
                  onPress={() => setOpenDatePicker({type: 'startTime', index})}>
                  <Text style={styles.datePickerText}>
                    {item.startTime
                      ? item.startTime // moment(item.startTime).format('hh:00 A')
                      : '(hh:mm A)'}
                  </Text>
                </TouchableOpacity>
                {(!item.startDate || !item.endDate) && (
                  <Text
                    style={{fontSize: 10, color: appColors.gray, marginTop: 2}}>
                    Select dates first
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.labelBold}>End Time</Text>
                <TouchableOpacity
                  style={[
                    styles.datePickerButton,
                    (!item.startDate || !item.endDate) && {opacity: 0.5},
                  ]}
                  disabled={!item.startDate || !item.endDate}
                  onPress={() => setOpenDatePicker({type: 'endTime', index})}>
                  <Text style={styles.datePickerText}>
                    {item.endTime
                      ? item.endTime // moment(item.endTime).format('hh:00 A')
                      : '(hh:mm A)'}
                  </Text>
                </TouchableOpacity>
                {(!item.startDate || !item.endDate) && (
                  <Text
                    style={{fontSize: 10, color: appColors.gray, marginTop: 2}}>
                    Select dates first
                  </Text>
                )}
              </View>
            </View>

            <Text style={styles.labelBold}>Amount to be paid? (per/hr)</Text>
            <InputField
              placeholder="Hourly Rate"
              placeholderTextColor={appColors.gray}
              keyboardType="numeric"
              isEditable={false}
              value={item.hourlyRate}
              onChangeText={text =>
                handleChangeJobField(index, 'hourlyRate', text)
              }
            />

            <Text style={styles.labelBold}>How many people required?</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (item.requiredPeoples === 1) {
                    // Show alert before removing job
                    constants.current.isVisible({
                      status: 'confirm',
                      message:
                        'Are you sure you want to remove this job from your order list?',
                      handlePressOk: () => {
                        // Reset job fields
                        handleChangeJobField(index, 'resetJob', true);
                      },
                      handlePressCancel: () => {
                        // Do nothing, user cancelled
                      },
                    });
                  } else {
                    handleChangeJobField(
                      index,
                      'requiredPeoples',
                      Math.max(item.requiredPeoples - 1, 1),
                    );
                  }
                }}>
                <Entypo name="minus" color={appColors.black} size={15} />
              </TouchableOpacity>

              <Text style={styles.counterText}>{item.requiredPeoples}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  handleChangeJobField(
                    index,
                    'requiredPeoples',
                    item.requiredPeoples + 1,
                  )
                }>
                <Entypo name="plus" color={appColors.black} size={15} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const handleLogin = () => {
    navigation.navigate('Login', {
      type: 'hire',
    });
  };

  const renderSearchContent = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Loader isLoading={loading} />
        <AppHeader
          height={70}
          leftIconStyle={{height: 27, width: 27}}
          leftIcon={appIcons.goBackIcon}
          heading="New Job Hiring"
          headingColor={appColors.white}
        />
        <View
          style={{
            borderRadius: width(4),
            backgroundColor: appColors.white,
            margin: width(4),
            padding: width(3),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
            }}>
            📌 Minimum Duration: 6 Hours
          </Text>
          <Text
            style={{
              marginTop: width(2),
              fontFamily: fontFamily.poppinsMedium,
              fontSize: 12,
              color: appColors.gray,
            }}>
            Please note that the minimum booking duration for all services is 6
            hours. Any requests below this time frame will not be accepted.
          </Text>
        </View>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={jobTitles}
          ListHeaderComponent={
            <View style={styles.locationContainer}>
              <Text style={styles.labelBold}>
                Please enter your pin-location.
              </Text>

              <GooglePlacesInput
                showLeftIcon
                showRightIcon
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                placeholder="Select your locations"
              />
              <Text style={styles.labelBold}>Promo Code</Text>
              <InputField
                placeholder="Enter Promo Code"
                placeholderTextColor={appColors.gray}
                value={promo}
                onChangeText={setPromo}
              />
            </View>
          }
          keyExtractor={item =>
            item._id?.toString() || Math.random().toString()
          }
          renderItem={renderJobTitle}
        />
        <DatePicker
          modal
          mode={openDatePicker.type.includes('Time') ? 'time' : 'date'}
          open={!!openDatePicker.type}
          minuteInterval={60}
          date={new Date()}
          onConfirm={date => {
            setOpenDatePicker({type: '', index: null});
            handleChangeJobField(
              openDatePicker.index,
              openDatePicker.type,
              date,
            );
          }}
          onCancel={() => setOpenDatePicker({type: '', index: null})}
        />
        {!isKeyboardVisible && (
          <View style={{margin: width(5)}}>
            <Button
              btnTitle={
                item?.type === 'edit' ? 'Update Your Job' : 'Create New Job'
              }
              btnTextStyle={styles.btnTextStyle}
              buttonContainer={styles.updateBtn}
              handlePressBtn={handleAdd}
            />
          </View>
        )}
        <CommonAlert ref={constants} />
      </SafeAreaView>
    );
  };

  // Redirect only when screen is focused to avoid triggering during other flows
  useFocusEffect(
    useCallback(() => {
      if (!user?.userDetails?._id) {
        navigation.navigate('Login', {type: 'hire'});
      }
    }, [user]),
  );

  return <>{user?.userDetails?._id ? renderSearchContent() : null}</>;
};

export default SearchScreen;
