import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@react-native-vector-icons/entypo';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { width } from 'react-native-dimension';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { appIcons, fontFamily } from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import CommonAlert from '../../../components/commanAlert';
import Loader from '../../../components/loader';
import PhoneInputComponent from '../../../components/phoneInput';
import InputField from '../../../components/textInput';
import { appColors } from '../../../constants';
import { setUserData } from '../../../redux/slices/Login';
import { getUserProfile } from '../../../services/authentication';
import { updateProfile } from '../../../services/home';

const Settings = ({ route }) => {
  const constants = useRef(null);
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState('');
  const data = useSelector(state => state.LoginSlice.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const user = data?.userDetails;

  console.log(user, 'useruseruseruseruseruser');

  const [inputs, setInputs] = useState({
    userId: '',
    firstname: '',
    lastname: '',
    email: '',
    location: '',
    area: '',
    contact: '',
    hourlyRate: '',
    countryCode: '',

    legalname: '',
    neqnumber: '',
    personalResponsible: '',
    address: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    console.log("CALLED");

    try {
      setIsLoading(true);
      const response = await getUserProfile(user?._id);
      let data = response.data?.data;
      console.log(data, 'datadata');
      console.log('NEQ Number:', data?.neqnumber);

      setProfileImage(data?.image);
      setIsLoading(false);
      setInputs({
        userId: data?._id || 'N/A',
        firstname: data?.firstname || 'N/A',
        lastname: data?.lastname || 'N/A',
        email: data?.email || 'N/A',
        location: data?.location || 'N/A',
        area: data?.area || 'N/A',
        contact: data?.contact || 'N/A',
        hourlyRate: data?.hourlyRate?.toString() || '',
        countryCode: data?.countryCode || '',

        legalname: data?.legalname || '',
        neqnumber: data?.neqnumber?.toString() || '',
        personalResponsible: data?.personalResponsible || '',
        address: data?.address || '',
      });
    } catch (error) {
      setIsLoading(false);
      console.log('🚀 ~ fetchUserProfile ~ error:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });
      uploadImageToCloudinary(image);
    } catch (error) {
      console.log('Image pick error:', error);
    }
  };

  const uploadImageToCloudinary = async image => {
    const formData = new FormData();
    formData.append('file', {
      uri: image.path,
      type: image.mime,
      name: 'profile-image.jpg',
    });
    formData.append('upload_preset', 'b1f5s93m');

    const uploadResponse = await ImageUploadService(formData);
    if (uploadResponse) {
      const result = await uploadResponse.json();
      if (result.secure_url) {
        setProfileImage(result.secure_url);
        console.log(result.secure_url);
      }
    }
  };

  const ImageUploadService = async formData => {
    try {
      let result = await fetch(
        'https://api.cloudinary.com/v1_1/dofa5sctg/image/upload',
        {
          method: 'POST',
          body: formData,
        },
      );
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  const onChangeText = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handlePress = () => {
    const {
      area,
      contact,
      email,
      hourlyRate,
      location,
      firstname,
      lastname,
      neqnumber,
      legalname,
      personalResponsible,
      address,
    } = inputs;
    let params = {
      firstname,
      lastname,
      location,
      hourlyRate,
      email,
      contact,
      area,
      image: profileImage,
      neqnumber,
      legalname,
      personalResponsible,
      address,
      type: user?.role,
    };
    setIsLoading(true);
    updateProfile(params, inputs.userId)
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          console.log(response?.data, "response?.data?esponse?.data?");
          constants.current.isVisible({
            status: 'ok',
            message: response.data.message,
            handlePressOk: () => fetchUserProfile()
            //   constants.current.backdropPress();
            //   dispatch(setUserData(response?.data?.data));
            //   AsyncStorage.setItem(
            //     'userData',
            //     JSON.stringify(response?.data?.data),
            //   );
            // },
          });
        } else {
          constants.current.isVisible({
            status: 'error',
            message: response.data.message,
          });
        }
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setShowDeleteSuccess(true);
    }, 2000);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };
  const handleLogout = () => { };

  const onDeleteSuccess = () => {
    setShowDeleteSuccess(false);
    dispatch(setUserData(null));
    AsyncStorage.removeItem('userData');
    // Logout functionality - you can add your logout logic here
    // For now, just navigate back or show a message
  };
  const renderProfileContent = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>
        <Loader isLoading={isLoading} />
        <AppHeader
          height={width(20)}
          heading={'Profile Screen'}
          headingColor={appColors.white}
          leftIconStyle={{ height: 27, width: 27 }}
          leftIcon={appIcons.drawerIcon}
          isDrawer={true}
        />
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: width(20),
            }}>
            <View
              style={{
                height: width(30),
                width: width(30),
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: appColors.black,
                borderRadius: 100,
              }}>
              <Image
                source={
                  profileImage ? { uri: profileImage } : appIcons.accountIcon
                }
                resizeMode="cover"
                style={{
                  height: profileImage ? '100%' : '50%',
                  width: profileImage ? '100%' : '50%',
                  borderRadius: width(100),
                }}
              />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={handleImagePick}>
                <Entypo name="camera" size={18} color={appColors.black} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ paddingHorizontal: width(4) }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                fontSize: 14,
                color: appColors.black,
                padding: width(4),
              }}>
              Basic Information
            </Text>
            <View style={{ marginVertical: width(1) }}>
              <InputField
                inputLabel="First Name"
                placeholder="Enter your first name"
                value={inputs.firstname}
                onChangeText={value => onChangeText('firstname', value)}
              />
            </View>
            <View style={{ marginVertical: width(1) }}>
              <InputField
                inputLabel="Last Name"
                placeholder="Enter your last name"
                value={inputs.lastname}
                onChangeText={value => onChangeText('lastname', value)}
              />
            </View>
            <View style={{ marginTop: width(5) }}>
              <InputField
                value={inputs.legalname}
                placeholder="Legal Name"
                placeholderTextColor={appColors.gray}
                onChangeText={value => onChangeText('legalname', value)}
              />
            </View>
            <View style={{ marginVertical: width(1) }}>
              <InputField
                isEditable={false}
                inputLabel="Email"
                value={inputs.email}
              />
            </View>
            <View style={{ marginTop: width(5) }}>
              <InputField
                value={inputs.neqnumber ? inputs.neqnumber.toString() : ''}
                placeholder="NEQ Number"
                keyboardType="number-pad"
                placeholderTextColor={appColors.gray}
                onChangeText={value => onChangeText('neqnumber', value)}
              />
            </View>
            <PhoneInputComponent
              value={inputs?.contact}
              onChangeText={value => onChangeText('contact', value)}
              onChangeCountryCode={value =>
                setInputs({
                  ...inputs,
                  countryCode: value.callingCode.toString(),
                })
              }
            />
            <View style={{ marginTop: width(5) }}>
              <InputField
                placeholder={'Personal Responsible'}
                placeholderTextColor={appColors.gray}
                value={inputs.personalResponsible}
                onChangeText={value =>
                  onChangeText('personalResponsible', value)
                }
              />
            </View>
            <View style={{ marginTop: width(5) }}>
              <InputField
                placeholder={'Address'}
                placeholderTextColor={appColors.gray}
                value={inputs.address}
                onChangeText={value => onChangeText('address', value)}
              />
            </View>
            {user?.loginType != 'Google' && user?.loginType != 'Apple' && (
              <View style={{ marginTop: width(4) }}>
                <Button
                  btnTitle={'Change Password'}
                  btnTextStyle={{
                    color: appColors.white,
                  }}
                  buttonContainer={{
                    backgroundColor: appColors.primaryColor,
                    paddingVertical: width(3),
                    borderRadius: width(100),
                  }}
                  handlePressBtn={() => navigation.navigate('ChangePassword')}
                />
              </View>
            )}

            <View style={{ marginVertical: width(1) }}>
              <Button
                btnTitle={'Update'}
                btnTextStyle={{
                  color: appColors.white,
                }}
                handlePressBtn={handlePress}
                buttonContainer={{
                  backgroundColor: appColors.primaryColor,
                  paddingVertical: width(3),
                  marginTop: width(2),
                  borderRadius: width(100),
                }}
              />
            </View>

            <View style={{ marginVertical: width(1) }}>
              <Button
                btnTitle={'Delete Account'}
                btnTextStyle={{
                  color: appColors.white,
                  fontFamily: fontFamily.poppinsSemiBold,
                }}
                buttonContainer={{
                  backgroundColor: appColors.red,
                  paddingVertical: width(3),
                  marginTop: width(2),
                  borderRadius: width(100),
                }}
                handlePressBtn={handleDeleteAccount}
              />
            </View>
          </View>
          <View style={{ height: width(14) }} />
        </ScrollView>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}>
            <View
              style={{
                backgroundColor: appColors.white,
                borderRadius: width(4),
                padding: width(6),
                marginHorizontal: width(4),
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  fontSize: 18,
                  color: appColors.black,
                  textAlign: 'center',
                  marginBottom: width(4),
                }}>
                Are you sure you want to delete your account?
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsRegular,
                  fontSize: 14,
                  color: appColors.gray,
                  textAlign: 'center',
                  marginBottom: width(6),
                }}>
                Once deleted, this action cannot be reverted.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={cancelDeleteAccount}
                  style={{
                    flex: 1,
                    backgroundColor: appColors.gray,
                    paddingVertical: width(3),
                    borderRadius: width(100),
                    marginRight: width(2),
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: appColors.white,
                      fontFamily: fontFamily.poppinsSemiBold,
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDeleteAccount}
                  style={{
                    flex: 1,
                    backgroundColor: appColors.red,
                    paddingVertical: width(3),
                    borderRadius: width(100),
                    marginLeft: width(2),
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: appColors.white,
                      fontFamily: fontFamily.poppinsSemiBold,
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Delete Account Success Modal */}
        {showDeleteSuccess && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}>
            <View
              style={{
                backgroundColor: appColors.white,
                borderRadius: width(4),
                padding: width(6),
                marginHorizontal: width(4),
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: width(15),
                  height: width(15),
                  borderRadius: width(100),
                  backgroundColor: appColors.green,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: width(4),
                }}>
                <Entypo name="check" size={30} color={appColors.white} />
              </View>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  fontSize: 18,
                  color: appColors.black,
                  textAlign: 'center',
                  marginBottom: width(2),
                }}>
                Account Deleted Successfully!
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsRegular,
                  fontSize: 14,
                  color: appColors.gray,
                  textAlign: 'center',
                  marginBottom: width(6),
                }}>
                Your account has been permanently deleted.
              </Text>
              <TouchableOpacity
                onPress={onDeleteSuccess}
                style={{
                  backgroundColor: appColors.primaryColor,
                  paddingVertical: width(3),
                  paddingHorizontal: width(8),
                  borderRadius: width(100),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: appColors.white,
                    fontFamily: fontFamily.poppinsSemiBold,
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <CommonAlert ref={constants} />
      </SafeAreaView>
    );
  };

  const handleLogin = () => {
    navigation.navigate('Login', {
      type: 'hire',
    });
  };

  // AsyncStorage.removeItem('userData');
  // AsyncStorage.removeItem('token');
  // dispatch(setUserData(null));
  useEffect(() => {
    if (!user?._id) {
      handleLogin();
    }
  }, [user]);

  return <>{user?._id ? renderProfileContent() : null}</>;
};

export default Settings;

const styles = StyleSheet.create({
  deleteIcon: {
    backgroundColor: appColors.white,
    position: 'absolute',
    bottom: 10,
    right: 5,
    height: width(7),
    width: width(7),
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
