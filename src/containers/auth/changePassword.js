import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { appIcons, fontFamily } from '../../assets';
import AuthHeader from '../../components/authHeader';
import Button from '../../components/button';
import Loader from '../../components/loader';
import InputField from '../../components/textInput';
import { appColors } from '../../constants';
import { setUserData } from '../../redux/slices/Login';
import { changeUserPassword } from '../../services/authentication';
import AppHeader from '../../components/appHeader';
import CommonAlert from '../../components/commanAlert';

const ChangePassword = () => {
  const constants = useRef(null);
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const { user } = useSelector(state => state.LoginSlice);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return constants.current.isVisible({
        status: 'error',
        message: 'All fields are required.',
      });
    }
    if (newPassword !== confirmNewPassword) {
      return constants.current.isVisible({
        status: 'error',
        message: 'New password and confirm password dose not match!',
      });
    }

    try {
      setIsLoading(true);
      const response = await changeUserPassword({
        userId: user?.userDetails?._id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      if (response.status == 200 || response.status == 201) {
        constants.current.isVisible({
          status: 'ok',
          message: response.data.message,
          handlePressOk: () => {
            dispatch(setUserData(null));
            AsyncStorage.removeItem('userData');
          },
        });
      } else {
        constants.current.isVisible({
          status: 'error',
          message: response.data.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'errorerrorerror');
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: appColors.white, flex: 1 }}>
        <AppHeader
          height={width(20)}
          heading={'Change Password'}
          headingColor={appColors.white}
          leftIconStyle={{ height: 27, width: 27 }}
          leftIcon={appIcons.goBackIcon}
        />
        <View style={{ marginHorizontal: width(4) }}>
          <View style={{ marginVertical: width(6) }}>
            <View style={{ marginTop: width(2) }}>
              <InputField
                placeholder="Current Password"
                placeholderTextColor={appColors.gray}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={showCurrentPass ? false : true}
                endIcon={
                  <Ionicons
                    name={!showCurrentPass ? 'eye-off-outline' : 'eye-outline'}
                    color={appColors.gray}
                    size={23}
                  />
                }
                onEndIconPress={() => setShowCurrentPass(!showCurrentPass)}
              />
            </View>
            <View style={{ marginTop: width(2) }}>
              <InputField
                placeholder="New Password"
                placeholderTextColor={appColors.gray}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={showNewPass ? false : true}
                endIcon={
                  <Ionicons
                    name={!showNewPass ? 'eye-off-outline' : 'eye-outline'}
                    color={appColors.gray}
                    size={23}
                  />
                }
                onEndIconPress={() => setShowNewPass(!showNewPass)}
              />
            </View>
            <View style={{ marginTop: width(2) }}>
              <InputField
                placeholder="Confirm New Password"
                placeholderTextColor={appColors.gray}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry={showConfirmPass ? false : true}
                endIcon={
                  <Ionicons
                    name={!showConfirmPass ? 'eye-off-outline' : 'eye-outline'}
                    color={appColors.gray}
                    size={23}
                  />
                }
                onEndIconPress={() => setShowConfirmPass(!showConfirmPass)}
              />
            </View>
            <View style={{ marginTop: width(2) }}>
              <Button
                btnTitle={isLoading ? 'Processing...' : 'Change Password'}
                btnTextStyle={{
                  color: appColors.white,
                  fontFamily: fontFamily.poppinsBold,
                }}
                buttonContainer={{
                  backgroundColor: appColors.lightMehroon,
                  borderRadius: width(100),
                  borderWidth: 1,
                  borderColor: appColors.gray,
                  marginTop: width(3),
                  paddingVertical: width(3),
                  opacity: isLoading ? 0.6 : 1,
                }}
                handlePressBtn={handleChangePassword}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <Loader isLoading={isLoading} />
      <CommonAlert ref={constants} />
    </>
  );
};

export default ChangePassword;
