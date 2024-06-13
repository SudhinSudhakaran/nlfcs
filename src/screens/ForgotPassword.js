import {Text} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {components} from '../components';
import {theme} from '../constants';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const ForgotPassword = ({navigation}) => {
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'Change password'}
        backstyle={{
          marginRight: responsiveHeight(3),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(20),
          marginTop: 18,
        }}
      />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.paddingTop_20,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          Please enter your email address. You will receive a link to create a
          new password via email.
        </Text>
        <components.InputField
          placeholder='brileyhenderson@mail.com'
          emailIcon={true}
          checkIcon={true}
          containerStyle={{marginBottom: theme.sizes.marginBottom_14}}
        />
        <components.Button
          title='Send'
          buttonstyle={{marginTop: responsiveHeight(3)}}
          onPress={() => navigation.navigate('NewPassword')}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default ForgotPassword;
