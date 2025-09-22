import React, {useRef} from 'react';
import {Platform, StyleSheet} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {appColors} from '../../constants';

const PhoneInputComponent = ({onChangeCountryCode, onChangeText, value}) => {
  const phoneInput = useRef();

  return (
    <PhoneInput
      ref={phoneInput}
      defaultValue={value}
      defaultCode="CA"
      layout="first"
      textInputStyle={styles.textInput}
      containerStyle={styles.container}
      textInputProps={{value: value}}
      textContainerStyle={styles.textContainer}
      onChangeText={onChangeText}
      onChangeCountry={onChangeCountryCode}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
    marginTop: 10,
    backgroundColor: appColors.white,
  },
  textContainer: {
    backgroundColor: appColors.white,
    paddingVertical: Platform.OS == 'ios' ? 14 : 2,
  },
  textInput: {
    fontSize: 14,
    color: appColors.black,
  },
});

export default PhoneInputComponent;
