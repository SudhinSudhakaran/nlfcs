/**
    * Purpose:* Create Search InputField
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  I18nManager,
  Image,
  Platform,
} from 'react-native';
import React from 'react';
import Images from '../constants/Images';
import {theme} from '../constants';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const SearchBox = (props) => (
  <View
    style={{
      marginTop: responsiveHeight(2.1),
      marginLeft: 0,
      left: responsiveWidth(5),
      height: Platform.OS === 'ios' ? responsiveHeight(5) : undefined,
      width: '123%',
      borderRadius: 5,
      justifyContent: 'center',
      //Shadow props
      borderWidth: 0.1,
      borderColor: theme.colors.lightGrey,
      backgroundColor: theme.colors.lightGrey,
      shadowColor: 'yellow',
      shadowOffset: {
        width: 0,
        height: 4,
      },
    }}
  >
    <TextInput
      editable
      placeholderTextColor={theme.colors.bodyTextColor}
      placeholder={'Search Member Id'}
      onChangeText={(text) => props.searchFilterFunction(text.trimStart())}
      onClear={(text) => props.searchFilterFunction('')}
      value={props.search}
      keyboardType={'numeric'}
      allowFontScaling={false}
      style={{
        flex: 1,
        marginLeft: 16,
        marginRight: 50,
        ...theme.fonts.SourceSansPro_Regular_16,
        color: theme.colors.bodyTextColor,
      }}
    />
    {/* {props.search !== '' ? (
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          marginLeft: responsiveWidth(53),
          bottom: 1,
          position: 'absolute',
        }}
        onPress={() => props?.closeButtonAction()}
      >
        <Image
          style={{
            width: 20,
            height: 20,
            tintColor: theme.colors.textColor,
          }}
          source={Images.CLOSE_ICON}
        />
      </TouchableOpacity>
    ) : null} */}
  </View>
);

export default SearchBox;

const styles = StyleSheet.create({});
