import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import {appColors} from '../../../constants';
import {acceptJob, findJobsByDate} from '../../../services/findjobHome';
import CommonAlert from '../../../components/commanAlert';
import moment from 'moment';
import {updateJobByAdmin} from '../../../services/wallet';

const JobsByDate = ({route}) => {
  const modalRef = useRef();
  const {dateString} = route?.params;
  console.log(dateString, 'dateStringdateString');

  const [filteredData, setFilteredData] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);

  useEffect(() => {
    fetchJobData();
  }, []);

  const fetchJobData = async () => {
    setFilteredData([]);
    try {
      setIsRefreshing(true);
      const response = await findJobsByDate({
        date: dateString,
        workerId: user?.userDetails?._id,
      });

      if (response?.status === 200 || response?.status === 201) {
        const data = response?.data?.jobs;
        setFilteredData(data.reverse());
      }
    } catch (error) {
      console.log('🚀 ~ fetchJobData ~ error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAcceptJob = async item => {
    modalRef.current.isVisible({
      status: 'confirm',
      message: 'Are you sure you want to accept this job?',
      handlePressOk: async () => {
        try {
          let params = {
            assignmentId: item?.assignmentId,
            profileId: user?.userDetails?._id,
            role: item?.jobs[0].name,
          };

          setIsRefreshing(true);
          const response = await acceptJob(params);
          if (response.status == 200 || response.status == 201) {
            fetchJobData();
            const response = await updateJobByAdmin(item?.jobId, {
              jobStatus: 'Accepted',
            });
            setIsRefreshing(false);
            modalRef.current.isVisible({
              status: 'ok',
              message: response?.data?.message,
            });
          } else {
            modalRef.current.isVisible({
              status: 'error',
              message: response?.data?.message,
            });
          }
        } catch (error) {
          console.log(error, 'errorerrorerrorerror2344557687');
          setIsRefreshing(false);
        }
      },
    });
  };

  const renderCategory = ({item, index}) => {
    console.log(index, 'itemitemitemitemitem123123');

    return (
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
            Job Status:
          </Text>
          <Text
            style={{
              marginLeft: 10,
              color: 'black',
              fontFamily: fontFamily.poppinsBold,
            }}>
            {item.jobStatus}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Job Id:
          </Text>
          <Text style={{marginLeft: 10, color: 'black'}}>#{item?.jobId}</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Start Date:
          </Text>
          <Text style={{marginLeft: 10, color: 'black', width: '65%'}}>
            {moment(item?.jobs[0]?.startDate).format('DD-MMM-YYYY')}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            End Date:
          </Text>
          <Text style={{marginLeft: 10, color: 'black', width: '65%'}}>
            {moment(item?.jobs[0]?.endDate).format('DD-MMM-YYYY')}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Start Time:
          </Text>
          <Text style={{marginLeft: 10, color: 'black', width: '65%'}}>
            {item?.jobs[0]?.startTime}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            End Time:
          </Text>
          <Text style={{marginLeft: 10, color: 'black', width: '65%'}}>
            {item?.jobs[0]?.endTime}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black', fontWeight: 'bold', width: '30%'}}>
            Job Address:
          </Text>
          <Text style={{marginLeft: 10, color: 'black', width: '65%'}}>
            {item?.address}
          </Text>
        </View>
        <View style={{width: '95%', alignSelf: 'center', marginTop: 10}}>
          <Button
            handlePressBtn={() => handleAcceptJob(item)}
            btnFontSize={12}
            btnTitle={'Accept Job'}
            btnTextStyle={{
              color: appColors.white,
            }}
            disabled={
              item.jobStatus == 'Cancelled' || item.jobStatus == 'Completed'
            }
            buttonContainer={{
              backgroundColor:
                item.jobStatus == 'Cancelled' || item.jobStatus == 'Completed'
                  ? appColors?.gray
                  : appColors.primaryColor,
              borderColor: appColors.primaryColor,
              borderWidth: 1,
              borderRadius: 12,
              paddingVertical: width(3),
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        height={width(20)}
        heading={'Available Jobs'}
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
      <CommonAlert ref={modalRef} />
    </SafeAreaView>
  );
};

export default JobsByDate;
