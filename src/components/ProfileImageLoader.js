import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

const ProfileImageLoader = () => {
//shimmer for profile image and name
  const DefaultImageLoader = () => (
    <ContentLoader
      speed={1.5}
      width={responsiveHeight(50)}
      height={responsiveHeight(10)}
      backgroundColor={'#D9D9D9'}
      foregroundColor={'#F6FFF8'}
      animate={true}
    >
      <Rect x='5' y='20' rx='20' ry='20' width='40' height='40' />
      <Rect x='60' y='30' rx='5' ry='5' width='80' height='20' />
    </ContentLoader>
  );
  return (
    <View>
      <DefaultImageLoader />
    </View>
  );
};

export default ProfileImageLoader;

const styles = StyleSheet.create({});
