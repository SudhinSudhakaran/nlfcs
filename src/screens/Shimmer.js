import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

const Shimmer = () => {
  const DefaultImageLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={290}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='5%' y='20' rx='0' ry='0' width='90%' height='260' />
    </ContentLoader>
  );
  const MemberInfoLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={600}
      marginTop={responsiveHeight(1)}
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='2%' y='20' rx='8' ry='8' width='97%' height='40' />
      <Rect x='2%' y='80' rx='8' ry='8' width='97%' height='40' />
      <Rect x='2%' y='140' rx='8' ry='8' width='97%' height='40' />
      <Rect x='2%' y='200' rx='8' ry='8' width='97%' height='40' />
      <Rect x='2%' y='260' rx='8' ry='8' width='97%' height='40' />
      <Rect x='2%' y='320' rx='8' ry='8' width='97%' height='40' />
      <Rect x='2%' y='380' rx='8' ry='8' width='97%' height='40' />
    </ContentLoader>
  );
  return (
    <View>
      <MemberInfoLoader />
      {/* <DefaultImageLoader/> */}
    </View>
  );
};

export default Shimmer;

const styles = StyleSheet.create({});
