import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {appIcons, fontFamily} from '../../assets';
import {appColors} from '../../constants';
import Button from '../button';
let propsData = {};

const LogoutAlert = React.forwardRef((props, ref) => {
  const [isVisible, ModalVisibility] = useState(false);

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      propsData = params;
      ModalVisibility(true);
    },
    backdropPress() {
      ModalVisibility(false);
    },
  }));

  const {message, status, handleDelete, handlePressOk} = propsData;
  return (
    <Modal
      style={{alignSelf: 'center', alignItems: 'center'}}
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      backdropOpacity={0.5}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}>
      <View
        style={{
          width: width(75),
          backgroundColor: 'white',
          borderRadius: width(6),
          paddingVertical: width(6),
        }}>
        <View style={{alignSelf: 'center'}}>
          {status == 'logout' && (
            <FastImage
              source={appIcons.logoutIcon}
              style={{height: width(25), width: width(25)}}
            />
          )}
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 14,
              color: appColors.black,
              fontFamily: fontFamily.poppinsRegular,
              marginVertical: width(5),
              width: width(60),
              textAlign: 'center',
            }}>
            {message}
          </Text>
        </View>
        {status == 'logout' && (
          <>
            <View
              style={{
                justifyContent: 'center',
                height: width(14),
                borderBottomWidth: 1,
                borderBottomColor: appColors.gray,
              }}>
              <Button
                handlePressBtn={() => {
                  if (handlePressOk) {
                    handlePressOk();
                  } else {
                    ModalVisibility(false);
                  }
                }}
                btnFontSize={12}
                btnTitle={'Logout'}
                btnTextStyle={{
                  color: appColors.red,
                }}
                buttonContainer={{
                  backgroundColor: appColors.white,
                  borderColor: appColors.white,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: width(3),
                }}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                height: width(14),
                borderBottomWidth: 1,
                borderBottomColor: appColors.gray,
              }}>
              <Button
                handlePressBtn={() => ModalVisibility(false)}
                btnFontSize={12}
                btnTitle={'Cancel'}
                btnTextStyle={{
                  color: appColors.black,
                }}
                buttonContainer={{
                  backgroundColor: appColors.white,
                  borderColor: appColors.white,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: width(3),
                }}
              />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
});

export default LogoutAlert;
