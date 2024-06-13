import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {theme} from '../../constants';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const EmptySchedules = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Schedules</Text>
    </View>
  );
};

export default EmptySchedules;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(20),
  },
  text: {
    alignSelf: 'center',
    ...theme.fonts.SourceSansPro_Regular_14,
    lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
    color: theme.colors.mainDark,
    fontSize:20,
  },
});