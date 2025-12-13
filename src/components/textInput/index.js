import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, Keyboard, View} from 'react-native';
import {width} from 'react-native-dimension';
import {Divider, Menu} from 'react-native-paper';
// import MaterialIcons from '@react-native-vector-icons/material-icons';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';

const InputField = ({
  multiline,
  InputLable,
  endIcon,
  startIcon,
  placeholder,
  placeholderTextColor,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  style,
  onEndIconPress,
  borderRadius,
  customEndIcon,
  hasError,
  errorText,
  borderWidth,
  isArabic,
  maxLength,
  isEditable,
  textContentType,
  InputContainerStyle,
  showCommentMenu,
}) => {
  const [focusField, setFocusField] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <View>
      {InputLable && (
        <Text
          style={{
            marginVertical: width(3),
            color: appColors.black,
            fontFamily: fontFamily.ManropeRegular,
          }}>
          {InputLable}
        </Text>
      )}
      <View
        style={{
          ...InputContainerStyle,
          height: multiline ? width(30) : width(13),
          borderRadius: borderRadius !== undefined ? borderRadius : width(100),
          flexDirection: isArabic ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: borderWidth ? borderWidth : 1,
          borderColor: focusField ? appColors.black : appColors.gray,
          overflow: 'hidden',
        }}>
        {startIcon && (
          <View
            style={{
              height: width(7),
              width: width(7),
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: width(2),
            }}>
            {startIcon}
          </View>
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          multiline={multiline}
          value={value}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={() => setFocusField(true)}
          onBlur={() => setFocusField(false)}
          editable={isEditable}
          autoCapitalize="none"
          textContentType={textContentType}
          onSubmitEditing={() => Keyboard.dismiss()}
          returnKeyType="done"
          style={{
            ...style,
            flex: 1,
            paddingHorizontal: width(6),
            height: multiline ? width(30) : width(13),
            color: hasError ? appColors.red : appColors.black,
            fontFamily: fontFamily.poppinsRegular,
            textAlignVertical: multiline ? 'top' : 'center',
            textAlign: isArabic ? 'right' : 'left',
          }}
        />

        {customEndIcon && (
          <View
            style={{
              height: width(7),
              width: width(7),
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: width(2),
            }}>
            {customEndIcon}
          </View>
        )}
        {!customEndIcon && endIcon && (
          <TouchableOpacity
            onPress={onEndIconPress}
            style={{
              height: width(7),
              width: width(7),
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: width(2),
              marginLeft: width(1),
            }}>
            {endIcon}
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <Text
          style={{
            color: appColors.red,
            fontFamily: fontFamily.ManropeRegular,
          }}>
          {errorText}
        </Text>
      )}
    </View>
  );
};

export default InputField;
