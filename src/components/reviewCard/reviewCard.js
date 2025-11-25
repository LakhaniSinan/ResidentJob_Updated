import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';
import moment from 'moment';

const RenderReviewCard = ({item}) => {
  const [showAllReview, setShowAllReview] = useState(false);

  // Calculate total hours
  const totalHours = item?.checkInOut?.reduce((sum, record) => {
    if (record.checkInTime && record.checkOutTime) {
      const checkIn = moment(record.checkInTime);
      const checkOut = moment(record.checkOutTime);
      const duration = moment.duration(checkOut.diff(checkIn));
      return sum + duration.asHours();
    }
    return sum;
  }, 0);

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image source={{uri: item?.image}} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {item?.jobSeekerId?.firstname} {item?.jobSeekerId?.lastname || ''}
          </Text>
          <Text style={styles.totalHoursText}>
            {totalHours.toFixed(2)}h worked
          </Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Check In</Text>
          <Text style={styles.headerText}>Check Out</Text>
          <Text style={styles.headerText}>Hours</Text>
        </View>

        {/* Table Rows */}
        {item?.checkInOut?.map((row, index) => {
          const checkIn = row?.checkInTime ? moment(row.checkInTime) : null;
          const checkOut = row?.checkOutTime ? moment(row.checkOutTime) : null;
          const hours =
            checkIn && checkOut
              ? moment.duration(checkOut.diff(checkIn)).asHours()
              : 0;

          return (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.rowText}>
                {moment(row?.date).format('DD/MM/YYYY')}
              </Text>
              <Text style={styles.rowText}>
                {checkIn ? checkIn.format('hh:mm A') : 'N/A'}
              </Text>
              <Text style={styles.rowText}>
                {checkOut ? checkOut.format('hh:mm A') : 'N/A'}
              </Text>
              <Text style={styles.rowText}>{hours.toFixed(2)}h</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default RenderReviewCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: width(90),
    backgroundColor: appColors.white,
    borderRadius: width(4),
    padding: width(4),
    marginVertical: width(3),
    marginHorizontal: width(3),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width(3),
  },
  profileImage: {
    width: width(14),
    height: width(14),
    borderRadius: width(7),
    borderWidth: 1,
    borderColor: appColors.lightGray,
  },
  userInfo: {
    marginLeft: width(3),
    justifyContent: 'center',
  },
  name: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: 16,
    color: appColors.black,
  },
  totalHoursText: {
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 12,
    color: appColors.gray,
    marginTop: 2,
  },
  tableContainer: {
    marginTop: width(2),
    borderRadius: width(2),
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: appColors.primary,
    paddingVertical: width(2),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamily.poppinsSemiBold,
    color: appColors.black,
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: width(2),
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 13,
    color: appColors.black,
  },
});
