import {StyleSheet} from 'react-native';
import {width} from 'react-native-dimension';
import {appColors} from '../../../constants';
import {fontFamily} from '../../../assets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  jobTitleContainer: {
    paddingHorizontal: width(2),
    paddingVertical: width(2),
    marginHorizontal: width(2),
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: appColors.blue,
  },
  inputContainer: {
    marginTop: width(2),
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
  button: {
    height: width(10),
    width: width(10),
    borderRadius: width(10),
    backgroundColor: appColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputContainer: {
    marginTop: width(2),
  },
  label: {
    fontSize: 16,
    color: appColors.black,
    marginVertical: width(2),
  },
  counterText: {
    color: appColors.black,
  },
  counterContainer: {
    height: width(10),
    width: width(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: width(3),
  },

  labelBold: {
    fontFamily: fontFamily.poppinsBold,
    color: appColors.black,
    fontSize: 14,
    marginVertical: width(2),
  },
  datePickerButton: {
    width: width(45),
    height: width(13),
    backgroundColor: appColors.white,
    marginTop: width(3),
    justifyContent: 'center',
    paddingHorizontal: width(5),
    borderRadius: width(100),
    borderWidth: 1,
    borderColor: appColors.gray,
  },
  datePickerText: {
    fontFamily: fontFamily.poppinsRegular,
    color: appColors.black,
    fontSize: 12,
  },
  locationContainer: {
    paddingHorizontal: width(4),
    flex: 1,
  },
});
