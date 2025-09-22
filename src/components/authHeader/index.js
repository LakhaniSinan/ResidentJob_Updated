import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {appIcons, appImages} from '../../assets';
import {width} from 'react-native-dimension';
import {useNavigation} from '@react-navigation/native';

const AuthHeader = ({showGoBack}) => {
  const navigation = useNavigation();
  return (
    <View style={{height: width(21.4), width: width(100)}}>
      <ImageBackground
        source={appImages.authHeaderImage}
        resizeMode="contain"
        style={{
          flex: 1,
          paddingHorizontal: width(3),
          justifyContent: 'center',
        }}>
        {showGoBack && (
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
      </ImageBackground>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({});
