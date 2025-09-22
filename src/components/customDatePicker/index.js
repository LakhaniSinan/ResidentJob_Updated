import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../assets';
import { appColors } from '../../constants';
import CommonAlert from '../commanAlert';

const timeSlots = [
  '1:00 AM',
  '2:00 AM',
  '3:00 AM',
  '4:00 AM',
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
];



const DateRangePicker = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const constants = useRef(null);
  const handleEndDateSelection = selectedTime => {
    if (
      startDate &&
      timeSlots.indexOf(selectedTime) < timeSlots.indexOf(startDate)
    ) {
      constants.current.isVisible({
        status: 'error',
        message: 'End time cannot be before the start time',
      });
    } else {
      setEndDate(selectedTime);
      setOpenEnd(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setOpenStart(true)}>
          <Text style={styles.dateText}>{startDate || 'Select Time'}</Text>
        </TouchableOpacity>
        <Modal visible={openStart} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={timeSlots}
                numColumns={3}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.timeSlot}
                    onPress={() => {
                      setStartDate(item);
                      setOpenStart(false);
                    }}>
                    <Text style={styles.timeText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setOpenStart(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setOpenEnd(true)}>
          <Text style={styles.dateText}>{endDate || 'Select Time'}</Text>
        </TouchableOpacity>
        <Modal visible={openEnd} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={timeSlots}
                numColumns={3}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.timeSlot}
                    onPress={() => handleEndDateSelection(item)}>
                    <Text style={styles.timeText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setOpenEnd(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <CommonAlert ref={constants} />
    </View>
  );
};

export default DateRangePicker;

const styles = StyleSheet.create({
  container: {
    marginTop: width(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: width(2),
  },
  dateContainer: {
    flex: 1,
    width: width(41),
  },
  label: {
    fontFamily: fontFamily.poppinsBold,
    color: appColors.black,
    fontSize: 12,
    marginBottom: width(2),
  },
  dateInput: {
    marginRight: width(3),
    borderRadius: width(100),
    padding: width(4),
    borderWidth: 1,
    borderColor: appColors.gray,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dateText: {
    fontFamily: fontFamily.interBold,
    color: appColors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  timeSlot: {
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
    width: width(23),
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: appColors.gray,
  },
  timeText: {
    fontSize: 16,
    color: appColors.black,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: appColors.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
