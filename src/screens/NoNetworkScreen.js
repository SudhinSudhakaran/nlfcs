import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Globals, theme} from '../constants';
import Images from '../constants/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const NoNetworkScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <Image
        source={Images.NO_SIGNAL}
        style={{
          width: responsiveWidth(40),
          height: responsiveHeight(20),
          tintColor: theme.colors.newPrimaryColor,
        }}
      />
      <Text
        style={{
          fontSize: responsiveFontSize(3),
          color: theme.colors.newPrimaryColor,
          marginTop: responsiveHeight(5),
          fontFamily:'RobotoSlab-Regular'
          
        }}
      >
        No network connection
      </Text>
    </View>
  );
};

export default NoNetworkScreen;

const styles = StyleSheet.create({});
