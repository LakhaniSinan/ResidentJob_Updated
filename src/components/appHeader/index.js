import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {appIcons, appImages, fontFamily} from '../../assets';
import {appColors} from '../../constants';
import {useSelector} from 'react-redux';

const AppHeader = ({
  isSkip,
  onSkipPress,
  headingColor,
  leftIconStyle,
  leftIcon,
  showExtraStuff,
  rightIcon,
  welcomeText,
  onPressRightIcon,
  heading,
  userName,
  chatData,
  isDrawer,
  profileHeader,
  showBackBtn,
  height,
  showChatHeader,
  isOnline,
  rightIconStyle,
}) => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.LoginSlice);

  return (
    <ImageBackground
      source={appImages.appHeaderImage}
      style={{
        height: height ? height : width(60),
        paddingHorizontal: width(8),
        justifyContent: showChatHeader ? 'center' : 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottomLeftRadius: width(8),
        borderBottomRightRadius: width(8),
      }}
      resizeMode="cover">
      <View style={styles.headerContainer}>
        {leftIcon ? (
          <TouchableOpacity
            onPress={() => {
              isDrawer ? navigation.openDrawer() : navigation.goBack();
            }}>
            <Image
              source={leftIcon}
              style={leftIconStyle}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={{width: 24}} />
        )}
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            fontFamily: fontFamily.poppinsBold,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            color: headingColor ? headingColor : '#333333',
          }}>
          {heading}
        </Text>
        {isOnline && (
          <View
            style={{
              height: width(4),
              marginLeft: -width(15),
              width: width(4),
              borderRadius: width(100),
              backgroundColor: '#0DC041',
            }}
          />
        )}
        {rightIcon ? (
          <TouchableOpacity onPress={onPressRightIcon}>
            <Image
              source={rightIcon}
              style={rightIconStyle}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : isSkip ? (
          <TouchableOpacity onPress={onSkipPress} style={{}}>
            <Text
              style={{fontFamily: fontFamily.poppinsBold, color: '#000000'}}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{width: 24}} />
        )}
      </View>
      {welcomeText && (
        <Text
          style={{
            fontFamily: fontFamily.poppinsSemiBold,
            color: appColors.white,
            fontSize: 14,
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 2,
          }}>
          Welcome{' '}
          <Text
            style={{
              fontFamily: fontFamily.poppinsSemiBold,
              color: appColors.white,
              fontSize: 14,
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 2,
            }}>
            {user?.userDetails?.firstname} {user?.userDetails?.lastname}
          </Text>
        </Text>
      )}

      {showBackBtn && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: width(10),
            width: width(10),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
          }}>
          <Image
            source={appIcons.goBackIcon}
            resizeMode="contain"
            style={{height: '50%', width: '50%'}}
          />
        </TouchableOpacity>
      )}
      {showExtraStuff && (
        <View style={{marginBottom: width(6)}}>{showExtraStuff}</View>
      )}
      {profileHeader && <View style={{height: width(20)}} />}
      {showChatHeader && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              height: width(10),
              width: width(10),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
            }}>
            <Image
              source={appIcons.goBackIcon}
              resizeMode="contain"
              style={{height: '50%', width: '50%'}}
            />
          </TouchableOpacity>
          <View
            style={{
              height: width(15),
              width: width(15),
              borderRadius: 100,
              overflow: 'hidden',
            }}>
            <Image
              source={{
                uri: chatData?.providerDetails?.image
                  ? chatData?.providerDetails?.image
                  : chatData?.customerId?.image,
              }}
              resizeMode="contain"
              style={{height: width(15), width: width(15)}}
            />
          </View>

          <Text
            style={{
              fontFamily: fontFamily.poppinsSemiBold,
              color: appColors.white,
              fontSize: 18,
              marginLeft: width(3),
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 2,
            }}>
            {chatData?.providerDetails?.fullname
              ? chatData?.providerDetails?.fullname
              : chatData?.customerId?.fullname}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = {
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
};

export default AppHeader;
