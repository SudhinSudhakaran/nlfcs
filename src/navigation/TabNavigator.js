import {
  View,
  TouchableOpacity,
  StatusBar,
  Text,
  Image,
  BackHandler,
  Alert,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setScreen} from '../store/tabSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {components} from '../components';
import {svg} from '../assets/svg';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import Dashboard from '../screens/tabs/Dashboard';
import Deposits from '../screens/tabs/Deposits';
import Loans from '../screens/tabs/Loans';
import Notification from '../screens/tabs/Notification';
import More from '../screens/tabs/More';
import {Globals, theme} from '../constants';
import Images from '../constants/Images';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Transactions from '../screens/Transactions';
import DataManager from '../helpers/apiManager/DataManager';
import {
  setMemberLoading,
  setShareDetails,
  setUserDetails,
} from '../store/userSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import Utilities from '../helpers/utils/Utilities';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import Documents from '../screens/Documents';
import {
  setNotificationDetails,
  setNotificationUnReadCount,
} from '../store/notificationSlice';
import Deposit from '../screens/Deposit';

import {setSecretKey} from '../store/googleAuthenticatorSlice';

const TabNavigator = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [notification, setNotification] = useState([]);
  const screen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const notificationDetails = useSelector(
    (state) => state.notificationDetails.notificationDetails,
  );
  const {notificationUnReadCount, showUnreadCount} = useSelector(
    (state) => state.notificationDetails
  );

  const [unreadCount, setUnReadCount] = useState(['1']);
  const tabs = [
    {
      name: 'Dashboard',
      icon: svg.DashboardSvg,
    },
    {
      name: 'Deposits',
      icon: svg.WalletSvg,
    },
    // {
    //   name: 'Loans',
    //   icon: svg.PercentageSvg,
    // },
    {
      name: 'DigiLocker',
      icon: svg.PercentageSvg,
    },
    {
      name: 'Notification',
      icon: svg.NotificationSvg,
    },
    {
      name: 'FAQ',
      icon: require('../assets/icons/faq.png'),
    },
    // {
    //   name: 'More',
    //   icon: svg.MoreSvg,
    // },
  ];

  const renderStatusBar = () => {
    return (
      <StatusBar barStyle='dark-content' backgroundColor={theme.colors.white} />
    );
  };
  useEffect(() => {
    dispatch(setScreen('Dashboard'));
  }, []);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getNotification();
  //     return () => {};
  //   }, []),
  // );

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
    dispatch(setScreen('Dashboard'));
    //exit App
    BackHandler.exitApp();
    navigation.navigate('Onboarding');
  };
  const homeIndicatorSettings = () => {
    if (homeIndicatorHeight !== 0) {
      return homeIndicatorHeight;
    }
    if (homeIndicatorHeight === 0) {
      return 20;
    }
  };
  /**
 * Purpose: Get Notifications
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 27 Jun 2023
 * Steps:
   1.fetch Announcements details from API and append to state variable
*/
  const getNotification = () => {
    console.log('Notification  function called=======');
    setUnReadCount([]);
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
                  setUnReadCount([item, ...unreadCount]);
                }
              });
            } else {
              setUnReadCount([]);
            }
            console.log(
              'Notification  function called=======',
              unreadCount.length,
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
  const renderHeader = () => {
    if (screen === 'Dashboard') {
      return (
        <View style={{zIndex: 100}}>
          <components.Header
            creditCard={screen === 'Dashboard' && true}
            user={screen === 'Dashboard' && true}
            userTitleStyle={{left: responsiveWidth(3)}}
            showRound={false}
          />
          <TouchableOpacity
            style={{
              marginLeft: responsiveWidth(86),
              bottom: 30,
              zIndex: 10000,
            }}
            onPress={() => navigation.navigate('DashboardNotification')}
          >
            <Image
              style={{
                width: responsiveWidth(6),
                height: responsiveWidth(6),
              }}
              source={Images.BELL_ICON}
            />
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
        </View>
      );
    }
  };

  const renderScreen = () => {
    return (
      <View style={{flex: 1}}>
        {screen === 'Dashboard' && <Dashboard />}
        {/* {screen === 'Deposits' && <Deposit />} */}
        {screen === 'Loans' && <Loans />}
        {/* {screen === 'DigiLocker' && <Documents />} */}
        {screen === 'Notification' && <Notification />}
        {screen === 'More' && <More />}
      </View>
    );
  };

  const renderBottomTab = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          backgroundColor: theme.colors.newRoundBgColor,

          height: responsiveHeight(8),
        }}
      >
        <LinearGradient
          start={{x: 0.0, y: 0.0}}
          end={{x: 0.5, y: 1.7}}
          colors={[theme.colors.newRoundBgColor, theme.colors.newPrimaryColor]}
          style={{
            width: responsiveWidth(10),
            height: responsiveWidth(10),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}
        >
          <Image source={Images.HOME_ICON} style={{}} />
        </LinearGradient>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Deposit');
          }}
          style={{
            width: responsiveWidth(10),
            height: responsiveWidth(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={Images.WALLET} style={{}} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Documents');
          }}
          style={{
            width: responsiveWidth(10),
            height: responsiveWidth(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={Images.DOCS} style={{}} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Announcements');
          }}
          style={{
            width: responsiveWidth(10),
            height: responsiveWidth(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={Images.MIC_ICON} style={{}} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FAQ');
          }}
          style={{
            width: responsiveWidth(10),
            height: responsiveWidth(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={Images.NEW_FAQ} style={{}} />
        </TouchableOpacity>
        {/* {tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                paddingHorizontal: 16,
                height: '100%',
                justifyContent: 'center',
              }}
              onPress={() =>
                tab.name === 'Notification'
                  ? navigation.navigate('Announcements')
                  : tab.name === 'DigiLocker'
                  ? navigation.navigate('Documents')
                  : tab.name === 'FAQ'
                  ? navigation.navigate('FAQ')
                  : tab.name === 'Deposits'
                  ? navigation.navigate('Deposit')
                  : dispatch(setScreen(tab.name))
              }
            >
              <View>
                {tab.name === 'Notification' ? (
                  <Image
                    style={{
                      marginTop: responsiveHeight(0),
                      alignSelf: 'center',
                      width: 23,
                      height: 20,
                      tintColor: theme.colors.newPrimaryColor
                    }}
                    source={Images.MIC_ICON}
                  />
                ) : tab.name === 'DigiLocker' ? (
                  <Image
                    style={{
                      marginTop: responsiveHeight(0),
                      alignSelf: 'center',
                      width: 23,
                      height: 20,
                      tintColor: theme.colors.newPrimaryColor
                    }}
                    source={Images.DOCS}
                  />
                ) : tab.name === 'FAQ' ? (
                  <Image
                    style={{
                      marginTop: responsiveHeight(0),
                      alignSelf: 'center',
                      width: 23,
                      height: 20,
                      tintColor: theme.colors.newPrimaryColor
                    }}
                    source={Images.FAQ}
                  />
                ) : (
                  <Image
                    style={{
                      marginTop: responsiveHeight(0),
                      alignSelf: 'center',
                      width: 23,
                      height: 20,
                      tintColor: theme.colors.white,
                    }}
                    source={Images.HOME_ICON}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })} */}
      </View>
    );
  };

  return (
    <components.SafeAreaView
      edges={['top']}
      background={screen === 'Notification' ? true : false}
    >
      {renderStatusBar()}
      {renderHeader()}
      {renderScreen()}
      {renderBottomTab()}
    </components.SafeAreaView>
  );
};

export default TabNavigator;
