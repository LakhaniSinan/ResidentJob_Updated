import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../../assets';
import AppHeader from '../../../components/appHeader';
import Button from '../../../components/button';
import FoodCard from '../../../components/foodCard';
import Loader from '../../../components/loader';
import { appColors } from '../../../constants';
import { fetchFood, onDeleteFood } from '../../../services/food';
import CommonAlert from '../../../components/commanAlert';

const AllFoodByCategory = ({ route }) => {
  const { item, user } = route?.params;
  const constants = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allFoods, setAllFoods] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      handleFetchFood();
    }, []),
  );

  const handleFetchFood = async () => {
    let params = {
      foodCategoryId: item?._id,
      providerId: user?.userDetails?._id,
    };
    try {
      setIsLoading(true);
      const response = await fetchFood(params);
      setIsLoading(false);
      if (response.status == 200 || response.status == 201) {
        setAllFoods(response?.data);
      } else {
        constants.current.isVisible({
          status: 'error',
          message: response?.data?.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('🚀 ~ handleFetchFood ~ error:', error);
    }
  };

  const handleEditFood = (item, index) => {
    navigation.navigate('AddCategoryFood', { ...item, type: 'edit', index });
  };
  const handleDeleteFood = (item, index) => {
    constants.current.isVisible({
      status: 'confirm',
      message: 'Are you sure you want to delete this food?',
      handlePressOk: async () => {
        try {
          setIsLoading(true);
          const response = await onDeleteFood(item?._id);
          setIsLoading(false);
          if ((response.status = 200 || response.status == 201)) {
            constants.current.isVisible({
              status: 'ok',
              message: response?.data?.message,
              handlePressOk: () => handleFetchFood(),
            });
          } else {
            constants.current.isVisible({
              status: 'ok',
              message: response?.data?.message,
            });
          }
        } catch (error) {
          setIsLoading(false);
          console.log(error, 'errorerrorerror');
        }
      },
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <FoodCard
        key={index}
        item={item}
        index={index}
        foodCardType={'jobSeeker'}
        handleEditFood={handleEditFood}
        handleDeleteFood={handleDeleteFood}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.white }}>
      <AppHeader height={width(20)} showBackBtn={true} />
      <FlatList
        ListHeaderComponent={
          <Text
            style={{
              fontFamily: fontFamily.poppinsBold,
              color: appColors.black,
              margin: width(4),
              fontSize: 28,
            }}>
            {item?.name}
          </Text>
        }
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                margin: width(3),
                fontSize: 16,
              }}>
              No Food Found!
            </Text>
          </View>
        }
        data={allFoods}
        renderItem={renderItem}
      />
      <View
        style={{
          height: width(12),
          width: width(25),
          position: 'absolute',
          bottom: 10,
          right: 10,
        }}>
        <Button
          handlePressBtn={() =>
            navigation.navigate('AddCategoryFood', { type: 'add', ...item })
          }
          btnFontSize={12}
          btnTitle={'Add Item'}
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
      <Loader isLoading={isLoading} />
      <CommonAlert ref={constants} />
    </SafeAreaView>
  );
};

export default AllFoodByCategory;
