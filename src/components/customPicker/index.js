import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {height, width} from 'react-native-dimension';
import Modal from 'react-native-modal';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {fontFamily} from '../../assets';
import {appColors} from '../../constants';

const CustomPicker = React.forwardRef(
  (
    {
      marginVertical,
      labelll,
      value,
      listData,
      handleSelectValue,
      name,
      type,
      hideEndIcon,
    },
    ref,
  ) => {
    const [isVisible, setModalVisibility] = useState(false);

    React.useImperativeHandle(ref, () => ({
      show() {
        setModalVisibility(true);
      },
      hide() {
        setModalVisibility(false);
      },
    }));

    const renderLabel = () => {
      if (value) {
        const selectedItem = listData.find(item => item.name === value);
        return selectedItem ? selectedItem.name : labelll;
      }
      return labelll;
    };

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => ref.current.show()}
          style={[styles.dropdown, {marginVertical: marginVertical || 0}]}>
          <Text
            style={[
              styles.dropdownText,
              {color: value ? appColors.black : appColors.gray},
            ]}>
            {renderLabel()}
          </Text>
          {!hideEndIcon && (
            <MaterialIcons
              name={isVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={25}
              color={appColors.black}
            />
          )}
        </TouchableOpacity>

        <Modal
          isVisible={isVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          backdropOpacity={0.5}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          onBackdropPress={() => ref.current.hide()}
          style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {type == 'start'
                  ? 'Select Start Time'
                  : type == 'end'
                  ? 'Select End Time'
                  : labelll}
              </Text>
              <TouchableOpacity onPress={() => ref.current.hide()}>
                <MaterialIcons name="close" size={25} color={appColors.black} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={listData}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      ref.current.hide();
                      handleSelectValue(name, item);
                    }}
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          value === item.name
                            ? appColors.primaryColor
                            : appColors.white,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            value === item.name
                              ? appColors.white
                              : appColors.black,
                        },
                      ]}
                      numberOfLines={1}>
                      {item.name ? item.name : item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>No Data Found!</Text>
                </View>
              }
            />
          </View>
        </Modal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: appColors.white,
    borderRadius: 100,
    paddingVertical: width(2),
    paddingHorizontal: width(5),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: appColors.gray,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  dropdownText: {
    fontFamily: fontFamily.poppinsBold,
    color: appColors.lightBlack,
    fontSize: 18,
  },
  modal: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalContent: {
    maxHeight: height(60),
    minHeight: height(20),
    width: width(92),
    backgroundColor: 'white',
    borderRadius: width(2),
    paddingVertical: width(4),
  },
  modalHeader: {
    marginHorizontal: width(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: width(4),
  },
  modalTitle: {
    color: appColors.black,
    fontWeight: '700',
    fontSize: 17,
  },
  option: {
    paddingVertical: width(4),
    paddingHorizontal: width(5),
    marginHorizontal: width(3),
    borderRadius: 100,
  },
  optionText: {
    fontWeight: '500',
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    color: appColors.black,
    fontWeight: '600',
    fontSize: 17,
  },
});

export default CustomPicker;
