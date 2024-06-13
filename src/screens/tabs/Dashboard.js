import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  BackHandler,
  Alert,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../../components';
import {Globals, theme} from '../../constants';
import {svg} from '../../assets/svg';

import {
  setMemberLoading,
  setShareDetails,
  setUserDetails,
} from '../../store/userSlice';
import StorageManager from '../../helpers/storageManager/StorageManager';
import DataManager from '../../helpers/apiManager/DataManager';
import {useDispatch, useSelector} from 'react-redux';

import {setIsAuthorized} from '../../redux/slice/authenticationSlice';
import Utilities from '../../helpers/utils/Utilities';
import {setSecretKey} from '../../store/googleAuthenticatorSlice';
import {setNotificationRefresh} from '../../store/notificationSlice';

const operations = [
  {
    id: 1,
    title: 'Member Info',
    icon: require('../../assets/newImages/member1.png'),
  },
  {
    id: 2,
    title: 'Loans',
    icon: require('../../assets/newImages/profit1.png'),
  },
  {
    id: 3,
    title: 'Support \nTickets',
    icon: require('../../assets/newImages/headphone1.png'),
  },
];
const twooperations = [
  {
    id: 4,
    title: 'Shares',
    icon: require('../../assets/newImages/growth-graph1.png'),
  },
  {
    id: 5,
    title: 'Benefits',
    icon: require('../../assets/newImages/grow-chart1.png'),
  },
  {
    id: 6,
    title: 'FDR',
    icon: require('../../assets/newImages/bank1.png'),
  },
];
const cards = [
  {
    id: 1,
    image: 'https://george-fx.github.io/apitex/cards/01.jpg',
  },
  // {
  //   id: 2,
  //   image: 'https://george-fx.github.io/apitex/cards/02.jpg',
  // },
];

const Dashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {notificationUnReadCount, showUnreadCount} = useSelector(
    (state) => state.notificationDetails,
  );
  useEffect(() => {
    getUserDetails();
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
  useFocusEffect(
    React.useCallback(() => {
      getNotification();
      return () => {};
    }, []),
  );
  const getNotification = () => {
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
            // if (data.length > 0) {
            //   data?.map((item, index, array) => {
            //     if (item?.read_at === null) {
            //       dispatch(setNotificationRefresh(true));
            //       return;
            //     }
            //   });
            // } else {
            //   dispatch(setNotificationRefresh(false));
            // }
            var shouldRefreshNotification = true;
            data.forEach((item) => {
              if (item.read_at === null) {
                console.log('fpond');
                shouldRefreshNotification = true; // Set the flag to true and stop iterating
              }
            });

            if (shouldRefreshNotification) {
              dispatch(setNotificationRefresh(true));
            } else {
              dispatch(setNotificationRefresh(false));
            }
            console.log(
              'Notification  function called=======',
              showUnreadCount,
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
        }
      },
    );
  };

  const backButtonAction = () => {
    //exit App
    BackHandler.exitApp();
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
  const renderCards = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <components.MemberCard />
      </View>
    );
  };

  const renderOperations = () => {
    return (
      <View
        style={{
          marginBottom: responsiveHeight(0),
          alignSelf: 'center',
          flexDirection: 'row',

          justifyContent: 'space-evenly',
          // backgroundColor: 'green',
          width: responsiveWidth(90),
        }}
      >
        {operations.map((item, index, array) => {
          const lastElement = array.length === index + 1;

          return (
            <View
              style={{
                alignItems: 'center',

                flex: 1,
              }}
            >
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: theme.colors.newBackgroundColor,
                  borderColor: theme.colors.newBorderColor,
                  borderWidth: 1.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: responsiveWidth(16),
                  width: responsiveWidth(16),
                  borderRadius: responsiveWidth(6),
                }}
                onPress={() => {
                  if (item.title === 'Loans') {
                    navigation.navigate('LoanList');
                  }
                  if (item.title === 'Support \nTickets') {
                    navigation.navigate('SupportTickets');
                  }
                  if (item.title === 'Member Info') {
                    navigation.navigate('MemberInfo');
                  }
                }}
              >
                <components.Image
                  source={item.icon}
                  style={{
                    width: responsiveWidth(7),
                    aspectRatio: 1 / 1,
                  }}
                  tintColor={theme.colors.newPrimaryColor}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Poppins-Light',
                  color: '#000000',
                  fontSize: 10,
                  marginTop: '7%',
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  const renderTwoOperations = () => {
    return (
      <View
        style={{
          marginBottom: responsiveHeight(1),
          alignSelf: 'center',
          flexDirection: 'row',

          justifyContent: 'space-evenly',
          // backgroundColor: 'green',
          width: responsiveWidth(90),
        }}
      >
        {twooperations.map((item, index, array) => {
          const lastElement = array.length === index + 1;

          return (
            <View style={{alignItems: 'center', flex: 1}}>
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: theme.colors.newBackgroundColor,

                  borderColor: theme.colors.newBorderColor,
                  borderWidth: 1.5,

                  alignItems: 'center',
                  justifyContent: 'center',
                  height: responsiveWidth(16),
                  width: responsiveWidth(16),
                  borderRadius: responsiveWidth(6),
                }}
                onPress={() => {
                  if (item.title === 'Shares') {
                    navigation.navigate('Transactions');
                  }
                  if (item.title === 'Benefits') {
                    navigation.navigate('Benefits');
                  }
                  if (item.title === 'FDR') {
                    navigation.navigate('FDR');
                  }
                }}
              >
                <components.Image
                  source={item.icon}
                  style={{
                    width: responsiveWidth(7),

                    aspectRatio: 1 / 1,
                  }}
                  tintColor={theme.colors.newPrimaryColor}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Poppins-Light',
                  color: '#000000',
                  fontSize: 10,
                  marginTop: '7%',
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {renderCards()}
        {renderOperations()}
        {renderTwoOperations()}
        <components.AnnouncementsCarousel />
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: theme.colors.newRoundBgColor,
          width: responsiveWidth(100),
          height: responsiveWidth(100),
          borderRadius: responsiveWidth(80),
          position: 'absolute',

          left: responsiveWidth(-35),
          top: responsiveHeight(-35),
        }}
      />

      <View
        style={{
          backgroundColor: theme.colors.newRoundBgColor,
          width: responsiveWidth(30),
          height: responsiveWidth(30),
          borderRadius: responsiveWidth(80),
          position: 'absolute',

          right: responsiveWidth(-18),
          top: responsiveHeight(15),
        }}
      />
      {renderContent()}
    </View>
  );
};

export default Dashboard;
