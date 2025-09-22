import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useRef} from 'react';
import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {width} from 'react-native-dimension';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {PERMISSIONS, request} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {appIcons, fontFamily} from '../../assets';
import {appColors} from '../../constants';
import {helper} from '../../helper';
import {setUserLocation} from '../../redux/slices/Loations';

const GooglePlacesInput = ({
  placeholder,
  selectedLocation,
  setSelectedLocation,
  showLeftIcon,
  showRightIcon,
  queryType,
  callApi,
}) => {
  const dispatch = useDispatch();
  const locationRef = useRef();

  const getUserLocationAcces = async () => {
    let locationCheck = await helper.checkLocation();
    if (locationCheck == 'granted') {
      getLocation();
    } else {
      let result =
        Platform.OS == 'android'
          ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          : await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (result == 'granted') {
        getLocation();
      } else if (result == 'denied' && Platform.OS == 'ios') {
        Linking.openSettings();
      } else if (result == 'blocked') {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
      }
    }
  };

  const getLocation = async () => {
    try {
      let location = await helper.getCurrentLocation();
      let latitude = location?.coords.latitude;
      let longitude = location?.coords.longitude;

      let resultt = await helper.getLocationAddress(
        latitude,
        longitude,
        'AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA',
      );

      if (resultt !== 'Geocoding request failed.') {
        let newObj = {
          latitude,
          longitude,
          address: resultt,
        };
        setSelectedLocation({
          ...selectedLocation,
          userAddress: resultt,
          latLng: {
            lat: latitude,
            lng: longitude,
          },
        });
        callApi &&
          callApi({
            lat: latitude,
            lng: longitude,
          });
        AsyncStorage.setItem('userLocation', JSON.stringify(newObj));
        dispatch(setUserLocation(newObj));
      } else {
      }
    } catch (error) {
      console.log(error, 'eroooooooooooooooooooooooooo');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GooglePlacesAutocomplete
        ref={locationRef}
        GooglePlacesSearchQuery={{
          type: queryType,
        }}
        enablePoweredByContainer={false}
        placeholder={placeholder || 'Looking for another location?'}
        predefinedPlaces={[]}
        onPress={(data, details = null) => {
          setSelectedLocation({
            ...selectedLocation,
            userAddress: data.description,
            latLng: details.geometry.location,
          });
          callApi && callApi(details.geometry.location);
        }}
        renderRow={() => {
          return (
            <View style={{height: 100}}>
              <Text>Hello</Text>
            </View>
          );
        }}
        renderLeftButton={() => {
          if (showLeftIcon)
            return (
              <TouchableOpacity onPress={getUserLocationAcces}>
                <Image
                  source={appIcons.location}
                  style={{
                    width: width(6),
                    height: width(6),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
        }}
        renderRightButton={() => {
          if (showRightIcon)
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedLocation({
                    ...selectedLocation,
                    userAddress: '',
                  });
                  callApi && callApi({lat: null, lng: null});
                }}
                style={{
                  display:
                    selectedLocation?.userAddress !== '' ? 'flex' : 'none',
                }}>
                {/* <AntDesign
                  size={20}
                  name="closecircleo"
                  color={appColors.darkGreyText}
                /> */}
                {/* <Image
                  source={icons.clockIcon}
                  style={{width: width(7), height: width(7)}}
                  resizeMode="cover"
                /> */}
              </TouchableOpacity>
            );
        }}
        fetchDetails={true}
        textInputProps={{
          value: selectedLocation?.userAddress,
          onChange: e => {
            setSelectedLocation({
              ...selectedLocation,
              userAddress: e.nativeEvent.text,
            });
            if (e.nativeEvent.text == '') {
              setSelectedLocation({
                ...selectedLocation,
                userAddress: '',
              });
            }
          },
          placeholderTextColor: appColors.black,
          returnKeyType: 'search',
        }}
        onFail={eeee => console.log(eeee, 'eeeeeeeeeeee')}
        query={{
          key: 'AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA' || '',
          language: 'en',
          ...(queryType && {type: queryType}),
          components: 'country:ae',
        }}
        styles={{
          container: {
            flex: 1,
          },
          textInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 100,
            backgroundColor: appColors.grayShadow,
            paddingHorizontal: width(3),
            borderWidth: 1,
            borderColor: appColors.platinum,
            overflow: 'hidden',
          },
          textInput: {
            paddingHorizontal: 10,
            fontSize: 14,
            flex: 1,
            color: appColors.black,
            fontFamily: fontFamily.poppinsRegular,
            backgroundColor: 'transparent',
            marginTop: width(2),
          },
          listView: {
            height: 100,
            backgroundColor: appColors.grayShadow,
            borderRadius: 10,
            marginTop: width(3),
            borderWidth: 1,
            borderColor: appColors.platinum,
          },
          row: {
            padding: 13,
            height: 44,
            color: '#000',
            flexDirection: 'row',
            zIndex: 99999,
          },
          separator: {
            height: 0,
            backgroundColor: appColors.grayShadow,
          },
          description: {
            color: appColors.black,
            fontFamily: fontFamily.poppinsRegular,
            fontSize: 13,
          },
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
          },
        }}
      />
    </SafeAreaView>
  );
};

export default GooglePlacesInput;
