import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../assets';

const TopServicesCard = ({item, index}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ChefProfiles', {
          ...item,
          type: 'topService',
          _id: item?.jobSeeker?._id,
        })
      }
      key={index}
      style={styles.cardContainer}>
      <Image
        source={{uri: item?.jobSeeker?.image}}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text numberOfLines={1} style={styles.nameText}>
          {item?.jobSeeker?.fullname}
        </Text>
        <Text style={styles.roleText}>{item?.jobSeeker?.jobTitle?.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStar}>⭐</Text>
          <Text style={styles.ratingText}>{item?.averageRating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width(50),
    height: width(65),
    marginHorizontal: width(2),
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: width(2),
    height: width(23),
    marginHorizontal: width(3),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
  nameText: {
    fontFamily: fontFamily.poppinsBold,
    fontSize: 16,
    color: 'white',
  },
  roleText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 12,
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    fontSize: 14,
    color: 'orange',
  },
  ratingText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: width(2),
    color: 'white',
    marginLeft: 4,
  },
});

export default TopServicesCard;
