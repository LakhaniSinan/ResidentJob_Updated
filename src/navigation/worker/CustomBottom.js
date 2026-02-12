import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {appIcons, appImages} from '../../assets';
import {appColors} from '../../constants';
import Entypo from '@react-native-vector-icons/entypo';
import {useSelector} from 'react-redux';

const BottomTabs = ({state, descriptors, navigation}) => {
  const [allRoutes, setAllRoutes] = useState(state.routes);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);

  const tabIcons = [
    {
      name: 'FindJobHome',
      routeName: 'FindStack',
      image: appIcons.homeIcon,
      label: 'Home',
      key: 'FindStack-kJg3b9G6aACKDaeH5Vhmv',
    },
    {
      name: 'OnGoingHistory',
      routeName: 'OnGoingHistoryStack',
      image: appIcons.profileicon,
      label: 'History',
      key: 'FavoritesSatck-gPt3xzFo--bZZhKxdAQrJ',
    },
    // {
    //   name: 'Search',
    //   routeName: 'SearchStack',
    //   image: appIcons.searchIcon,
    //   key: 'FavoritesSatck-gPt3xzFo--bZZhKxdAQrJ',
    //   type: 'search',
    // },
    {
      name: 'Support',
      routeName: 'SupportStack',
      image: appIcons.supportIcon,
      label: 'Support',
      key: 'ChatStack-J2IG9nugYrczVcTV9G8V8',
    },
    {
      name: 'Settings',
      routeName: 'SettingsStack',
      image: appIcons.settingsicon,
      label: 'Settings',
      key: 'MenuStack-N_zEWlCIijX1Sxn0801yC',
    },
  ];

  const iconsToRender = tabIcons;
  useEffect(() => {
    let tempAarr = [...allRoutes];
    tempAarr.splice(2, 0, tabIcons[2]);
    setAllRoutes(tempAarr);

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardActive(true),
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardActive(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const focusedRoute = state.routes[state.index];
  const focusedRouteName = focusedRoute.name;

  return (
    <SafeAreaView
      style={{
        height: isKeyboardActive ? 0 : width(15.5),
        backgroundColor: appColors.primaryColor,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}>
      {!isKeyboardActive && (
        <ImageBackground
          source={appImages.footerImage}
          resizeMode="contain"
          style={{
            height: width(15.6),
            width: '100%',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            borderTopLeftRadius: Platform.OS === 'android' ? 30 : 0,
            borderTopRightRadius: Platform.OS === 'android' ? 30 : 0,
            elevation: Platform.OS === 'ios' ? 0 : 5,
          }}>
          {iconsToRender.map((item, index) => {
            const isFocused = focusedRouteName === item.routeName;

            if (item.type === 'search') {
              return (
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999,
                  }}>
                  <View style={{position: 'absolute', bottom: width(2)}}>
                    <TouchableOpacity
                      style={{
                        height: width(19),
                        width: width(19),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 100,
                        borderWidth: 5,
                        borderColor: appColors.white,
                        backgroundColor: '#FFB400',
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        const event = navigation.emit({
                          type: 'tabPress',
                          target: allRoutes[index].key,
                          canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                          if (
                            item.name === 'Settings' &&
                            user?.userDetails?.role === 'hire'
                          ) {
                            navigation.navigate('CustomerSettings');
                          } else {
                            navigation.navigate({
                              name: item.routeName,
                              merge: true,
                            });
                          }
                        }
                      }}>
                      <Entypo name="plus" size={40} color={appColors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            } else {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: allRoutes[index].key,
                      canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate({name: item.routeName, merge: true});
                    }
                  }}
                  style={{
                    alignItems: 'center',
                    marginRight: index === 1 ? 30 : 0,
                    marginLeft: index === 3 ? 30 : 0,
                    marginBottom: width(1.5),
                  }}>
                  <Image
                    source={item.image}
                    style={{
                      width: width(8),
                      height: width(8),
                      tintColor: isFocused ? appColors.yellow : appColors.white,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: isFocused ? appColors.yellow : appColors.white,
                      fontSize: 12,
                    }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
        </ImageBackground>
      )}
    </SafeAreaView>
  );
};

export default BottomTabs;
