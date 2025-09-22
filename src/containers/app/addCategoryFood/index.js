import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import AntDesign from '@react-native-vector-icons/ant-design';
import {fontFamily} from '../../../assets';
import AuthHeader from '../../../components/authHeader';
import Button from '../../../components/button';
import Loader from '../../../components/loader';
import InputField from '../../../components/textInput';
import {appColors} from '../../../constants';
import {addFood, updateFood} from '../../../services/food';
import {uploadImageToCloudinary} from '../../../utills/globalFunctions';
import {useSelector} from 'react-redux';

const AddCategoryFood = ({route}) => {
  const state = route.params;
  console.log(state, 'statestatestatestate');
  const constants = useRef(null);

  const [loading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {user} = useSelector(state => state.LoginSlice);
  const [inputVall, setInputVall] = useState({
    foodName: '',
    description: '',
    images: [],
  });

  useEffect(() => {
    if (state.type !== 'add') {
      setInputVall({
        foodName: state?.name || '',
        description: state?.description || '',
        images: state?.images != undefined ? state?.images : [],
      });
    }
  }, []);

  const handleChange = (name, value) => {
    setInputVall(prev => ({...prev, [name]: value}));
  };

  const handleRemoveImage = index => {
    setInputVall(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const chooseImage = async () => {
    if (inputVall.images.length >= 4) {
      alert('Maximum 4 images allowed');
      return;
    }
    try {
      let image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        freeStyleCropEnabled: true,
        cropping: true,
        width: 500,
        height: 500,
      });
      setIsLoading(true);
      let response = await uploadImageToCloudinary(image);
      setIsLoading(false);
      if (response !== 'error') {
        setInputVall(prev => ({...prev, images: [...prev.images, response]}));
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Image Picker Error:', error);
    }
  };

  const validateFields = () => {
    return (
      inputVall.foodName && inputVall.description && inputVall.images.length > 0
    );
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      constants.current.isVisible({
        status: 'error',
        message: 'All fields are required',
      });
      return;
    }
    try {
      let params = {
        name: inputVall.foodName,
        description: inputVall.description,
        images: inputVall.images,
        providerId: user?.userDetails?._id,
        foodCategoryId: state?._id,
      };
      let updateParams = {
        name: inputVall.foodName,
        description: inputVall.description,
        images: inputVall.images,
      };
      setIsLoading(true);
      const response =
        state?.type !== 'add'
          ? await updateFood(state?._id, updateParams)
          : await addFood(params);

      setIsLoading(false);
      if (response.status === 200) {
        constants.current.isVisible({
          status: 'ok',
          message: 'Food Added Successfully',
          handlePressOk: () => {
            navigation.goBack();
            constants.current.backdropPress();
          },
        });
      } else {
        constants.current.isVisible({
          status: 'error',
          message: 'Failed to add food',
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('🚀 ~ handleSubmit ~ error:', error);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <AuthHeader showGoBack={true} />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <InputField
            InputLable="Food Name"
            placeholder="Enter Food Name"
            placeholderTextColor={appColors.gray}
            value={inputVall.foodName}
            onChangeText={value => handleChange('foodName', value)}
          />

          <InputField
            InputLable="Food Description"
            placeholder="Enter Food Description"
            placeholderTextColor={appColors.gray}
            multiline={true}
            borderRadius={width(6)}
            value={inputVall.description}
            onChangeText={value => handleChange('description', value)}
          />

          <Text style={styles.label}>Upload Images</Text>

          <View style={styles.imageContainer}>
            {inputVall.images?.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <FastImage
                  source={{uri: img}}
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleRemoveImage(index)}>
                  <AntDesign name="delete" size={20} color={appColors.red} />
                </TouchableOpacity>
              </View>
            ))}
            {inputVall.images?.length < 4 && (
              <TouchableOpacity style={styles.uploadBtn} onPress={chooseImage}>
                <AntDesign name="plus" size={24} color={appColors.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Button
          handlePressBtn={handleSubmit}
          btnFontSize={12}
          btnTitle="Submit"
          btnTextStyle={{color: appColors.white}}
          buttonContainer={{
            backgroundColor: appColors.primaryColor,
            borderColor: appColors.primaryColor,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: width(3),
          }}
        />
      </View>
    </>
  );
};

export default AddCategoryFood;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    marginVertical: width(3),
    color: appColors.black,
    fontFamily: fontFamily.ManropeRegular,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  uploadBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: appColors.white,
    borderRadius: 12,
    padding: 4,
    elevation: 4,
  },
});
