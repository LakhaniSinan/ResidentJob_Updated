import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';

const MyCategoryCard = ({item, index, type, handleClickCategory}) => {
  return (
    <TouchableOpacity
      onPress={() => handleClickCategory(item)}
      key={index}
      style={styles.container}>
      <ImageBackground
        source={{uri: item?.image}}
        style={styles.imageBackground}
        imageStyle={{borderRadius: width(3)}}>
        <View style={styles.overlay} />
        <Text numberOfLines={2} style={styles.text}>
          {item?.name}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: width(4),
    height: width(20),
    marginHorizontal: width(2),
    borderRadius: width(3),
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    fontFamily: fontFamily.poppinsBold,
    color: appColors.white,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MyCategoryCard;
