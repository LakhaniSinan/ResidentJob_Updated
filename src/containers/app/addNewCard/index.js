import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useDispatch, useSelector} from 'react-redux';
import InputField from '../../../components/textInput';
import AppHeader from '../../../components/appHeader';
import CustomPicker from '../../../components/customPicker';
import Button from '../../../components/button';
import {appColors} from '../../../constants';
import {fontFamily} from '../../../assets';
import {setCardDetails} from '../../../redux/slices/CardDetailes';

const AddNewCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accountType = useRef();
  const {user} = useSelector(state => state.LoginSlice);

  const [isCardValid, setIsCardValid] = useState(false);
  const [inputVal, setInputVal] = useState({
    holderName: '',
    holderType: '',
    routingNumber: '',
    accountNumber: '',
  });

  useEffect(() => {
    const {holderName, holderType, routingNumber, accountNumber} = inputVal;
    setIsCardValid(
      !holderName || !holderType || !routingNumber || !accountNumber,
    );
  }, [inputVal]);

  const handleInputChange = (field, value) => {
    if (field === 'routingNumber' || field === 'accountNumber') {
      if (!/^\d*$/.test(value)) return;
    }
    setInputVal({...inputVal, [field]: value});
  };

  const handleOpenHolderTypeModal = () => {
    accountType.current.show();
  };

  const handleSelectValue = (name, value) => {
    setInputVal({...inputVal, holderType: value?.name});
  };

  const handleAddCard = async () => {
    let params = {
      holderName: inputVal.holderName,
      holderType: inputVal.holderType,
      routingNumber: inputVal.routingNumber,
      accountNumber: inputVal.accountNumber,
    };
    dispatch(setCardDetails(params));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <AppHeader height={width(20)} showBackBtn={true} />
        <Text
          style={{
            fontFamily: fontFamily.poppinsSemiBold,
            color: appColors.black,
            padding: width(3),
            fontSize: 30,
          }}>
          Add New Card
        </Text>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>Enter your card details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Holder Name</Text>
            <InputField
              placeholderTextColor={appColors.gray}
              value={inputVal.holderName}
              onChangeText={value => handleInputChange('holderName', value)}
              placeholder="Account Holder Name"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomPicker
              ref={accountType}
              label="Account_Holder_Type"
              labelll="Account Holder Type"
              handleOpenModal={handleOpenHolderTypeModal}
              value={inputVal.holderType}
              listData={[{name: 'individual'}, {name: 'company'}]}
              name="holderType"
              handleSelectValue={handleSelectValue}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Routing Number</Text>
            <InputField
              value={inputVal.routingNumber}
              onChangeText={value => handleInputChange('routingNumber', value)}
              placeholder="Routing Number"
              keyboardType="numeric"
              placeholderTextColor={appColors.gray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Number</Text>
            <InputField
              value={inputVal.accountNumber}
              onChangeText={value => handleInputChange('accountNumber', value)}
              placeholder="Account Number"
              keyboardType="numeric"
              placeholderTextColor={appColors.gray}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              handlePressBtn={handleAddCard}
              btnTitle="Add"
              btnFontSize={12}
              disabled={isCardValid}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                ...styles.buttonStyle,
                backgroundColor: isCardValid
                  ? appColors.gray
                  : appColors.lightMehroon,
                borderColor: isCardValid
                  ? appColors.gray
                  : appColors.lightMehroon,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  contentContainer: {
    paddingHorizontal: width(3),
  },
  titleText: {
    fontSize: 16,
    color: appColors.black,
    fontFamily: fontFamily.poppinsRegular,
  },
  inputContainer: {
    marginTop: width(4),
  },
  label: {
    color: appColors.black,
    fontFamily: fontFamily.poppinsBold,
    margin: width(2),
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: width(5),
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    height: width(12),
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: width(3),
  },
});

export default AddNewCard;
