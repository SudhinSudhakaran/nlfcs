/**
    * Purpose:* Create memberInfo screen
              * Add Member Details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, StatusBar} from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';

import {components} from '../components';
import {Globals, theme} from '../constants';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  setUserDetails,
  setMemberLoading,
  setShareDetails,
} from '../store/userSlice';
import APIConnections from '../helpers/apiManager/APIConnections';
import DataManager from '../helpers/apiManager/DataManager';
import Utilities from '../helpers/utils/Utilities';
import StorageManager from '../helpers/storageManager/StorageManager';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Shimmer from './Shimmer';
import {BackHandler} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import {Keyboard} from 'react-native';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import BottomBar from './BottomBar';
import {Image} from 'react-native';

const MemberInfo = ({navigation}) => {
  //Redux states
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const memberLoading = useSelector((state) => state.userDetails.memberLoading);
  const shareDetails = useSelector((state) => state.userDetails.shareDetails);

  const [link, setLink] = useState(
    'https://www.pixelnpercentage.in/bankapp/profile',
  );
  const [isLoading, setIsLoading] = useState(true);
  useFocusEffect(
    React.useCallback(() => {
      getUserDetails();
    }, []),
  );
  //Backbutton action in phone
  useEffect(() => {
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

  /**
   * Purpose: Get userDetail
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 12 Jun 2023
   * Steps:
     1.fetch user details from API and append to state variable
*/

  const getUserDetails = () => {
    dispatch(setMemberLoading(true));
    var formdata = new FormData();
    DataManager.getUserDetails(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true && data.status !== 'Token is Invalid') {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          console.log('data====', data);
          data?.share?.map((item) => {
            item = item;
            dispatch(setShareDetails(item));
          });
          StorageManager.saveUserDetails(data.user);
          Globals.USER_DETAILS = data.user;
          dispatch(setUserDetails(data.user));
          setTimeout(() => {
            dispatch(setMemberLoading(false));
          }, 1000);
        } else {
          /** If token expired displayed alert
           * When click Yes button go to the performSessionExpired functon
           */
          Alert.alert(
            'Please Login',
            'Session expired',
            [{text: 'Yes', onPress: () => performSessionExpired()}],
            {cancelable: false},
          );
          setTimeout(() => {
            dispatch(setMemberLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast('Failed', data?.status, 'error', 'bottom');
        setTimeout(() => {
          dispatch(setMemberLoading(false));
        }, 1000);
      }
    });
  };
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   *1. Cleared User details,autherization,email,token from storage
   *2. Navigate to SignIn
   */
  const performSessionExpired = () => {
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
  /**Header Component
   *Displayed back button and title
   */
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title='Member Info'
        backstyle={{
          marginRight: responsiveHeight(10),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(17),
          marginTop: 18,
          color: theme.colors.white,
        }}
        containerStyle={{
          backgroundColor: theme.colors.mainDark,
        }}
      />
    );
  };

  /** Purpose: Showing Member Details
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   */
  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          marginTop: responsiveHeight(0),
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        {memberLoading === true ? (
          <Shimmer />
        ) : (
          <>
            <View
              style={{
                backgroundColor: theme.colors.mainDark,
                height: responsiveHeight(40),
              }}
            >
              <Image
                style={{
                  alignSelf: 'center',
                  width: responsiveHeight(20),
                  borderRadius: 160,
                  height: responsiveHeight(20),
                  marginTop: responsiveHeight(4),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                source={{
                  uri: 'http://' + userDetails?.profile_picture,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                bottom: responsiveHeight(8),
                backgroundColor: theme.colors.white,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
              }}
            >
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: responsiveHeight(2),
                  marginLeft: responsiveHeight(2),
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_18,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(3),
                    fontWeight: 700,
                  }}
                >
                  Personal Details :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                    fontWeight: 700,
                  }}
                >
                  Name
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Account Number
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Email
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Phone
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Dob
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Age
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Martial Status
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Race
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Occupation
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_18,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(3),
                    fontWeight: 700,
                  }}
                >
                  Family :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                    fontWeight: 700,
                  }}
                >
                  Spouse Name
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Spouse Identity Number
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Childrens
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_18,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(3),
                    fontWeight: 700,
                  }}
                >
                  Witness :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                    fontWeight: 700,
                  }}
                >
                  Witness Name
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    fontWeight: 700,
                  }}
                >
                  Witness Membership No
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: responsiveHeight(3),
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    textTransform: 'capitalize',
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(3),
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(3),
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  :
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: responsiveHeight(3),
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                    textTransform: 'capitalize',
                  }}
                >
                  {''} {userDetails?.name || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.account_number || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.email || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''}{' '}
                  {userDetails?.phone
                    ? '+' +
                        '' +
                        userDetails?.country_code +
                        '-' +
                        userDetails?.phone || 'Null'
                    : null}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.dob || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.age || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.martial_status || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.race || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.occupation || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(3),
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                  }}
                >
                  {''} {userDetails?.spouse_name || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.spouse_identity_number || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.childrens || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(3),
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(2),
                  }}
                >
                  {''} {userDetails?.witness_name || 'Null'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.2,
                    color: theme.colors.bodyTextColor,
                    marginTop: responsiveHeight(1),
                  }}
                >
                  {''} {userDetails?.witness_membership_no || 'Null'}
                </Text>
              </View>
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    );
  };
  return (
    <components.SafeAreaView>
      <StatusBar
        backgroundColor={theme.colors.mainDark}
        barStyle='light-content'
      />
      <ScrollView
        style={{
          height: responsiveHeight(75),
        }}
      >
        {renderHeader()}
        {userDetails?.status !== 'Token is Invalid' && userDetails !== undefined
          ? renderContent()
          : null}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};

export default MemberInfo;
