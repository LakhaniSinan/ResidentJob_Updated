import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../assets';

const Button = ({
  btnTitle,
  handlePressBtn,
  btnOpacity,
  btnFontSize,
  startIcon,
  endIcon,
  btnTextStyle,
  buttonContainer,
  isShadow,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handlePressBtn}
      activeOpacity={btnOpacity ? btnOpacity : 0.6}
      style={{
        ...buttonContainer,
        width: buttonContainer?.width ? buttonContainer?.width : '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...(isShadow && {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }),
        elevation: isShadow ? 3 : 0,
      }}>
      {startIcon && (
        <View
          style={{
            height: width(7),
            width: width(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {startIcon}
        </View>
      )}
      <Text
        style={{
          ...btnTextStyle,
          fontSize: btnFontSize,
          fontFamily: fontFamily.poppinsBold,
          marginLeft: startIcon ? width(3) : null,
        }}>
        {btnTitle}
      </Text>
      {endIcon && (
        <View
          style={{
            height: width(7),
            width: width(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {endIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
