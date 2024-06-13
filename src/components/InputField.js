import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState} from 'react';

import {Images, theme} from '../constants';
import {svg} from '../assets/svg';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const InputField = ({
  placeholder,
  containerStyle,
  secureTextEntry,
  keyboardType,
  checkIcon,
  eyeOffIcon = false,
  onChangeText,
  onClear,
  ref,
  userIcon,
  mailIcon,
  editable,
  keyIcon,
  dollarIcon,
  value,
  editIcon,
  onSubmitEditing,
  inputstyle,
  emailIcon,
  calendarIcon,
  mapPinIcon,
  hashIcon,
  briefcaseIcon,
  eyeButtonAction,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        backgroundColor: theme.colors.lightGrey,
        borderColor: focus ? theme.colors.mainDark : '#f5f5ef',
        paddingRight: eyeOffIcon ? 0 : checkIcon ? 0 : 10,
        ...inputstyle,
      }}
    >
      {briefcaseIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.BriefcaseSvg />
        </View>
      )}
      {mapPinIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.MapPinSvg />
        </View>
      )}
      {calendarIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.CalendarSvg />
        </View>
      )}
      {hashIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.HashSvg />
        </View>
      )}
      {emailIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.EmailSvg />
        </View>
      )}
      {editIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.EditSvg />
        </View>
      )}
      {dollarIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.DollarSignSvg />
        </View>
      )}
      {userIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.UserSvg />
        </View>
      )}
      {mailIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.MailSvg />
        </View>
      )}
      {keyIcon && (
        <View style={{width: 34, height: 34, marginRight: 14}}>
          <svg.KeySvg />
        </View>
      )}
      <TextInput
        keyboardType={keyboardType}
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize={'none'}
        autoComplete={'off'}
        returnKeyType={'next'}
        blurOnSubmit={false}
        placeholderTextColor={'#A7AFB7'}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onClear={onClear}
        ref={ref}
        editable={editable}
        value={value}
        allowFontScaling={false}
        onSubmitEditing={onSubmitEditing}
        style={{
          flex: 1,
          ...theme.fonts.SourceSansPro_Regular_16,
          lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
          color: theme.colors.bodyTextColor,
        }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
      />
      {eyeOffIcon && (
        <TouchableOpacity
          onPress={() => {
            eyeButtonAction(!secureTextEntry);
          }}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          {!secureTextEntry ? (
            <Image
              style={{
                width: responsiveWidth(4),
                height: responsiveHeight(2),
                tintColor: '#A7AFB7',
                resizeMode: 'contain',
                // position:'absolute'
              }}
              source={Images.EYE_ICON}
            />
          ) : (
            <svg.EyeOffSvg />
          )}
        </TouchableOpacity>
      )}
      {checkIcon && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <svg.CheckSvg />
        </View>
      )}
    </View>
  );
};

export default InputField;
