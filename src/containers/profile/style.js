import {StyleSheet} from 'react-native';
import {appColors} from '../../constants';
import {fontFamily} from '../../assets';
import {width} from 'react-native-dimension';

export const styles = StyleSheet.create({
  containerStyles: {
    borderRadius: 10,
    marginTop: width(5),
    marginHorizontal: width(3),
    backgroundColor: appColors.white,
    padding: width(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  containerHeading: {
    fontSize: 18,
    fontFamily: fontFamily.poppinsSemiBold,
    color: appColors.black,
  },
  updateBtn: {
    backgroundColor: appColors.lightMehroon,
    borderRadius: width(100),
    marginTop: width(3),
    borderWidth: 1,
    borderColor: appColors.gray,
    paddingVertical: width(3),
  },
  btnTextStyle: {
    color: appColors.white,
    fontFamily: fontFamily.poppinsBold,
  },
  expertCuisinesCard: {
    marginTop: width(5),
    padding: width(4),
    backgroundColor: appColors.platinum,
    borderRadius: width(10),
    width: '100%',
    borderWidth: width(0.3),
    borderColor: appColors.black,
  },
  expertCuisinesTitle: {
    fontSize: 18,
    fontFamily: fontFamily.poppinsSemiBold,
    color: appColors.black,
    marginBottom: width(4),
    marginLeft: width(20),
  },
  cuisineRow: {
    marginBottom: width(3),
    marginLeft: width(5),
  },
  cuisineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cuisineText: {
    marginLeft: width(2),
    color: appColors.black,
    fontSize: 16,
    fontFamily: fontFamily.poppinsRegular,
  },
});
