import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {width} from 'react-native-dimension';
import {appColors} from '../../constants';
import {fontFamily} from '../../assets';

const CustomCheckBox = ({
  checked,
  onChange,
  label,
  type,
  lastText,
  screenTypeLabel,
  containerStyles,
  handleNavigateToLabelType,
  checkedColor = appColors.blue,
  borderColor = appColors.blue,
}) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          {borderColor: borderColor},
          checked && {backgroundColor: checkedColor},
          {...containerStyles},
        ]}
        activeOpacity={0.8}
        onPress={() => onChange(!checked)}>
        {checked && (
          <MaterialIcons name="check" size={18} color={appColors.white} />
        )}
      </TouchableOpacity>
      {label && (
        <Text style={[styles.label, {flexWrap: 'wrap', width: width(73)}]}>
          {label + ' '}
          <Text
            style={[styles.label, {color: appColors.blue}]}
            onPress={() => handleNavigateToLabelType(screenTypeLabel)}>
            {screenTypeLabel}
          </Text>
          {lastText ? ` ${lastText}` : ''}
        </Text>
      )}
    </View>
  );
};

export default CustomCheckBox;

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: width(2),
  },
  checkbox: {
    width: width(6),
    height: width(6),
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    fontSize: 11,
    color: appColors.black,
    fontFamily: fontFamily.poppinsLight,
  },
});
