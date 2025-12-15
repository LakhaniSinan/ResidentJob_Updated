import axios from 'axios';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS } from 'react-native-permissions';
import { appImages } from '../assets';
import { notifications } from '../constants/variables';

export const GOOGLE_MAPS_APIKEY = 'AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA';

export const helper = {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, error => reject(error => { }), {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    });
  },

  async checkLocation() {
    if (Platform.OS == 'android') {
      return check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        async status => {
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            return 'denied';
          } else if (status == 'blocked') {
            return 'blocked';
          }
        },
      );
    } else {
      return await Geolocation.requestAuthorization('whenInUse')
        .then(async status => {
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            return 'denied';
          } else if (status == 'blocked') {
            return 'blocked';
          }
        })
        .catch(err => {
          console.log(err, 'err');
        });
    }
  },

  async getLocationAddressFallback(lat, lng) {
    return new Promise((resolve, reject) => {
      console.log('Trying fallback geocoding service...');

      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'ResidentJobs/1.0',
            },
          },
        )
        .then(response => {
          const data = response.data;
          console.log('Fallback geocoding response:', data);

          if (data.display_name) {
            console.log('Fallback geocoding successful:', data.display_name);
            resolve(data.display_name);
          } else {
            console.log('Fallback geocoding failed - no display name');
            reject('Fallback geocoding failed');
          }
        })
        .catch(error => {
          console.log('Fallback geocoding error:', error.message);
          reject('Fallback geocoding failed');
        });
    });
  },

  async getLocationAddress(lat, lng) {
    return new Promise((resolve, reject) => {
      console.log(`Attempting geocoding for coordinates: ${lat}, ${lng}`);
      console.log(`Using API key: ${GOOGLE_MAPS_APIKEY}`);

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_APIKEY}`;
      console.log('Geocoding URL:', url);

      axios
        .get(url)
        .then(response => {
          const data = response.data;
          console.log('Geocoding API response status:', data.status);
          console.log('Full API response:', JSON.stringify(data, null, 2));

          if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].formatted_address;
            console.log('Geocoding successful:', location);
            resolve(location);
          } else if (data.status === 'ZERO_RESULTS') {
            console.log('No results found for these coordinates');
            reject('No address found for these coordinates');
          } else if (data.status === 'REQUEST_DENIED') {
            console.log('API request denied:', data.error_message);
            reject(`API request denied: ${data.error_message}`);
          } else if (data.status === 'OVER_QUERY_LIMIT') {
            console.log('API quota exceeded');
            reject('API quota exceeded. Please try again later.');
          } else if (data.status === 'INVALID_REQUEST') {
            console.log('Invalid request parameters');
            reject('Invalid coordinates provided');
          } else {
            console.log('Geocoding failed - API response:', data);
            reject(
              `Geocoding failed. Status: ${data.status}, Error: ${data.error_message || 'Unknown error'
              }`,
            );
          }
        })
        .catch(error => {
          console.log(
            'Geocoding request error:',
            error.response?.data || error.message,
          );
          if (error.response?.status === 403) {
            reject('API key is invalid or restricted');
          } else if (error.response?.status === 429) {
            reject('Too many requests. Please try again later.');
          } else {
            reject(`Geocoding request failed. Network error: ${error.message}`);
          }
        });
    });
  },


  async uploadImageToCloudinary(image) {
    // Log the image object for debugging purposes
    console.log('Starting image upload...', image);
    // Prepare the form data for the Cloudinary request
    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,                // Image URI from the picker
      type: image.type || 'image/jpeg', // MIME type (default is 'image/jpeg')
      name: image.fileName || 'profile-image.jpg',  // Image name (fallback if fileName is not available)
    });
    formData.append("upload_preset", "b1f5s93m"); // Cloudinary upload preset (make sure this is correct)
    formData.append("cloud_name", "dofa5sctg");   // Cloudinary cloud name (replace with your cloud name)

    try {
      // Perform the HTTP POST request to Cloudinary
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dofa5sctg/image/upload', // Cloudinary upload endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Setting the content type for file uploads
          },
          timeout: 30000, // Optional timeout for the request (30 seconds)
        }
      );
      console.log('Upload response:', response.data);
      if (response.status === 200 || response.status === 201) {
        // Return the secure URL of the uploaded image
        console.log('Upload successful:', response.data.secure_url);
        return response.data.secure_url; // Return the URL to use for display or save
      } else {
        console.error('Upload failed with status:', response.status);
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error details:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please check your internet connection.');
      } else if (error.response) {
        console.error('Server error:', error.response.data);
        throw new Error(`Upload failed: ${error.response.data?.error?.message || 'Server error'}`);
      } else if (error.request) {
        console.error('Network error:', error.request);
        throw new Error('Network error. Please check your internet connection.');
      } else {
        console.error('Unknown error:', error.message);
        throw new Error(`Upload failed: ${error.message}`);
      }
    }
  },

  async notificationCall(titleee, bodyyy, handlePress) {
    return notifications?.popup?.show({
      onPress: () => {
        if (handlePress) handlePress();
      },
      appIconSource: appImages.appIcon,
      appTitle: 'ResidentJob',
      timeText: 'Now',
      title: titleee,
      body: bodyyy,
      slideOutTime: 5000,
    });
  },
};
