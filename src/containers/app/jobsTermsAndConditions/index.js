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

const JobsTermsAndConditions = () => {
  const {width: screenWidth} = useWindowDimensions();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      fetchPrivacyPolicy();
    }, []),
  );

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const res = await getSettings();

      if (res.status === 200) {
        setHtmlContent(res.data.data.termsOfJob);
      }
    } catch (error) {
      console.error('Failed to fetch Jobs Terms and Conditions', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: appColors.white}}>
      <AppHeader
        height={width(20)}
        heading={'Jobs Terms and Conditions'}
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
              contentWidth={screenWidth - width(6)}
              source={{html: htmlContent || '<p>No content available.</p>'}}
              baseStyle={{
                color: appColors.black,
                fontFamily: fontFamily.poppinsRegular,
                fontSize: 15,
                lineHeight: 24,
              }}
              tagsStyles={{
                p: {
                  marginTop: 0,
                  marginBottom: 12,
                  fontFamily: fontFamily.poppinsRegular,
                  color: appColors.black,
                },
                strong: {
                  fontFamily: fontFamily.poppinsBold,
                  fontWeight: '700',
                  color: appColors.black,
                },
                ul: {
                  marginTop: 4,
                  marginBottom: 12,
                  paddingLeft: 20,
                },
                li: {
                  marginBottom: 6,
                  fontFamily: fontFamily.poppinsRegular,
                  color: appColors.black,
                },
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobsTermsAndConditions;
