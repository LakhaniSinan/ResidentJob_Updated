import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';
import {width} from 'react-native-dimension';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {appIcons} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import {appColors} from '../../../constants';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA';

const JobsDirections = ({route}) => {
  const {params} = route;
  const jobLat = parseFloat(params?.latitude);
  const jobLng = parseFloat(params?.longitude);

  const [region, setRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation({latitude, longitude});
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader
        leftIcon={appIcons.goBackIcon}
        headingColor={appColors.white}
        leftIconStyle={{width: width(5), height: width(5)}}
        heading={'Directions'}
        height={width(20)}
      />
      {region && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapType="standard">
          {/* Job Marker */}
          <Marker
            coordinate={{
              latitude: jobLat,
              longitude: jobLng,
            }}
            title="Job Location"
            description={params?.address}
            pinColor="#FF69B4"
          />

          {/* Directions Line */}
          {currentLocation && (
            <MapViewDirections
              origin={currentLocation}
              destination={{
                latitude: jobLat,
                longitude: jobLng,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor={appColors.primary || '#1E90FF'}
              optimizeWaypoints={true}
              onError={err => console.log('Directions Error:', err)}
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default JobsDirections;
