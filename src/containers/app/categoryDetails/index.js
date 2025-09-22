import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, SafeAreaView, Text, View} from 'react-native';
import {width} from 'react-native-dimension';
import {useSelector} from 'react-redux';
import {fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import SearchBar from '../../../components/searchBar';
import TeamCard from '../../../components/teamCard';
import {appColors} from '../../../constants';
import {fetchProvidersByCate} from '../../../services/authentication';
import Loader from '../../../components/loader';

const CategoryDetails = ({route}) => {
  const navigation = useNavigation();
  const state = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector(state => state.LoginSlice);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    handleFetchProvidersByCate();
  }, []);

  const handleFetchProvidersByCate = async () => {
    try {
      setIsLoading(true);
      const response = await fetchProvidersByCate(state?._id);
      setIsLoading(false);
      if (response.status === 200 || response.status === 201) {
        setCategories(response.data.data);
        setFilteredData(response.data.data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error, 'Error fetching categories');
      setIsLoading(false);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(categories);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = categories.filter(
        item =>
          item?.fullname?.toLowerCase().includes(lowerQuery) ||
          item?.location?.toLowerCase().includes(lowerQuery),
      );
      setFilteredData(filtered);
    }
  };

  const renderCategory = ({item, index}) => {
    return (
      <TeamCard
        type={'home'}
        item={item}
        index={index}
        handleClickCategory={handleClickCategory}
      />
    );
  };

  const handleClickCategory = item => {
    navigation.navigate('ChefProfiles', item);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <Loader isLoading={isLoading} />
      <AppHeader
        height={width(40)}
        showBackBtn={true}
        showExtraStuff={
          <SearchBar
            placeholder="Search by name or address"
            placeholderTextColor={appColors.gray}
            onChangeText={handleSearch}
            value={searchQuery}
          />
        }
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCategory}
        ListHeaderComponent={
          state?.type !== 'topService' && (
            <View style={{padding: width(3)}}>
              <View
                style={{
                  height: width(30),
                  width: width(30),
                  borderRadius: 100,
                  overflow: 'hidden',
                }}>
                <Image
                  source={{uri: state?.image}}
                  resizeMode="contain"
                  style={{height: '100%', width: '100%'}}
                />
              </View>
              <Text
                style={{
                  fontFamily: fontFamily.poppinsBold,
                  color: appColors.black,
                  fontSize: 28,
                  paddingHorizontal: width(3),
                }}>
                {state?.name}
              </Text>
            </View>
          )
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
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
                fontSize: 16,
              }}>
              No Provider Found!
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CategoryDetails;
