import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { width } from 'react-native-dimension';
import {pickImageFromLibrary} from '../../../utills/imagePickerUtil';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { appIcons, appImages, fontFamily } from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import InputField from '../../../components/textInput';
import { appColors } from '../../../constants';
import { ReceivedMsg, senderMsg } from './SendMessage';
import { helper } from '../../../helper';
import Loader from '../../../components/loader';

const ChatWithAdmin = ({route}) => {
  const data = route.params;
  const {user} = useSelector(state => state.LoginSlice);
  const [msgValue, setMsgValue] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [viewImage, setViewImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [attachmentImage, setAttachmentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({tabBarStyle: {display: 'none'}});
    return () => {
      navigation.setOptions({tabBarStyle: {display: 'flex'}});
    };
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setAllMessages([]);
      try {
        const messagesRef = ref(
          getDatabase(),
          `messages/${user?.userDetails?._id}/6757326bc25e5799b56786a6`,
        );

        console.log(messagesRef, 'messagesRefmessagesRefmessagesRef');

        onValue(messagesRef, snapshot => {
          const data = snapshot.val();
          console.log(data, 'datadatadatadatadata');

          if (data) {
            let tempArr = [];
            Object.keys(data).forEach(key => {
              const item = data[key];
              tempArr.unshift({
                sendBy: item?.sender,
                ReceivedBy: item?.receiver,
                msg: item?.msg,
                img: item?.image,
                time: item?.time,
                isRead: item?.isRead || false,
                attachmentUrl: item.attachmentUrl,
              });
            });
            setAllMessages(tempArr);
          }
        });
      } catch (error) {
        console.log(error, 'errorrrrrrrrrrr');
      }
    }, [data]),
  );

  const handleImagePick = async () => {
    try {
      setIsLoading(true);
      const image = await pickImageFromLibrary();

      if (!image) {
        return;
      }

      const result = await helper.uploadImageToCloudinary(image);
      if (result) {
        setAttachmentImage(result);
        console.log(result);
      }
    } catch (error) {
      console.log('Image picker error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (msgValue) {
      setAttachmentImage(null);
      senderMsg({
        msgValue,
        currentUserId: user?.userDetails?._id,
        guestUserId: '6757326bc25e5799b56786a6',
        imagePath: attachmentImage,
      })
        .then(() => {
          setMsgValue('');
        })
        .catch(err => {
          console.log(err, 'Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
          setMsgValue('');
        });

      ReceivedMsg({
        msgValue,
        currentUserId: user?.userDetails?._id,
        guestUserId: '6757326bc25e5799b56786a6',
        imagePath: attachmentImage,
      })
        .then(() => {
          setMsgValue('');
        })
        .catch(err => {
          setMsgValue('');
        });
      // let parmas = {
      //   userId: user?.userDetails?._id,
      //   message: msgValue,
      // };

      // const response = await sendNotification(parmas);
      // console.log(response?.data, 'ITEMMMMMMMMMMMMMMMMMMMM');
      // if (response.status ===200 || response.status ==201) {

      // }
    }
  };

  const handlePressImage = image => {
    console.log(image, 'imageimageimage');

    setViewImage(image);
    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setViewImage(null);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <SafeAreaView style={styles.container}>
        <AppHeader
          height={width(25)}
          showExtraStuff={
            <View
              style={{
                height: width(20),
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  height: width(10),
                  width: width(10),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 100,
                }}>
                <Image
                  source={appIcons.goBackIcon}
                  resizeMode="contain"
                  style={{height: '50%', width: '50%'}}
                />
              </TouchableOpacity>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: width(12),
                    width: width(12),
                    borderRadius: width(100),
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={appImages.logo}
                    resizeMode="cover"
                    style={{height: '100%', width: '100%'}}
                  />
                </View>
                <Text
                  style={{
                    color: appColors.white,
                    fontFamily: fontFamily.poppinsBold,
                    fontSize: 16,
                    marginLeft: width(3),
                  }}>
                  ADMIN
                </Text>
              </View>
            </View>
          }
        />
        <FlatList
          inverted
          data={allMessages}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            let CurrentUser =
              item?.sendBy === user?.userDetails?._id ? true : false;
            return (
              <View
                style={[
                  styles.messageWrapper,
                  CurrentUser ? styles.selfWrapper : styles.otherWrapper,
                ]}>
                <View
                  style={[
                    styles.messageContainer,
                    CurrentUser ? styles.selfMessage : styles.otherMessage,
                  ]}>
                  {item.attachmentUrl && (
                    <TouchableOpacity
                      onPress={() => handlePressImage(item.attachmentUrl)}
                      style={{
                        height: width(50),
                        width: width(50),
                        marginHorizontal: width(3),
                      }}>
                      <Image
                        source={{uri: item.attachmentUrl}}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 10,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.messageText}>{item.msg}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: appColors.gray,
                      textAlign: 'right',
                    }}>
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.messagesList}
        />
        {attachmentImage !== null && (
          <View
            style={{
              width: width(35),
              height: width(35),
              marginLeft: width(5),
              marginBottom: width(2),
            }}>
            <TouchableOpacity
              onPress={() => setAttachmentImage(null)}
              style={{
                position: 'absolute',
                height: width(7),
                width: width(7),
                zIndex: 999,
                right: width(2),
                top: width(2),
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome name="close" size={20} color={'white'} />
            </TouchableOpacity>
            <Image
              source={{uri: attachmentImage}}
              style={{width: '100%', height: '100%', borderRadius: 15}}
            />
          </View>
        )}
        {data?.jobStatus !== 'Completed' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              backgroundColor: appColors.white,
              paddingVertical: width(3),
            }}>
            <View
              style={{
                width: width(12),
              }}>
              <TouchableOpacity
                onPress={handleImagePick}
                style={{
                  backgroundColor: appColors.spnishGray,
                  alignItems: 'center',
                  padding: width(3),
                  borderRadius: width(3),
                }}>
                <Image
                  source={appIcons.attachement}
                  style={{height: width(7), width: width(7)}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <InputField
              placeholder="Type something..."
              placeholderTextColor="#999"
              value={msgValue}
              onChangeText={text => setMsgValue(text)}
              borderRadius={width(4)}
              borderWidth={0.00001}
              InputContainerStyle={{
                width: width(70),
                backgroundColor: appColors.spnishGray,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.39,
                shadowRadius: 8.3,
                elevation: 13,
              }}
            />

            <View
              style={{
                width: width(12),
              }}>
              <TouchableOpacity
                onPress={handleSend}
                style={{
                  backgroundColor: appColors.primaryColor,
                  alignItems: 'center',
                  padding: width(3),
                  borderRadius: width(3),
                }}>
                <FontAwesome name="send" size={24} color={appColors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {data?.jobStatus == 'Completed' && (
          <View
            style={{
              height: width(15),
              alignItems: 'center',
              justifyContent: 'center',
              borderTopColor: appColors.gray,
              borderTopWidth: 1,
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.gray,
                textAlign: 'center',
              }}>
              This chat is no longer available. Start a new chat if needed.
            </Text>
          </View>
        )}
        {viewImage && (
          <Modal
            isVisible={modalVisible}
            style={styles.modalStyle}
            // backdropOpacity={type == 'filterShops' ? 0 : 0.6}
            onBackdropPress={onClose}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={onClose} style={{padding: width(5)}}>
                <FontAwesome name="close" size={20} color={'black'} />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={{uri: viewImage}}
                  resizeMode="contain"
                  style={{height: width(100), width: '100%'}}
                />
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: appColors.white,
  },
  messageWrapper: {
    flexDirection: 'row',
  },
  profileImage: {
    width: width(7),
    height: width(7),
    borderRadius: width(5),
    marginHorizontal: 5,
  },
  messageContainer: {
    maxWidth: '85%',
    padding: 10,
    borderRadius: 20,
    marginTop: width(7),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 10,
  },

  selfWrapper: {
    alignSelf: 'flex-end',
  },
  otherWrapper: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  selfMessage: {
    backgroundColor: '#E8F0FE',
  },
  otherMessage: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 12,
    color: '#333',
    fontFamily: fontFamily.poppinsRegular,
    padding: 10,
  },

  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#7A003C',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    flex: 1,
  },
  modalStyle: {
    flex: 1,
    margin: 0,
  },
});

export default ChatWithAdmin;
