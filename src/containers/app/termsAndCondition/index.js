import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {width} from 'react-native-dimension';
import RenderHTML from 'react-native-render-html';
import {appIcons, fontFamily} from '../../../assets';
import AppHeader from '../../../components/appHeader';
import {appColors} from '../../../constants';
import {getSettings} from '../../../services/setting';

const TermsAndCondition = () => {
  const {width: screenWidth} = useWindowDimensions();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      fetchTerms();
    }, []),
  );

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const res = await getSettings();

      if (res.status === 200) {
        setHtmlContent(res.data.data.termsAndCondition);
      }
    } catch (error) {
      console.error('Failed to fetch Terms & Conditions', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        height={width(20)}
        heading={'Terms & Conditions'}
        headingColor={appColors.white}
        leftIconStyle={{height: 27, width: 27}}
        leftIcon={appIcons.goBackIcon}
      />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: appColors.white,
        }}>
        <View style={{paddingHorizontal: width(3), paddingVertical: width(5)}}>
          {loading ? (
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: appColors.black,
                  fontFamily: fontFamily.poppinsBold,
                }}>
                Loading...
              </Text>
            </View>
          ) : (
            <RenderHTML
              contentWidth={screenWidth}
              source={{html: htmlContent}}
              baseStyle={{
                color: appColors.black,
                fontFamily: fontFamily.poppinsBold,
                fontSize: 16,
                lineHeight: 22,
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndCondition;
