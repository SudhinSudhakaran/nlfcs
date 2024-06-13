import {View, ActivityIndicator} from 'react-native';
import React from 'react';

import {theme} from '../constants';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        // position: 'absolute',
        marginTop: responsiveHeight(10),
        width: '100%',
        height: '100%',
      }}
    >
      <ActivityIndicator size='large' color={theme.colors.mainDark} />
    </View>
  );
};

export default Loader;
