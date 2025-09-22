import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../assets';
import { appColors } from '../../constants';

const CategoryCard = ({ item, index, type, handleClickCategory }) => {
  return (
    <TouchableOpacity
      onPress={() => handleClickCategory(item)}
      key={index}
      style={{
        marginHorizontal: width(2),
        marginVertical: 10,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row"
      }}>
      <Text
        style={{
          fontFamily: fontFamily.poppinsBold,
          color: appColors.black,
        }}>
        {item?.name}  (${item.price})
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({});
