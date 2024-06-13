/**
    * Purpose:* Create Announcement List screen
              * display Announcements as list
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';

import {Images, theme} from '../constants';
import {svg} from '../assets/svg';
import {components} from '../components';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import AnnouncementDetails from './AnnouncementDetails';
import DataManager from '../helpers/apiManager/DataManager';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAnnouncementDetails,
  setAnnouncementLoading,
} from '../store/announcementSlice';
import {Alert} from 'react-native';
import Utilities from '../helpers/utils/Utilities';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import {Keyboard} from 'react-native';
import moment from 'moment';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {BackHandler} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Image} from 'react-native';
import {setScreen} from '../store/tabSlice';
import BottomBar from './BottomBar';
import { setAnnouncementTab, setDashboardTab } from '../store/bottomTabSlice';

const announcements = [
  {
    id: 1,
    title: 'Education Department Announces Permanent !',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 2,
    title: 'Eligibility Requirements Announced....!',
    status: 'completed',
    date: 'Apr 10, 2023 at 12:47 PM',
  },
  {
    id: 3,
    title: 'Regular Home Loans..... ',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 4,
    title: 'Your loan application has been approved!',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 5,
    title: 'Your loan application has been approved!',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
];

const Announcements = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const announcementDetails = useSelector(
    (state) => state.announcementDetails.announcementDetails,
  );
  const announcementLoading = useSelector(
    (state) => state.announcementDetails.announcementLoading,
  );
  const screen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;
  const tabs = [
    {
      name: 'Dashboard',
      icon: svg.DashboardSvg,
    },
    {
      name: 'Deposit',
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
  const homeIndicatorSettings = () => {
    if (homeIndicatorHeight !== 0) {
      return homeIndicatorHeight;
    }
    if (homeIndicatorHeight === 0) {
      return 20;
    }
  };
  //Backbutton action in phone
  useEffect(() => {
    dispatch(setAnnouncementTab(true));
    dispatch(setDashboardTab(false));
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
    getAnnouncements();
  }, []);
  /** Purpose:  Navigation from each Announcement list
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26-06-2023
   * Steps:
   *1.passed parameters such as id  stored in a variable
   *2. Navigate to Announcement Description
   */
  const AnnouncementDetails = (item) => {
    navigation.navigate('AnnouncementDetails', {item: item}); //id passed to announcement detail screen
  };
  /**
 * Purpose: Get Announcements
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 26 Jun 2023
 * Steps:
   1.fetch Announcements details from API and append to state variable
*/
  const getAnnouncements = () => {
    dispatch(setAnnouncementLoading(true));
    var formdata = new FormData();
    DataManager.getAnnouncements(formdata).then(
      ([isSuccess, message, data]) => {
        console.log('data', data);
        if (isSuccess === true && data?.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data.status !== 'Token is Expired'
          ) {
            dispatch(setAnnouncementDetails(data));
            setTimeout(() => {
              dispatch(setAnnouncementLoading(false));
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
              dispatch(setAnnouncementLoading(false));
            }, 1000);
          }
        } else {
          Utilities.showToast('Failed', data.status, 'error', 'bottom');
          setTimeout(() => {
            dispatch(setAnnouncementLoading(false));
          }, 1000);
        }
      },
    );
  };
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26-06-2023
   * Steps:
   *1. Cleared User details,autherization,token,secret key from storage
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
  //shimmer for Announcement list
  const AnnouncementLoader = () => (
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
        title={'Announcements'}
        backstyle={{
          marginRight: responsiveHeight(1),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(22),
          marginTop: 15,
          marginLeft: responsiveWidth(0),
          left: 10,
        }}
      />
    );
  };
  /** Purpose: Announcement list display
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26-06-2023
   * Steps:
   *1. checked with condition
   *if announcementLading === true displayed announcement loader else displyed announcement list
   *2. announcementdetail perform as redux state
   * maped function declared=> announcementdetail array to return object
   *3.Touchable action navigate to curresponding announcement detail
   */
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          marginTop: responsiveHeight(2),
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
      >
        {/* {announcementLoading === true ? (
          <AnnouncementLoader />
        ) : ( */}
          <>
            {announcementDetails.map((item, index, array) => {
              var id = item?.id;
              const last = array.length - 1 === index;
              var date = moment(item?.date).format('Y-MM-DD');
              var time = moment(item?.date).format('hh:mm a');

              return (
                <View key={index}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.colors.lightGrey,
                      marginBottom: last ? 0 : 10,
                      padding: 20,
                      borderRadius: 10,
                    }}
                    onPress={() => AnnouncementDetails(item)}
                  >
                    {/* <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    right: responsiveWidth(4),
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
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_16,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
                      color: theme.colors.mainDark,
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </View> */}
                    {item?.name && (
                      <Text
                        style={{
                          marginBottom: 14,
                          ...theme.fonts.SourceSansPro_Regular_16,
                          lineHeight:
                            theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                          color: theme.colors.bodyTextColor,
                        }}
                      >
                        {item?.name || ''}
                      </Text>
                    )}
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
                </View>
              );
            })}
          </>
        {/* )} */}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(73)}}>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};

export default Announcements;
