import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';
import {calculateTime} from '../../utills/globalFunctions';
import {getDatabase, ref, update, onValue} from 'firebase/database';
import {useSelector} from 'react-redux';

const ChatsCard = ({item, index, navigation}) => {
  const {user} = useSelector(state => state.LoginSlice);

  const markMessagesAsRead = async (jobId, userId) => {
    const chatUrl =
      user?.userDetails?.role === 'hire'
        ? `messages/${jobId}/${userId}/${item.providerId}`
        : `messages/${jobId}/${userId}/${item.customerId?._id}`;

    const messagesRef = ref(getDatabase(), chatUrl);
    onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach(key => {
          const message = data[key];
          if (!message.isRead) {
            update(ref(getDatabase(), `${chatUrl}/${key}`), {
              isRead: true,
            });
          }
        });
      }
    });
  };

  return (
    <TouchableOpacity
      key={index}
      style={{
        marginTop: width(2),
        marginHorizontal: width(2),
        padding: width(2),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor:
          item.unreadCount > 0 ? appColors.lightGray : appColors.spnishGray,
        borderRadius: width(2),
      }}
      onPress={() => {
        markMessagesAsRead(item._id, user?.userDetails?._id);
        navigation.navigate('ChatBox', {data: item, type: ''});
      }}>
      <View
        style={{
          height: width(15),
          width: width(15),
          borderRadius: 100,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: appColors.lightGray,
        }}>
        <Image
          source={{
            uri: item?.providerDetails?.image || item?.customerId?.image,
          }}
          resizeMode="cover"
          style={{height: '100%', width: '100%'}}
        />
      </View>

      <View style={{width: width(55), marginLeft: width(2)}}>
        <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
            fontSize: 16,
          }}>
          {item?.providerDetails?.fullname || item?.customerId?.fullname}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontFamily: fontFamily.poppinsRegular,
            fontSize: 12,
            color: appColors.black,
          }}>
          {item?.latestMessage?.msg || 'No messages yet'}
        </Text>
      </View>

      <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
        <Text
          style={{
            fontFamily: fontFamily.poppinsRegular,
            color: appColors.black,
            fontSize: 10,
          }}>
          {calculateTime(item?.latestMessage?.time)}
        </Text>

        {item?.unreadCount > 0 && (
          <View
            style={{
              height: width(5),
              width: width(5),
              backgroundColor: '#E8434D',
              borderRadius: width(3),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsRegular,
                color: appColors.white,
                fontSize: 12,
              }}>
              {item?.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChatsCard;

const asd = [
  {
    __v: 0,
    _id: '67a0d79c3bf57dfb360f10da',
    createdAt: '2025-02-03T14:50:04.423Z',
    customerId: {
      _id: '679be9760f89d6038453492d',
      email: 'sinan.lakhani09@gmail.com',
      fullname: 'test man',
      image:
        'https://res.cloudinary.com/dofa5sctg/image/upload/v1738271040/v8oxvwbbsgdxcfv5nupg.jpg',
    },
    isProviderPaid: false,
    isReviewed: false,
    jobAddress:
      '352, Soldier Bazaar Garden East, Karachi, Karachi City, Sindh, Pakistan',
    jobDate: '2025-02-05',
    jobEndTime: '8:00 PM',
    jobLat: '24.8792614',
    jobLong: '67.0363561',
    jobNotes: 'trskjj',
    jobStartTime: '7:00 AM',
    jobStatus: 'onGoing',
    jobType: 'Full-time',
    latestMessage: {
      ReceivedBy: '679b73f79d150966597466e3',
      attachmentUrl: '',
      img: undefined,
      isRead: false,
      msg: 'ok test man how are you?',
      sendBy: '679be9760f89d6038453492d',
      time: '03-Feb-2025 07:52 PM',
    },
    latestTime: NaN,
    providerId: '679b73f79d150966597466e3',
    totalCost: 195,
    totalHours: 13,
    unreadCount: 1,
    updatedAt: '2025-02-03T14:50:04.423Z',
  },
];
