import React, {useRef} from 'react';
import {Platform, StyleSheet} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {appColors} from '../../constants';

const PhoneInputComponent = ({onChangeCountryCode, onChangeText, value}) => {
  const phoneInput = useRef(null);

  return (
    <PhoneInput
      ref={phoneInput}
      value={value}
      defaultCode="CA"
      layout="first"
      textInputStyle={styles.textInput}
      containerStyle={styles.container}
      textContainerStyle={styles.textContainer}
      flagButtonStyle={styles.flagButton}
      onChangeText={onChangeText}
      onChangeCountry={onChangeCountryCode}
    />
  );
};

export default PhoneInputComponent;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 100,
    width: '100%',
    marginTop: 10,
    backgroundColor: appColors.white,
  },

  flagButton: {
    paddingLeft: 8,
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
