import React from 'react';
import {ActivityIndicator} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {appColors} from '../../constants/Theme';

const Loader = ({isLoading, showContent}) => {
  return (
    <Spinner
      visible={isLoading}
      customIndicator={<ActivityIndicator color={'#BC6C25'} size="large" />}
      textContent={showContent}
    />
  );
};

export default Loader;
