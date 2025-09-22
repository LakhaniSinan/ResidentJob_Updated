import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import {appIcons, appImages, fontFamily} from '../../assets';
import {appColors} from '../../constants';
import Button from '../button';
let propsData = {};

const CommonAlert = React.forwardRef((props, ref) => {
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

  const {message, status, handlePressOk} = propsData;
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
          width: width(86),
          backgroundColor: 'white',
          borderRadius: width(2),
          padding: width(8),
        }}>
        <View style={{alignSelf: 'center'}}>
          {status == 'ok' && (
            <FastImage
              source={appImages.checkedCircle}
              style={{height: width(25), width: width(25)}}
            />
          )}
          {status == 'confirm' && (
            <View style={{height: width(20), width: width(20)}}>
              <FastImage
                source={appIcons.alertIcon}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            </View>
          )}
          {status == 'maintainence' && (
            <View style={{height: width(20), width: width(20)}}>
              <FastImage
                source={appIcons.maintainence}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            </View>
          )}

          {status == 'error' && (
            <Image
              source={appIcons.redcross}
              style={{height: width(12), width: width(12)}}
            />
          )}
        </View>
        <Text
          style={{
            fontSize: 14,
            color: appColors.black,
            fontFamily: fontFamily.interBold,
            marginVertical: width(5),
            textAlign: 'center',
          }}>
          {message}
        </Text>
        {status == 'ok' && (
          <View style={{justifyContent: 'center', height: width(14)}}>
            <Button
              handlePressBtn={() => {
                if (handlePressOk) {
                  ModalVisibility(false);
                  handlePressOk();
                } else {
                  ModalVisibility(false);
                }
              }}
              btnFontSize={12}
              btnTitle={'Ok'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
        )}
        {status == 'error' && (
          <View style={{justifyContent: 'center', height: width(14)}}>
            <Button
              handlePressBtn={() => ModalVisibility(false)}
              btnFontSize={12}
              btnTitle={'Ok'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
        )}

        {status == 'maintainence' && (
          <View style={{justifyContent: 'center', height: width(14)}}>
            <Button
              handlePressBtn={() => ModalVisibility(false)}
              btnFontSize={12}
              btnTitle={'Ok'}
              btnTextStyle={{
                color: appColors.white,
              }}
              buttonContainer={{
                backgroundColor: appColors.primaryColor,
                borderColor: appColors.primaryColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: width(3),
              }}
            />
          </View>
        )}

        {status == 'confirm' && (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: width(14),
            }}>
            <View style={{width: width(30)}}>
              <Button
                handlePressBtn={() => ModalVisibility(false)}
                btnFontSize={12}
                btnTitle={'No'}
                btnTextStyle={{
                  color: appColors.white,
                }}
                buttonContainer={{
                  backgroundColor: appColors.primaryColor,
                  borderColor: appColors.primaryColor,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: width(3),
                }}
              />
            </View>
            <View style={{width: width(30)}}>
              <Button
                handlePressBtn={() => {
                  if (handlePressOk) {
                    ModalVisibility(false);
                    handlePressOk();
                  } else {
                    ModalVisibility(false);
                  }
                }}
                btnFontSize={12}
                btnTitle={'Yes'}
                btnTextStyle={{
                  color: appColors.white,
                }}
                buttonContainer={{
                  backgroundColor: appColors.primaryColor,
                  borderColor: appColors.primaryColor,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: width(3),
                }}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
});

export default CommonAlert;
