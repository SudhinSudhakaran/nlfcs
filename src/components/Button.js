import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {theme} from '../constants';

const Button = ({
  title,
  onPress,
  buttonstyle,
  containerStyle,
  lightShade,
  textStyle,
}) => {
  return (
    <View style={{...containerStyle}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          width: '100%',
          height: 40,
          backgroundColor: lightShade
            ? theme.colors.mainDark
            : theme.colors.mainDark,
          ...buttonstyle,
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: lightShade ? theme.colors.white : theme.colors.white,
            // textTransform: 'capitalize',
            ...theme.fonts.SourceSansPro_SemiBold_16,
            ...textStyle,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
