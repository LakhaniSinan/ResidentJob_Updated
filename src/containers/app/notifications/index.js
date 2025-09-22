import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import { useDispatch, useSelector } from 'react-redux';
import { appIcons, fontFamily } from '../../../assets';
import AppHeader from '../../../components/appHeader';
import NotificationCard from '../../../components/notificationsCard';
import { appColors } from '../../../constants';
import { handleGetAllNotification } from '../../../redux/slices/Notification';

const Notifications = ({ route }) => {
  const { notificationList } = useSelector(state => state.NotificationSlice);
  const { user } = useSelector(state => state.LoginSlice);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      setRefreshing(true);
      await dispatch(handleGetAllNotification(user?.userDetails?._id));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>
      <AppHeader
        height={width(20)}
        heading={`Notifications`}
        headingColor={appColors.white}
        leftIconStyle={{ height: 27, width: 27 }}
        leftIcon={appIcons.goBackIcon}
      />
      <FlatList
        data={notificationList}
        refreshing={refreshing}
        onRefresh={fetchNotifications}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item, index }) => {
          return <NotificationCard item={item} index={index} />;
        }}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsBold,
                color: appColors.black,
              }}>
              No Notifications Found!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Notifications;
