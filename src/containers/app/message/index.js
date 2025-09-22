import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getDatabase, onValue, ref, update} from 'firebase/database';
import React, {useCallback, useState} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import ChatsCard from '../../../components/chatsCard';
import Loader from '../../../components/loader';
import {appColors} from '../../../constants';
import {fetchJob, fetchProviderJob} from '../../../services/createJob';

const Chat = ({route}) => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.LoginSlice);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchJobData();
    }, []),
  );

  const fetchJobData = async () => {
    try {
      setIsLoading(true);

      const response =
        user?.userDetails?.role === 'hire'
          ? await fetchJob(user?.userDetails?._id, {jobStatus: 'onGoing'})
          : await fetchProviderJob(user?.userDetails?._id, {
              jobStatus: 'onGoing',
            });

      setIsLoading(false);

      if (response?.status === 200 || response?.status === 201) {
        const data = response.data?.data || [];
        setFilteredData(data.reverse());
      }
    } catch (error) {
      setIsLoading(false);
      console.log('fetchJobData error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setAllMessages([]);

      const unsubscribes = [];

      filteredData.forEach(job => {
        const chatUrl =
          user?.userDetails?.role === 'hire'
            ? `messages/${job?._id}/${user?.userDetails?._id}/${job.providerId}`
            : `messages/${job?._id}/${user?.userDetails?._id}/${job.customerId?._id}`;

        try {
          const messagesRef = ref(getDatabase(), chatUrl);

          const unsubscribe = onValue(messagesRef, snapshot => {
            const data = snapshot.val();

            if (data) {
              let tempArr = [];
              Object.keys(data).forEach(key => {
                const item = data[key];
                tempArr.push({
                  sendBy: item?.sender,
                  ReceivedBy: item?.receiver,
                  msg: item?.msg,
                  img: item?.image,
                  time: item?.time,
                  isRead: item?.isRead || false,
                  attachmentUrl: item?.attachmentUrl,
                });
              });

              const latestMessage = tempArr[tempArr.length - 1];

              const unreadCount = tempArr.filter(
                m => !m.isRead && m.ReceivedBy === user?.userDetails?._id,
              ).length;

              let latestTime = 0;
              if (latestMessage?.time) {
                latestTime = new Date(latestMessage.time).getTime();
              }

              const updatedJobData = {
                ...job,
                latestMessage,
                unreadCount,
                latestTime,
              };

              setAllMessages(prev => {
                const filtered = prev.filter(m => m._id !== job._id);
                return [...filtered, updatedJobData].sort(
                  (a, b) => a.latestTime - b.latestTime,
                );
              });
            }
          });

          unsubscribes.push(unsubscribe);
        } catch (error) {
          console.log('error retrieving messages:', error);
        }
      });

      return () => {
        unsubscribes.forEach(unsub => unsub());
      };
    }, [filteredData]),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader height={width(20)} showBackBtn={true} />

      <FlatList
        data={allMessages}
        ListHeaderComponent={
          <View style={{padding: width(4)}}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                fontSize: 30,
              }}>
              Messages
            </Text>
          </View>
        }
        renderItem={({item, index}) => (
          <ChatsCard item={item} index={index} navigation={navigation} />
        )}
        ListFooterComponent={<View style={{height: width(50)}} />}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: appColors.black,
                fontFamily: fontFamily.poppinsBold,
              }}>
              No Chat Found
            </Text>
          </View>
        }
      />

      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default Chat;
