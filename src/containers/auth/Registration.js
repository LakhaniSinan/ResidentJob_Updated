import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { width } from 'react-native-dimension';
import Ionicons from '@react-native-vector-icons/ionicons';
import { appIcons, fontFamily } from '../../assets';
import AuthHeader from '../../components/authHeader';
import Button from '../../components/button';
import CommonAlert from '../../components/commanAlert';
import Loader from '../../components/loader';
import PhoneInputComponent from '../../components/phoneInput';
import InputField from '../../components/textInput';
import { appColors } from '../../constants';
import { sendOtp } from '../../services/authentication';
import AppHeader from '../../components/appHeader';
import CustomCheckBox from '../../components/customcheckBox';
import { stat } from 'react-native-fs';

const Registration = ({ route }) => {
  const state = route.params;
  const [isAgree, setIsAgree] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigation = useNavigation();
  const constants = useRef();
  const [showRePass, setShowRePass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    legalname: "",
    email: '',
    password: '',
    address: "",
    personalResponsible: "",
    neqnumber: '',
    countryCode: '',
    contact: '',
    confirmPassword: '',
  });

  const handleChange = (name, value) =>
    setFormData({ ...formData, [name]: value });

  const handleRegister = async () => {
    const {
      firstname,
      lastname,
      email,
      contact,
      countryCode,
      confirmPassword,
      password,

      legalname,
      personalResponsible,
      neqnumber,
      address,
    } = formData;
    if (
      firstname == '' ||
      lastname == '' ||
      email == '' ||
      contact == '' ||
      confirmPassword == '' ||
      password == '' ||
      (state == 'hire' && (
        neqnumber == '' ||
        address === '' ||
        legalname == "" ||
        personalResponsible == ""
      ))
    ) {
      constants.current.isVisible({
        status: 'error',
        message: 'Please fill all fields',
      });
    } else if (!isAgree) {
      constants.current.isVisible({
        status: 'error',
        message: 'Please accept terms and conditions first',
      });
    } else if (formData.password != formData.confirmPassword) {
      constants.current.isVisible({
        status: 'error',
        message: 'Password mismatch',
      });
    } else {
      try {
        const params = {
          firstname,
          lastname,
          email,
          contact,
          confirmPassword,
          password,
          countryCode,
          type: state,
          status: state == "hire" ? true : false,
          ...(state == 'hire' && {
            address,
            legalname,
            neqnumber,
            personalResponsible,
          })
        };
        const payload = {
          email: formData.email,
          contact: formData.contact,
          type: state,
        };

        console.log(params, "paramsparamsparams");

        setIsLoading(true);
        const response = await sendOtp(payload);

        setIsLoading(false);
        if (response.status == 200 || response.status === 201) {
          constants.current.isVisible({
            status: 'ok',
            message: response.data.message,
            handlePressOk: () => {
              constants.current.backdropPress();
              navigation.navigate('VerifyOTP', params);
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
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>
      <Loader isLoading={isLoading} />
      <CommonAlert ref={constants} />
      <AppHeader
        height={width(20)}
        heading={`Register As ${state == 'hire' ? 'Customer' : 'Worker'}`}
        headingColor={appColors.white}
        leftIconStyle={{ height: 27, width: 27 }}
        leftIcon={appIcons.goBackIcon}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled">
          <View style={{ paddingHorizontal: width(3) }}>
            <View style={{ marginTop: width(5) }}>
              <InputField
                value={formData.firstname}
                placeholder="First Name"
                placeholderTextColor={appColors.gray}
                onChangeText={value => handleChange('firstname', value)}
              />
            </View>
            <View style={{ marginTop: width(5) }}>
              <InputField
                value={formData.lastname}
                placeholder="Last Name"
                placeholderTextColor={appColors.gray}
                onChangeText={value => handleChange('lastname', value)}
              />
            </View>
            {state == 'hire' && <View style={{ marginTop: width(5) }}>
              <InputField
                value={formData.legalname}
                placeholder="Legal Name"
                placeholderTextColor={appColors.gray}
                onChangeText={value => handleChange('legalname', value)}
              />
            </View>}
            <View style={{ marginTop: width(5) }}>
              <InputField
                value={formData.email}
                placeholder="Email"
                placeholderTextColor={appColors.gray}
                onChangeText={value => handleChange('email', value)}
              />
            </View>
            {state == 'hire' && <View style={{ marginTop: width(5) }}>
              <InputField
                value={formData.neqnumber}
                placeholder="NEQ Number"
                keyboardType='number-pad'
                placeholderTextColor={appColors.gray}
                onChangeText={value => handleChange('neqnumber', value)}
              />
            </View>}
            <PhoneInputComponent
              value={formData?.contact}
              onChangeText={value => handleChange('contact', value)}
              onChangeCountryCode={value =>
                setFormData({
                  ...formData,
                  countryCode: value.callingCode.toString(),
                })
              }
            />
            <View style={{ marginTop: width(5) }}>
              <InputField
                placeholder={'Password'}
                placeholderTextColor={appColors.gray}
                secureTextEntry={!showPass}
                value={formData.password}
                onChangeText={value => handleChange('password', value)}
                endIcon={
                  <Ionicons
                    name={!showPass ? 'eye-off-outline' : 'eye-outline'}
                    color={appColors.gray}
                    size={23}
                  />
                }
                onEndIconPress={() => setShowPass(!showPass)}
              />
            </View>
            <View style={{ marginTop: width(5) }}>
              <InputField
                placeholder={'Confirm password'}
                placeholderTextColor={appColors.gray}
                secureTextEntry={!showRePass}
                value={formData.confirmPassword}
                onChangeText={value => handleChange('confirmPassword', value)}
                endIcon={
                  <Ionicons
                    name={!showRePass ? 'eye-off-outline' : 'eye-outline'}
                    color={appColors.gray}
                    size={23}
                  />
                }
                onEndIconPress={() => setShowRePass(!showRePass)}
              />
            </View>
            {state == 'hire' && <View style={{ marginTop: width(5) }}>
              <InputField
                placeholder={'Personal Responsible'}
                placeholderTextColor={appColors.gray}
                value={formData.personalResponsible}
                onChangeText={value => handleChange('personalResponsible', value)}
              />
            </View>}
            {state == 'hire' && <View style={{ marginTop: width(5) }}>
              <InputField
                placeholder={'Address'}
                placeholderTextColor={appColors.gray}
                value={formData.address}
                onChangeText={value => handleChange('address', value)}
              />
            </View>}
            <View style={{ marginTop: width(1) }}>
              <CustomCheckBox
                checked={isAgree}
                onChange={setIsAgree}
                label={'Accept terms and conditions'}
                screenTypeLabel={'Terms & Conditions'}
                lastText={''}
                handleNavigateToLabelType={() => {
                  navigation.navigate('TermsAndCondition');
                }}
              />
            </View>
            <Button
              btnTitle="Register"
              btnTextStyle={{
                color: appColors.white,
                fontFamily: fontFamily.poppinsBold,
              }}
              buttonContainer={{
                backgroundColor: appColors.lightMehroon,
                borderRadius: width(100),
                marginTop: width(3),
                borderWidth: 1,
                borderColor: appColors.gray,
                paddingVertical: width(3),
              }}
              handlePressBtn={handleRegister}
            />
          </View>
          <View style={{ height: width(10) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Registration;
