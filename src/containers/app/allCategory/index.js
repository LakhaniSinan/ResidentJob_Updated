import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { width } from 'react-native-dimension';
import { fontFamily } from '../../../assets';
import AppHeader from '../../../components/appHeader';
import CategoryCard from '../../../components/categoryCard';
import CommonAlert from '../../../components/commanAlert';
import Loader from '../../../components/loader';
import { appColors } from '../../../constants';
import { GetCategory } from '../../../services/authentication';

const AllCategory = () => {
  const constants = useRef(null);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    handleFetchAllCategories();
    
  }, []);

  const handleFetchAllCategories = async () => {
    try {
      setIsLoading(true);
      const response = await GetCategory();
      setIsLoading(false);
      if (response.status == 200 || response.status == 201) {
        setCategories(response.data.data);
      } else {
        constants.current.isVisible({
          status: 'error',
          message: response.data.message,
        });
      }
    } catch (error) {
      console.log(error, 'errorerrorerrorerror');
      setIsLoading(false);
    }
  };
  const handleClickCategory = item => {
    navigation.navigate('CategoryDetails', item);
  };
  return (
    <SafeAreaView>
      <AppHeader
        height={width(20)}
        showBackBtn={true}
      // showExtraStuff={
      //   <SearchBar
      //     placeholder="Search"
      //     value={searchText}
      //     placeholderTextColor={appColors.gray}
      //     onChangeText={value => setSearchText(value)}
      //   />
      // }
      />
      <FlatList
        data={categories}
        numColumns={4}
        ListHeaderComponent={
          <View style={{ padding: width(4) }}>
            <Text
              style={{
                fontFamily: fontFamily.poppinsSemiBold,
                color: appColors.black,
                fontSize: 30,
              }}>
              All Categories
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          return (
            <CategoryCard
              item={item}
              index={index}
              handleClickCategory={handleClickCategory}
            />
          );
        }}
        ListFooterComponent={<View style={{ height: width(50) }} />}
      />
      <CommonAlert ref={constants} />
      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default AllCategory;
