import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {Menu} from 'react-native-paper';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';

const SearchBar = ({
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
  onSubmitEditing
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
            color: hasError ? appColors.red : appColors.black,
            fontFamily: fontFamily.ManropeRegular,
          }}>
          {InputLable}
        </Text>
      )}
      <View
        style={{
          ...InputContainerStyle,
          height: multiline ? width(30) : width(10),
          borderRadius: borderRadius !== undefined ? borderRadius : width(100),
          backgroundColor: hasError ? appColors.LightRed : appColors.white,
          flexDirection: isArabic ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
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
          onSubmitEditing={event => onSubmitEditing(event.nativeEvent.text)}
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
        <Menu
          visible={openMenu}
          onDismiss={handleCloseMenu}
          anchorPosition="top"
          contentStyle={{
            backgroundColor: appColors.blue,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: appColors.gray,
            width: '80%',
          }}
          elevation={0}
          statusBarHeight={-width(22)}
          anchor={
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                borderLeftWidth: 1,
                paddingLeft: width(2),
                borderLeftColor: appColors.gray,
                marginRight: width(2),
                flexDirection: 'row',
                alignItems: 'center',
                display: showCommentMenu ? 'flex' : 'none',
                alignSelf: 'flex-end',
              }}
              onPress={() => setOpenMenu(true)}>
              <Text style={{color: appColors.gray}}>Private</Text>
              <MaterialIcons
                name={openMenu ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                color={appColors.gray}
                size={22}
              />
            </TouchableOpacity>
          }>
          <Menu.Item
            titleStyle={{
              color: 'red',
              fontFamily: fontFamily.poppinsBold,
            }}
            style={{
              height: 25,
              marginBottom: 6,
            }}
            onPress={handleCloseMenu}
            title="Private"
          />
          <Menu.Item
            style={{
              height: 25,
              marginTop: 6,
            }}
            onPress={handleCloseMenu}
            title="Public"
            titleStyle={{
              color: appColors.gray,
              fontFamily: fontFamily.poppinsRegular,
            }}
          />
        </Menu>

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
              marginRight: width(3),
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

export default SearchBar;
