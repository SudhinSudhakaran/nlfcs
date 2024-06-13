import {
  View,
  TouchableOpacity,
  StatusBar,
  Text,
  Image,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setScreen} from '../store/tabSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {components} from '../components';
import {svg} from '../assets/svg';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Notification from '../screens/tabs/Notification';
import {Globals, Images, theme} from '../constants';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import StaffDashboard from '../screens/StaffDashboard';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {
  setFullInfo,
  setMemberLoading,
  setShareDetails,
  setUserDetails,
} from '../store/userSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import Utilities from '../helpers/utils/Utilities';
import DataManager from '../helpers/apiManager/DataManager';
import {setNotificationDetails} from '../store/notificationSlice';

const StaffTabNavigator = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentTabScreen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const notificationDetails = useSelector(
    (state) => state.notificationDetails.notificationDetails,
  );
  const {showUnreadCount} = useSelector((state) => state.notificationDetails);
  const [unreadCount, setUnReadCount] = useState(['1']);
  const tabs = [
    {
      name: 'Dashboard',
      icon: svg.DashboardSvg,
    },
    {
      name: 'Notification',
      icon: svg.NotificationSvg,
    },
  ];

  const renderStatusBar = () => {
    return (
      <StatusBar barStyle='dark-content' backgroundColor={theme.colors.white} />
    );
  };

  const homeIndicatorSettings = () => {
    if (homeIndicatorHeight !== 0) {
      return homeIndicatorHeight;
    }
    if (homeIndicatorHeight === 0) {
      return 20;
    }
  };
  useEffect(() => {
    getUserDetails();

    //backbutton action in phn
    const handleBackButton = () => {
      exitApp();
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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getNotification();
  //     return () => {};
  //   }, []),
  // );
  const exitApp = () => {
    BackHandler.exitApp();
    //navigate to splash screen
    navigation.navigate('Onboarding');
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
          dispatch(setFullInfo(data));
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
        Utilities.showToast('Failed', data.status, 'error', 'bottom');
        setTimeout(() => {
          dispatch(setMemberLoading(false));
        }, 1000);
      }
    });
  };

  /**
 * Purpose: Get Notifications
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 27 Jun 2023
 * Steps:
   1.fetch Announcements details from API and append to state variable
*/
  const getNotification = () => {
    setUnReadCount([]);
    console.log('Notification  function called=======');
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

            if (data?.status !== 'Permission denied !') {
              notificationDetails?.map((item, index, array) => {
                if (item?.read_at === null) {
                  setUnReadCount([item, unreadCount]);
                }
              });
            } else {
              setUnReadCount([]);
            }
            console.log(
              'Notification  function called=======',
              unreadCount?.length,
            );
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
          }
        } else {
          Utilities.showToast('Failed', data.status, 'error', 'bottom');
        }
      },
    );
  };
  /** session expired action
   * Cleared User details,autherization,email,token from storage
   * Navigate to SignIn
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
  const renderHeader = () => {
    if (currentTabScreen === 'Dashboard') {
      return (
        <>
          <components.Header
            creditCard={currentTabScreen === 'Dashboard' && true}
            user={currentTabScreen === 'Dashboard' && true}
            userTitleStyle={{left: responsiveWidth(4)}}
            showRound={true}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {tabs.map((tab, index) => {
              return tab.name === 'Notification' ? (
                <TouchableOpacity
                  key={index}
                  style={{
                    marginLeft: responsiveWidth(86),
                    bottom: 30,
                  }}
                  onPress={() => navigation.navigate('DashboardNotification')}
                >
                  <View>
                    <Image
                      style={{
                        width: responsiveWidth(6),
                        height: responsiveWidth(6),
                      }}
                      source={Images.BELL_ICON}
                    />
                  </View>
                  {showUnreadCount === true ? (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10 / 2,
                        marginLeft: 22,
                        bottom: 22,
                        backgroundColor: theme.colors.newBorderColor,
                        position: 'absolute',
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              ) : null;
            })}
          </View>
        </>
      );
    }
  };

  const renderScreen = () => {
    return (
      <View style={{flex: 1}}>
        {currentTabScreen === 'Dashboard' && <StaffDashboard />}
        {currentTabScreen === 'Notification' && <Notification />}
      </View>
    );
  };

  return (
    <components.SafeAreaView
      edges={['top']}
      background={currentTabScreen === 'Notification' ? true : false}
    >
      {renderStatusBar()}
      {renderHeader()}
      {renderScreen()}
    </components.SafeAreaView>
  );
};

export default StaffTabNavigator;
