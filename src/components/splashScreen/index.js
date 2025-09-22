import {Image, View} from 'react-native';

function CustomSplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/images/launch_screen.jpg')}
        resizeMode="cover"
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
}

export default CustomSplashScreen;
