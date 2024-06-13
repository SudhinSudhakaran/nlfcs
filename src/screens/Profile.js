import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  BackHandler,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';

import {components} from '../components';
import {Globals, Images, theme} from '../constants';
import {svg} from '../assets/svg';
import EditPersonalInfo from './EditPersonalInfo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import StorageManager from '../helpers/storageManager/StorageManager';
import {useSelector, useDispatch} from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import {GetImage} from './GetImage';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import APIConnections from '../helpers/apiManager/APIConnections';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import DataManager from '../helpers/apiManager/DataManager';
import {setMemberLoading, setUserDetails} from '../store/userSlice';
import Utilities from '../helpers/utils/Utilities';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import BottomBar from './BottomBar';

const Profile = ({navigation}) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const [link, setLink] = useState(
    'https://www.pixelnpercentage.in/bankapp/profile',
  );
  const [showAlert, setShowAlert] = useState(false);
  const memberLoading = useSelector((state) => state.userDetails.memberLoading);
  //Backbutton action in phone
  useEffect(() => {
    console.log('userDetails in profile', userDetails);
    dispatch(setMemberLoading(true));
    if (userDetails !== null || userDetails !== undefined) {
      setTimeout(() => {
        dispatch(setMemberLoading(false));
      }, 1000);
    }
    const handleBackButton = () => {
      backButtonAction();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      // Clean up
      backHandler.remove();
    };
  }, []);
  const backButtonAction = () => {
    navigation.goBack();
  };
  const DefaultImageLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={400}
      alignSelf={'center'}
      marginTop={responsiveHeight(1)}
      marginLeft={responsiveWidth(1)}
      // marginTop={theme.sizes.marginBottom_20}
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='60' y='0' rx='170' ry='170' width='270' height='270' />
      <Rect x='120' y='280' rx='0' ry='0' width='150' height='20' />
    </ContentLoader>
  );
  //confirm alert action
  const performLogout = () => {
    console.log('888', userDetails);
    Globals.USER_DETAILS = {};
    Globals.IS_AUTHORIZED = false;
    Globals.TOKEN = '';
    Globals.USER_EMAIL = '';
    dispatch(setIsAuthorized(false));
    dispatch(setSecretKey(''));
    dispatch(setUserDetails(''));
    StorageManager.clearUserRelatedData();
    Keyboard.dismiss();
    //Navigate to SignIn
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };

  //logout button action
  const logoutAction = async () => {
    Alert.alert(
      'Log out',
      'Do you want to logout the app?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            YesAction();
          },
        },
      ],
      {cancelable: false},
    );
    return true;
  };
  const YesAction = () => {
    Globals.USER_DETAILS = {};
    Globals.IS_AUTHORIZED = false;
    Globals.TOKEN = '';
    Globals.USER_EMAIL = '';
    dispatch(setIsAuthorized(false));
    dispatch(setSecretKey(''));
    dispatch(setUserDetails(''));
    StorageManager.clearUserRelatedData();
    Keyboard.dismiss();
    //Navigate to SignIn
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };
  //when click logout alert open
  const showLogoutConfirmationAlert = () => {
    setShowAlert(true);
  };

  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title='Profile'
        titleStyle={{
          position: 'absolute',
          left: responsiveWidth(22),
          marginLeft: responsiveWidth(20),
        }}
        backstyle={{marginRight: responsiveWidth(70)}}
      />
    );
  };
  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: theme.sizes.paddingBottom_20,
          marginTop: theme.sizes.marginTop_10,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={'Please Confirm'}
          titleStyle={{
            color: 'black',
            fontSize: 18,
          }}
          message={'Are you sure you want to logout ?'}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          animatedValue={0.8}
          cancelText={'Cancel'}
          confirmText={'Confirm'}
          confirmButtonColor={theme.colors.white}
          cancelButtonColor={theme.colors.white}
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            performLogout();
          }}
          cancelButtonStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderColor: theme.colors.mainDark,
            borderWidth: 1,
          }}
          confirmButtonStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            borderColor: theme.colors.mainDark,
            borderWidth: 1,
          }}
          actionContainerStyle={{
            width: '100%',
          }}
          cancelButtonTextStyle={{
            color: theme.colors.textColor,
            fontSize: 13,
          }}
          confirmButtonTextStyle={{
            color: theme.colors.textColor,
            fontSize: 13,
          }}
          messageStyle={{
            textAlign: 'left',
            color: 'black',
            fontSize: 15,
          }}
        />
        {/* {memberLoading === true ? (
          <DefaultImageLoader />
        ) : ( */}
          <>
            <View
              style={{
                marginBottom: theme.sizes.marginBottom_30,
              }}
            >
              {userDetails?.profile_picture !== undefined ||
              userDetails?.profile_picture !== null ? (
                <Image
                  style={{
                    alignSelf: 'center',
                    width: responsiveHeight(35),
                    borderRadius: 160,
                    height: responsiveHeight(35),
                    marginTop: theme.sizes.marginBottom_20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  source={{
                    uri: 'http://' + userDetails?.profile_picture,
                  }}
                />
              ) : (
                <Image
                  style={{
                    alignSelf: 'center',
                    width: responsiveHeight(35),
                    height: responsiveHeight(35),
                    marginTop: theme.sizes.marginBottom_20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  source={Images.DEFAULT_PROFILE_IMAGE}
                />
              )}
              <Text
                style={{
                  ...theme.fonts.SourceSansPro_Regular_16,
                  lineHeight:
                    theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                  color: theme.colors.bodyTextColor,
                  marginTop: theme.sizes.marginBottom_12,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {userDetails?.name
                  ?.split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ') ||
                  Globals?.USER_DETAILS?.name
                    ?.split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
              </Text>
            </View>
            <View style={{alignSelf: 'center'}}>
              <components.Button
                title='Change Password'
                lightShade={true}
                buttonstyle={{width: responsiveWidth(45)}}
                containerStyle={{padding: 0, alignItems: 'center'}}
                onPress={() => {
                  navigation.navigate('NewPassword', {isFromOTP: false});
                }}
              />
            </View>
            <components.Button
              title='Log out'
              lightShade={true}
              containerStyle={{padding: 20, alignSelf: 'center'}}
              buttonstyle={{width: responsiveWidth(45)}}
              onPress={() => {
                logoutAction();
              }}
            />
          </>
        {/* )} */}
      </KeyboardAwareScrollView>
    );
  };
  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(73)}}>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
      {userDetails?.user_type === 'customer' && (
        <BottomBar style={{marginTop: responsiveHeight(0)}} />
      )}
    </components.SafeAreaView>
  );
};

export default Profile;
