import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';

import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import {components} from '../components';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setUserDetails} from '../store/userSlice';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';

import Utilities from '../helpers/utils/Utilities';
import {
  setNotificationDetails,
  setNotificationLoading,
  setNotificationUnReadCount,
} from '../store/notificationSlice';
import DataManager from '../helpers/apiManager/DataManager';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

import moment from 'moment';
import BottomBar from './BottomBar';

const notifications = [
  {
    id: 1,
    title: 'Your loan application has been approved!',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 2,
    title: 'The loan repayment period expires!',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    status: 'alert',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 3,
    title: 'Your loan application was rejected!',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    status: 'rejected',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 4,
    title: 'Your piggy bank is full!',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
];

const DashboardNotification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const notificationDetails = useSelector(
    (state) => state.notificationDetails.notificationDetails,
  );
  const notificationLoading = useSelector(
    (state) => state.notificationDetails.notificationLoading,
  );
  const notificationUnReadCount = useSelector(
    (state) => state.notificationDetails.notificationUnReadCount,
  );
  const userDetails = useSelector((state) => state.userDetails.userDetails);
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
    //navigate to back
    navigation.goBack();
  };
  useEffect(() => {
    getNotification();
  }, []);

  /**
 * Purpose: Get Notifications
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 27 Jun 2023
 * Steps:
   1.fetch Announcements details from API and append to state variable
*/
  const getNotification = () => {
    setTimeout(() => {
      dispatch(setNotificationLoading(true));
    }, 1000);
    var formdata = new FormData();
    DataManager.getNotifications(formdata).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true && data?.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data.status !== 'Token is Expired'
          ) {
            dispatch(setNotificationDetails(data));
            setTimeout(() => {
              dispatch(setNotificationLoading(false));
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
              dispatch(setNotificationLoading(false));
            }, 1000);
          }
        } else {
          Utilities.showToast('Failed', data.status, 'error', 'bottom');
          setTimeout(() => {
            dispatch(setNotificationLoading(false));
          }, 1000);
        }
      },
    );
  };
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 27-06-2023
   * Steps:
   *1. Cleared User details,autherization,token,secret key from storage
   *2. Navigate to SignIn
   */
  const performSessionExpired = () => {
    dispatch(setIsAuthorized(false));
    dispatch(setUserDetails(''));
    StorageManager.clearUserRelatedData();
    Keyboard.dismiss();
    //Navigate to SignIn
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };
  /**
   * Purpose: Perform Read Notifications
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 4 July 2023
   */
  const PerformReadNotification = () => {
    var formdata = new FormData();
    DataManager.PerformReadNotification(formdata).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true && data?.status !== 'Token is Invalid') {
          // Utilities.showToast(
          //   'Success',
          //   data?.data?.success,
          //   'success',
          //   'bottom',
          // );
          getNotification();
        } else {
          // Utilities.showToast(
          //   'Failed',
          //   data?.data?.success,
          //   'Failed',
          //   'bottom',
          // );
        }
      },
    );
  };
  //shimmer for Notification list
  const NotificationLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={400}
      marginTop={responsiveHeight(1)}
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='5%' y='20' rx='5' ry='5' width='90%' height='60' />
      <Rect x='5%' y='90' rx='5' ry='5' width='90%' height='60' />
      <Rect x='5%' y='160' rx='5' ry='5' width='90%' height='60' />
    </ContentLoader>
  );
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'Notifications'}
        backstyle={{
          marginRight: responsiveHeight(3),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(25),
          marginTop: 18,
        }}
      />
    );
  };
  const readFunction = (id) => {
    Globals.READ_NOTIFICATION_ID = id;
    PerformReadNotification();
  };
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          marginTop: responsiveHeight(1),
          paddingBottom: theme.sizes.paddingBottom_10,
        }}
      >
        {notificationDetails?.map((item, index, array) => {
          var id = item?.id;
          const last = array.length - 1 === index;
          var date = moment(item?.created_at).format('Y-MM-DD');
          var time = moment(item?.created_at).format('hh:mm a');
          // var data = JSON.parse(item?.data);
          return (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: 
                  item?.read_at === null
                    ? theme.colors.lightGrey
                    : theme.colors.white,
                marginBottom: last ? 0 : 10,
                paddingHorizontal: 20,
                marginTop: responsiveHeight(1),
                borderRadius: 10,
              }}
              onPress={() => {
                item?.read_at === null ? readFunction(id) : null;
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                {item.status === 'completed' && (
                  <View style={{marginRight: 8}}>
                    <svg.CompletedNoticeSvg />
                  </View>
                )}
                {item.status === 'alert' && (
                  <View style={{marginRight: 8}}>
                    <svg.AlertSvg />
                  </View>
                )}
                {item.status === 'rejected' && (
                  <View style={{marginRight: 8}}>
                    <svg.RejectedSvg />
                  </View>
                )}
                {/* <Text
                  style={{
                    ...theme.fonts.SourceSansPro_Regular_16,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
                    color: theme.colors.mainDark,
                  }}
                  numberOfLines={1}
                >
                  {item?.data||''}
                </Text> */}
              </View>
              <Text
                style={{
                  marginBottom: 14,
                  ...theme.fonts.SourceSansPro_Regular_16,
                  lineHeight:
                    theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                  color: theme.colors.bodyTextColor,
                }}
              >
                {item?.data?.message}
              </Text>
              <Text
                style={{
                  ...theme.fonts.SourceSansPro_Regular_12,
                  lineHeight:
                    theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                  color: theme.colors.bodyTextColor,
                }}
              >
                {date + ' at ' + time || ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(75)}}>
        {renderHeader()}
        {notificationDetails?.status !== 'Permission denied !' ? (
          renderContent()
        ) : (
          <View
            style={{
             
              alignItems: 'center',
              justifyContent: 'center',
              height: responsiveHeight(70),
              width: responsiveWidth(90),
            }}
          >
            <Text
              style={{
                color: theme.colors.mainDark,
            
                fontSize: responsiveFontSize(2.5)
              }}
            >
              No Notifications
            </Text>
          </View>
        )}
      </ScrollView>
      {userDetails?.user_type === 'customer' && (
        <BottomBar style={{marginTop: responsiveHeight(0)}} />
      )}
    </components.SafeAreaView>
  );
};

export default DashboardNotification;
