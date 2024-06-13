/**
    * Purpose:* Create New Ticket screen
              * list Active Tickets
              * add new ticket button
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Image from 'react-native-scalable-image';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {Globals, Images, theme} from '../constants';
import {svg} from '../assets/svg';
import {BackHandler} from 'react-native';

import {Keyboard} from 'react-native';
import Utilities from '../helpers/utils/Utilities';
import DataManager from '../helpers/apiManager/DataManager';
import APIConnections from '../helpers/apiManager/APIConnections';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setUserDetails} from '../store/userSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import myticketSlice, {
  setMyTicketsClosedDetails,
  setMyTicketsDetails,
  setMyTicketsLoading,
  setMyTicketsPendingDetails,
} from '../store/myTicketSlice';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {setScreen} from '../store/tabSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomBar from './BottomBar';

//demo array
const transactions = [
  {
    id: 1,
    paymentTo: 'test ticket',
    type: '',
    price: 'Open',
    date: '23',
    month: 'April',
  },
  {
    id: 2,
    paymentTo: 'test ticket',
    type: '',
    price: 'Closed',
    date: '23',
    month: 'April',
  },
];

const SupportTickets = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  //Redux states for storing ticket details
  const myTicketsDetails = useSelector(
    (state) => state.myTicketsDetails.myTicketsDetails,
  );
  const myTicketsPendingDetails = useSelector(
    (state) => state.myTicketsDetails.myTicketsPendingDetails,
  );
  const myTicketsClosedDetails = useSelector(
    (state) => state.myTicketsDetails.myTicketsClosedDetails,
  );
  const myTicketsLoading = useSelector(
    (state) => state.myTicketsDetails.myTicketsLoading,
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
  useEffect(() => {
    //call Ticket Api
    performMyTicket();
    performMyTicketPending();
    performMyTicketClosed();
    //Backbutton action in phone
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
  //shimmer for My Tickets
  const MyTicketsLoader = () => (
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
  // API CALL
  /**
   * Purpose: Perform Mytickets
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
      1.active status passed
      2.fetch  Active ticket details from API and append to state variable
   */

  const performMyTicket = () => {
    Keyboard.dismiss();
    dispatch(setMyTicketsLoading(true));
    var formdata = new FormData();
    formdata.append(APIConnections.KEYS.STATUS, 'active');
    DataManager.performMyTicket(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          dispatch(setMyTicketsDetails(data?.data?.data));
          setTimeout(() => {
            dispatch(setMyTicketsLoading(false));
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
            dispatch(setMyTicketsLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast('Failed', data.status, 'error', 'bottom');
        setTimeout(() => {
          dispatch(setMyTicketsLoading(false));
        }, 1000);
      }
    });
  };
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28-06-2023
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
  // API CALL
  /**
   * Purpose: Perform Mytickets
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
      1.pending status passed
      2.fetch  pending ticket details from API and append to state variable
   */
  const performMyTicketPending = () => {
    Keyboard.dismiss();
    dispatch(setMyTicketsLoading(true));
    var formdata = new FormData();
    formdata.append(APIConnections.KEYS.STATUS, 'pending');
    DataManager.performMyTicket(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          dispatch(setMyTicketsPendingDetails(data?.data?.data));
        } else {
        }
      }
    });
  };
  // API CALL
  /**
   * Purpose: Perform Mytickets
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
      1.empty string status passed
      2.fetch  closed ticket details from API and append to state variable
   */
  const performMyTicketClosed = () => {
    Keyboard.dismiss();
    dispatch(setMyTicketsLoading(true));
    var formdata = new FormData();
    formdata.append(APIConnections.KEYS.STATUS, '');
    DataManager.performMyTicket(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          dispatch(setMyTicketsClosedDetails(data?.data?.data));
        } else {
        }
      }
    });
  };
  /** Purpose: Active tickets list displayed
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28-06-2023
   * Steps:
   *1. checked with condition
   *if myTicketsLoading === true displayed MyTickets loader else displyed Active ticket list
   *2. myTicketsDetails perform as redux state
   * maped function declared=> myTicketsDetails array to return object
   *3.Touchable action navigate to curresponding Reply screen
   */
  const renderTickets = () => {
    return (
      <View
        contentContainerStyle={{flexGrow: 1}}
        style={{
          flexGrow: 0,
          bottom: responsiveHeight(2),
        }}
      >
        {/* {myTicketsLoading === true ? (
          <MyTicketsLoader />
        ) : ( */}
          <View style={{paddingHorizontal: 20, marginTop: responsiveHeight(2)}}>
            {myTicketsDetails?.map((item, index, array) => {
              const last = array.length === index + 1;
              var date = moment(item?.created_at).format('DD');
              var month = moment(item?.created_at).format('MMMM');

              return (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: last ? 0 : 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate('ReplyScreen', {
                      id: item?.id,
                      user_id: item?.created_user_id,
                    })
                  }
                >
                  {/* <Image width={responsiveWidth(7)} source={item.icon} /> */}
                  <View style={{marginLeft: 14}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                        fontSize:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.7,
                      }}
                    >
                      {date || ''}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {month || ''}
                    </Text>
                  </View>
                  <View style={{marginLeft: 14, marginRight: 'auto'}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                        textTransform: 'capitalize',
                      }}
                      numberOfLines={1}
                    >
                      {item?.subject || ''}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {item.type}
                    </Text>
                  </View>
                  <View style={{}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                        color:
                          item.type === 'Money transfer' ||
                          item.type === 'Deposits'
                            ? '#55ACEE'
                            : theme.colors.mainDark,
                      }}
                    >
                      {item?.status === 1
                        ? 'Open'
                        : item?.status === 0
                        ? 'Pending'
                        : 'Closed'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        {/* )} */}
      </View>
    );
  };
  /** Purpose: Pending tickets list displayed
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28-06-2023
   * Steps:
   * myTicketsPendingDetails perform as redux state
   * maped function declared=> myTicketsPendingDetails array to return object
   */
  const renderTicketsPending = () => {
    return (
      <View
        contentContainerStyle={{flexGrow: 1}}
        style={{
          flexGrow: 0,
          bottom: responsiveHeight(2),
        }}
      >
        {myTicketsLoading === true ? null : (
          <View style={{paddingHorizontal: 20, marginTop: responsiveHeight(2)}}>
            {myTicketsPendingDetails?.map((item, index, array) => {
              const last = array.length === index + 1;
              var date = moment(item?.created_at).format('DD');
              var month = moment(item?.created_at).format('MMMM');

              return (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: last ? 0 : 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  disabled={true}
                >
                  {/* <Image width={responsiveWidth(7)} source={item.icon} /> */}
                  <View style={{marginLeft: 14}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                        fontSize:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.7,
                      }}
                    >
                      {date || ''}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {month || ''}
                    </Text>
                  </View>
                  <View style={{marginLeft: 14, marginRight: 'auto'}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                        textTransform: 'capitalize',
                      }}
                      numberOfLines={1}
                    >
                      {item?.subject || ''}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {item.type}
                    </Text>
                  </View>
                  <View style={{}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                        color:
                          item.type === 'Money transfer' ||
                          item.type === 'Deposits'
                            ? '#55ACEE'
                            : theme.colors.mainDark,
                      }}
                    >
                      {item?.status === 1
                        ? 'Open'
                        : item?.status === 0
                        ? 'Pending'
                        : 'Closed'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };
  /** Purpose: Closed tickets list displayed
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28-06-2023
   * Steps:
   * myTicketsClosedDetails perform as redux state
   * maped function declared=> myTicketsClosedDetails array to return object
   */
  const renderTicketsClosed = () => {
    return (
      <View
        contentContainerStyle={{flexGrow: 1}}
        style={{
          flexGrow: 0,
          bottom: responsiveHeight(2),
        }}
      >
        {myTicketsLoading === true ? null : (
          <View style={{paddingHorizontal: 20, marginTop: responsiveHeight(2)}}>
            {myTicketsClosedDetails?.map((item, index, array) => {
              const last = array.length === index + 1;
              var date = moment(item?.created_at).format('DD');
              var month = moment(item?.created_at).format('MMMM');

              return (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: last ? 0 : 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate('ClosedTicketScreen', {
                      id: item?.id,
                      user_id: item?.created_user_id,
                    })
                  }
                >
                  {/* <Image width={responsiveWidth(7)} source={item.icon} /> */}
                  <View style={{marginLeft: 14}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                        fontSize:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.7,
                      }}
                    >
                      {date || ''}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {month || ''}
                    </Text>
                  </View>
                  <View style={{marginLeft: 14, marginRight: 'auto'}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                        textTransform: 'capitalize',
                      }}
                      numberOfLines={1}
                    >
                      {item?.subject || ''}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {item.type}
                    </Text>
                  </View>
                  <View style={{}}>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                        color:
                          item.type === 'Money transfer' ||
                          item.type === 'Deposits'
                            ? '#55ACEE'
                            : theme.colors.mainDark,
                      }}
                    >
                      {item?.status === 1
                        ? 'Open'
                        : item?.status === 0
                        ? 'Pending'
                        : 'Closed'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };
  //Displayed back button and title
  const renderHeader = () => {
    return (
      <View style={{padding: 10, flexDirection: 'row'}}>
        <components.Header
          goBack
          title={'Tickets'}
          backstyle={{
            marginRight: responsiveHeight(2),
            left: responsiveWidth(0),
            marginTop: 46,
          }}
          titleStyle={{
            marginRight: responsiveHeight(13),
            marginTop: 18,
          }}
        />
        <TouchableOpacity
          style={{
            height: 30,
            width: '35%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.mainDark,
            borderRadius: 10,
            position: 'absolute',
            right: 20,
            top: 30,
          }}
          onPress={() => navigation.navigate('NewTicket')}
        >
          <Text
            style={{
              ...theme.fonts.SourceSansPro_SemiBold_16,
              color: theme.colors.white,
            }}
          >
            + New Ticket
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <components.SafeAreaView>
        <ScrollView style={{height: responsiveHeight(75)}}>
          {renderHeader()}
          {renderTickets()}
          {renderTicketsPending()}
          {renderTicketsClosed()}
        </ScrollView>
        <BottomBar style={{marginTop: responsiveHeight(0)}} />
      </components.SafeAreaView>
    </>
  );
};

export default SupportTickets;
