/**
    * Purpose:* Create Dashboard for staff
              * Add Search Member Tile
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {Globals, theme} from '../constants';
import StaffCard from '../components/custom/StaffCard';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {
  setMemberLoading,
  setShareDetails,
  setUserDetails,
} from '../store/userSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import Utilities from '../helpers/utils/Utilities';
import DataManager from '../helpers/apiManager/DataManager';
import {useDispatch, useSelector} from 'react-redux';
import {setNotificationRefresh} from '../store/notificationSlice';

const searchMember = [
  {
    id: 1,
    title: 'Search Member',
    icon: require('../assets/icons/memberinfo.png'),
  },
];
const cards = [
  {
    id: 1,
    image: 'https://george-fx.github.io/apitex/cards/01.jpg',
  },
];

const StaffDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {notificationUnReadCount, showUnreadCount} = useSelector(
    (state) => state.notificationDetails,
  );
  useEffect(() => {
    getUserDetails();
    //backbutton action in phn
    // const handleBackButton = () => {
    //   backPressed();
    //   return true;
    // };
    // backPressed = () => {
    //   Alert.alert(
    //     'Exit App',
    //     'Do you want to exit the app?',
    //     [
    //       {
    //         text: 'No',
    //         onPress: () => console.log('Cancel Pressed'),
    //         style: 'cancel',
    //       },
    //       {text: 'Yes', onPress: () => exitApp()},
    //     ],
    //     {cancelable: false},
    //   );
    //   return true;
    // };
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   handleBackButton,
    // );

    // return () => {
    //   // Clean up
    //   backHandler.remove();
    // };
  }, []);
  // const exitApp = () => {
  //   BackHandler.exitApp();
  //   //navigate to splash screen
  //   navigation.navigate('Onboarding');
  // };
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
        Utilities.showToast('Failed', message, 'error', 'bottom');
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
  //Display Card
  const renderCards = () => {
    return (
      <View
        style={{
          marginBottom: 16,
          marginTop: Platform.OS === 'ios' ? 20 : responsiveHeight(0),
        }}
        showsHorizontalScrollIndicator={false}
      >
        <StaffCard />
      </View>
    );
  };

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

  // search member tile added
  const renderSearchMember = () => {
    return (
      <ScrollView
        horizontal={true}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: responsiveWidth(2),
        }}
        style={{flexGrow: 0, marginBottom: 30, alignSelf: 'center'}}
      >
        {searchMember.map((item, index, array) => {
          const lastElement = array.length === index + 1;

          return (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: theme.colors.white,
                marginRight: lastElement ? 20 : responsiveWidth(3),
                borderRadius: 10,
                borderColor: theme.colors.mainDark,
                borderWidth: 1,
                padding: 11,
                paddingRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: responsiveHeight(9),
                width: responsiveWidth(40),
              }}
              onPress={() => {
                if (item.title === 'Search Member') {
                  navigation.navigate('SearchMember');
                }
              }}
            >
              <components.Image
                source={item.icon}
                style={{
                  width: responsiveWidth(7),
                  aspectRatio: 1 / 1,
                  right: responsiveWidth(2),
                }}
                tintColor={theme.colors.mainDark}
              />
              <Text
                style={{
                  ...theme.fonts.SourceSansPro_Regular_10,
                  color: theme.colors.textColor,
                  lineHeight:
                    theme.fonts.SourceSansPro_Regular_10.fontSize * 1.2,
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView style={{flex: 1}}>
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
        {renderCards()}
        {renderSearchMember()}
      </ScrollView>
    );
  };

  return <View style={{flex: 1}}>{renderContent()}</View>;
};

export default StaffDashboard;
