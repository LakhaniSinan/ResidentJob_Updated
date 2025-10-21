import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {PERMISSIONS, request} from 'react-native-permissions';
import {appIcons, fontFamily} from '../../assets';
import {appColors} from '../../constants';
import {helper} from '../../helper';

const GooglePlacesInput = ({
  placeholder,
  selectedLocation,
  setSelectedLocation,
  showLeftIcon,
  showRightIcon,
  callApi,
  lable,
}) => {
  const googleAPIKey = 'AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (selectedLocation?.userAddress) {
      setQuery(selectedLocation.userAddress);
    }
  }, [selectedLocation?.userAddress]);

  const fetchPlaces = async text => {
    if (!text || text.length < 1) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text,
        )}&key=${googleAPIKey}&language=en`,
      );
      const json = await res.json();
      console.log('Places API result:', json);
      if (Array.isArray(json?.predictions)) {
        setResults(json.predictions.slice(0, 5));
      } else {
        setResults([]);
      }
    } catch (err) {
      console.log('Fetch places error:', err);
    }
  };

  const fetchPlaceDetails = async placeId => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleAPIKey}`,
      );
      const json = await res.json();
      return json?.result;
    } catch (err) {
      console.log('Fetch details error:', err);
      return null;
    }
  };

  const selectPlace = async item => {
    try {
      const details = await fetchPlaceDetails(item.place_id);
      if (!details?.geometry?.location) return;

      const {lat, lng} = details.geometry.location;

      setSelectedLocation({
        ...selectedLocation,
        userAddress: item.description,
        latLng: {lat, lng},
      });

      callApi && callApi({lat, lng});
      setQuery(item.description);
      setResults([]);
      Keyboard.dismiss();

      console.log('Selected Coordinates:', lat, lng);
    } catch (error) {
      console.log('Select place error:', error);
    }
  };

  const getUserLocationAcces = async () => {
    let locationCheck = await helper.checkLocation();
    if (locationCheck === 'granted') {
      getLocation();
    } else {
      let result =
        Platform.OS === 'android'
          ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          : await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (result === 'granted') {
        getLocation();
      } else if (result === 'denied' && Platform.OS === 'ios') {
        Linking.openSettings();
      } else if (result === 'blocked') {
        Linking.openSettings();
      }
    }
  };

  const getLocation = async () => {
    try {
      const location = await helper.getCurrentLocation();
      const latitude = location?.coords.latitude;
      const longitude = location?.coords.longitude;

      const address = await helper.getLocationAddress(
        latitude,
        longitude,
        googleAPIKey,
      );

      if (address && address !== 'Geocoding request failed.') {
        setSelectedLocation({
          ...selectedLocation,
          userAddress: address,
          latLng: {lat: latitude, lng: longitude},
        });
        callApi && callApi({lat: latitude, lng: longitude});
        setQuery(address);
        setResults([]);
        console.log('Current location:', address);
      }
    } catch (error) {
      console.log('getLocation error', error);
    }
  };

  return (
    <View style={{flex: 1, marginBottom: width(2)}}>
      {lable && (
        <Text
          style={{
            fontFamily: fontFamily.poppinsBold,
            color: appColors.black,
            fontSize: 12,
            marginBottom: width(2),
          }}>
          {lable}
        </Text>
      )}
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 12,
          backgroundColor: appColors.backgroundLight,
          paddingHorizontal: width(3),
          borderWidth: 1,
          borderColor: appColors.backgroundLight,
        }}>
        {showLeftIcon && (
          <TouchableOpacity onPress={getUserLocationAcces}>
            <Image
              source={appIcons.location}
              style={{width: width(6), height: width(6)}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <TextInput
          style={{
            flex: 1,
            fontSize: 14,
            color: appColors.black,
            backgroundColor: appColors.backgroundLight,
            fontFamily: fontFamily.PlusJakartaSansMedium,
            paddingVertical: 8,
            paddingHorizontal: 10,
          }}
          placeholder={placeholder || 'Looking for another location?'}
          placeholderTextColor={appColors.gray}
          value={query}
          onChangeText={text => {
            setQuery(text);
            fetchPlaces(text);
          }}
        />
      </View>

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => item.place_id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                padding: 13,
                borderBottomWidth: 1,
                borderColor: appColors.border,
                backgroundColor: appColors.backgroundLight,
              }}
              onPress={() => selectPlace(item)}>
              <Text
                style={{
                  color: appColors.black,
                  fontFamily: fontFamily.poppinsRegular,
                  fontSize: 13,
                }}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
          style={{
            backgroundColor: appColors.textLight,
            borderRadius: 10,
            marginVertical: width(3),
            borderWidth: 1,
            borderColor: appColors.border,
          }}
        />
      )}
    </View>
  );
};

export default GooglePlacesInput;
