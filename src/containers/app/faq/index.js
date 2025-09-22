import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {width} from 'react-native-dimension';
import Entypo from '@react-native-vector-icons/entypo';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useSelector} from 'react-redux';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import {appColors} from '../../../constants';
import {fetchFAQ} from '../../../services/faq';

const FaqScreen = () => {
  const [activeSections, setActiveSections] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {user} = useSelector(state => state.LoginSlice);

  useEffect(() => {
    getFaqs();
  }, [user]);

  const getFaqs = () => {
    if (user) {
      setLoading(true);
      fetchFAQ(user.role)
        .then(response => {
          setLoading(false);
          if (response && response.status === 200) {
            setFaqs(response.data.data);
          } else {
            setError('Failed to load FAQs');
          }
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching FAQs:', error);
          setError('Something went wrong. Please try again.');
        });
    }
  };
  const _renderHeader = (section, _, isActive) => {
    return (
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.headerText}>
          {section.question}
        </Text>
        {isActive ? (
          <Entypo name={'cross'} size={20} color={appColors.black} />
        ) : (
          <MaterialIcons
            name={'keyboard-arrow-down'}
            size={20}
            color={appColors.black}
          />
        )}
      </View>
    );
  };

  const _renderContent = section => (
    <View style={styles.content}>
      <Text style={{color: appColors.black}}>{section.answer}</Text>
    </View>
  );

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        height={width(20)}
        heading={'FAQ'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.goBackIcon}
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={appColors.black}
              style={styles.loader}
            />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Accordion
              sections={faqs}
              activeSections={activeSections}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
              containerStyle={{marginVertical: width(2)}}
              underlayColor={appColors.white}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FaqScreen;

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.poppinsSemiBold,
    color: appColors.black,
    fontSize: 30,
  },
  container: {
    padding: width(3),
  },
  loader: {
    marginTop: width(10),
    alignSelf: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontFamily: fontFamily.poppinsRegular,
    fontSize: 16,
    marginTop: width(10),
  },
  header: {
    backgroundColor: appColors.white,
    padding: 10,
    borderWidth: 1,
    borderColor: appColors.black,
    marginVertical: 5,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: appColors.gray,
    fontFamily: fontFamily.poppinsRegular,
    width: width(80),
    paddingHorizontal: width(2),
  },
  content: {
    padding: 10,
    backgroundColor: appColors.grayShadow,
    borderRadius: 5,
  },
});
