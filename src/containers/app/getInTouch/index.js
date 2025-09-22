import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import {width} from 'react-native-dimension';
import {appIcons} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import Loader from '../../../components/loader';
import InputField from '../../../components/textInput';
import {appColors} from '../../../constants';
import {sendHelpMessage} from '../../../services/getInTouch';
import CommonAlert from '../../../components/commanAlert';

const GetInTouch = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const constants = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    if (name && email && message) {
      sendHelpMessage({name, email, message})
        .then(response => {
          console.log('Help message sent successfully:', response);
          if (response && response.status === 200) {
            setIsLoading(false);
            constants.current.isVisible({
              status: 'ok',
              message: 'Your message has been sent successfully!',
              handlePressOk: () => {
                constants.current.backdropPress();
                setEmail('');
                setName('');
                setMessage('');
                navigation.goBack();
              },
            });
          } else {
            setIsLoading(false);
            constants.current.isVisible({
              status: 'error',
              message: 'Failed to send your message. Please try again!',
              handlePressOk: () => {
                constants.current.backdropPress();
              },
            });
          }
        })
        .catch(error => {
          console.error('Error sending help message:', error);
          constants.current.isVisible({
            status: 'error',
            message: 'Something went wrong. Please try again!',
            handlePressOk: () => {
              constants.current.backdropPress();
            },
          });
        });
    } else {
      constants.current.isVisible({
        status: 'error',
        message: 'Please fill all fields!',
        handlePressOk: () => {
          constants.current.backdropPress();
        },
      });
    }

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <View style={{flex: 1, backgroundColor: appColors.white}}>
        <AppHeader
          height={width(20)}
          heading={'Write directly to us!'}
          headingColor={appColors.white}
          leftIconStyle={{height: 27, width: 27}}
          leftIcon={appIcons.goBackIcon}
        />
        <View style={{paddingHorizontal: width(6), marginTop: width(10)}}>
          <View style={{marginTop: width(2)}}>
            <InputField
              inputLabel="Name"
              placeholder="Enter your name"
              placeholderTextColor={appColors.gray}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={{marginTop: width(2)}}>
            <InputField
              placeholderTextColor={appColors.gray}
              inputLabel="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={{marginTop: width(2)}}>
            <InputField
              inputLabel="Your Message"
              placeholder="Enter your message"
              placeholderTextColor={appColors.gray}
              multiline={true}
              borderRadius={width(6)}
              value={message}
              onChangeText={setMessage}
            />
          </View>
          <View style={{marginVertical: width(10)}}>
            <Button
              btnTitle={'Send'}
              btnTextStyle={{
                color: appColors.white,
              }}
              handlePressBtn={handleClick}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                paddingVertical: width(3),
                borderRadius: width(3),
              }}
            />
          </View>
        </View>
      </View>
      <CommonAlert ref={constants} />
    </>
  );
};

export default GetInTouch;
