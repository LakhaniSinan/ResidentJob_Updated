import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import {appIcons, appImages, fontFamily} from '../../assets';
import LogoutAlert from '../../components/logoutAlert';
import {appColors} from '../../constants';
import {setCardDetails} from '../../redux/slices/CardDetailes';
import {setUserData} from '../../redux/slices/Login';

const CustomerCustomDrawer = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.LoginSlice);
  console.log(user, 'useruser');

  const logoutRef = useRef();

  const iconsToRender = [
    {
      label: 'Home',
      onPress: () => navigation.navigate('HomeBottom'),
      tabIcon: appIcons.drawerHome,
    },
    // {
    //   label: 'Category',
    //   onPress: () => navigation.navigate('AllCategory'),
    //   tabIcon: appIcons.categoryIcon,
    // },
    // {
    //   label: 'Message',
    //   onPress: () => navigation.navigate('Message'),
    //   tabIcon: appIcons.massegeIcon,
    // },
    {
      label: 'My Jobs',
      onPress: () =>
        navigation.navigate('HomeBottom', {
          screen: 'OnGoingHistoryStack',
        }),
      tabIcon: appIcons.onGoing,
    },
    {
      label: 'Chat With Admin',
      onPress: () => navigation.navigate('ChatWithAdmin'),
      tabIcon: appIcons.massegeIcon,
    },

    {
      label: 'Profile',
      onPress: () =>
        navigation.navigate('HomeBottom', {
          screen: 'CustomerSettingsStack',
        }),
      tabIcon: appIcons.accountIcon,
    },
  ];

  return (
    <View style={styles.drawerContent}>
      <View style={styles.profileSection}>
        {user?.userDetails?._id ? (
          <>
            <Image
              source={{
                uri: user?.jobSeekerDetails?.image || user?.userDetails?.image,
              }}
              style={styles.profileImage}
            />
            {user?.userDetails?.fullname ||
              (user?.userDetails?.firstname && (
                <Text style={styles.profileName}>
                  {user?.userDetails?.fullname || user?.userDetails?.firstname}
                </Text>
              ))}
            {user?.userDetails?.contact && (
              <Text
                style={{
                  fontFamily: fontFamily.poppinsSemiBold,
                  fontSize: 16,
                  color: appColors.black,
                }}>
                +{user?.userDetails?.contact}
              </Text>
            )}
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                fontSize: 16,
                color: appColors.black,
              }}>
              {user?.userDetails?.email}
            </Text>
          </>
        ) : (
          <>
            <Image source={appImages.appIcon} style={styles.profileImage} />
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                fontSize: 12,
                margin: width(3),
                textAlign: 'center',
                color: appColors.black,
              }}>
              One step away from your next opportunity — log in now!
            </Text>
          </>
        )}
      </View>

      <View style={styles.menuItems}>
        {user?.token && (
          <>
            {iconsToRender.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}>
                <Image
                  source={item.tabIcon}
                  style={{height: width(6), width: width(6)}}
                  resizeMode="contain"
                  tintColor={'#000'}
                />
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      {user?.token ? (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            if (!user?.userDetails?.loginType == 'Google') {
              try {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                navigation.closeDrawer();
                logoutRef.current.backdropPress();
                dispatch(setUserData(null));
                dispatch(setCardDetails(null));
                AsyncStorage.removeItem('userData');
              } catch (error) {
                console.error('Logout error:', error);
              }
            } else {
              logoutRef.current.isVisible({
                status: 'logout',
                message: 'Are you sure you want to logout?',
                handlePressOk: () => {
                  navigation.closeDrawer();
                  logoutRef.current.backdropPress();
                  dispatch(setUserData(null));
                  dispatch(setCardDetails(null));
                  AsyncStorage.removeItem('userData');
                },
              });
            }
          }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            navigation.closeDrawer();
            dispatch(setUserData(null));
            dispatch(setCardDetails(null));
            AsyncStorage.removeItem('userData');
          }}>
          <Text style={styles.logoutText}>Go back to login as worker</Text>
        </TouchableOpacity>
      )}
      <LogoutAlert ref={logoutRef} />
    </View>
  );
};

export default CustomerCustomDrawer;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#f0f0f0',
    paddingVertical: width(10),
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  profileName: {
    fontSize: 18,
    marginTop: 10,
    color: '#000000',
    fontFamily: fontFamily.poppinsExtraBold,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width(2),
    paddingHorizontal: 35,
  },
  menuText: {
    marginTop: width(2),
    fontSize: 16,
    marginLeft: 15,
    color: '#000000',
    fontFamily: fontFamily.poppinsMedium,
  },
  logoutButton: {
    paddingVertical: 13,
    backgroundColor: appColors.lightMehroon,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: fontFamily.poppinsBold,
  },
});
