/**
    * Purpose:* Create Transaction Detail screen
              * display Transaction
              * add more button to view more transactions
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {Globals, Images, theme} from '../constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  setTransactionDetails,
  setTransactionLoading,
} from '../store/transactionSlice';
import Utilities from '../helpers/utils/Utilities';
import DataManager from '../helpers/apiManager/DataManager';
import {BackHandler} from 'react-native';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {Alert} from 'react-native';
import moment from 'moment';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {Keyboard} from 'react-native';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import {Image} from 'react-native';
import {svg} from '../assets/svg';
import {setScreen} from '../store/tabSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Deposits from './tabs/Deposits';
import BottomBar from './BottomBar';
const transactions = [
  {
    id: 1,
    paymentTo: 'Loan',
    type: 'Credit',
    price: '+ 2000.00',
    date: '23',
    month: 'April',
  },
  {
    id: 2,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 1325.27',
    date: '23',
    month: 'April',
  },
  {
    id: 3,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 200.00',
    date: '23',
    month: 'April',
  },
  {
    id: 4,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 200.27',
    date: '22',
    month: 'April',
  },
  {
    id: 5,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 4100.00',
    date: '21',
    month: 'April',
  },
  {
    id: 6,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 8260.27',
    date: '20',
    month: 'April',
  },
  {
    id: 7,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 1325.27',
    date: '20',
    month: 'April',
  },
  {
    id: 8,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 200.00',
    date: '20',
    month: 'April',
  },
  {
    id: 9,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 200.27',
    date: '20',
    month: 'April',
  },
  {
    id: 10,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 4100.00',
    date: '20',
    month: 'April',
  },
  {
    id: 11,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 8260.27',
    date: '20',
    month: 'April',
  },
];
const moretransactions = [
  {
    id: 1,
    paymentTo: 'Loan',
    type: 'Credit',
    price: '+ 2000.00',
    date: '19',
    month: 'April',
  },
  {
    id: 2,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 1325.27',
    date: '18',
    month: 'April',
  },
  {
    id: 3,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 200.00',
    date: '17',
    month: 'April',
  },
  {
    id: 4,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 200.27',
    date: '16',
    month: 'April',
  },
  {
    id: 5,
    paymentTo: 'Withdraw',
    type: 'Debit',
    price: '- 4100.00',
    date: '15',
    month: 'April',
  },
  {
    id: 6,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 8260.27',
    date: '14',
    month: 'April',
  },
];
const Transactions = () => {
  const navigation = useNavigation();
  const [ismore, setMore] = useState(false);
  //Redux states
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const transactionDetails = useSelector(
    (state) => state.transactionDetails.transactionDetails,
  );
  const transactionLoading = useSelector(
    (state) => state.transactionDetails.transactionLoading,
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
    setMore(false);
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
    navigation.goBack();
  };
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        dispatch(setTransactionLoading(true));
      }, 1000);
      getTransactionDetails();
    }, []),
  );
  //shimmer for trnsaction list
  const TransactionLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={400}
      marginTop={responsiveHeight(1)}
      //viewBox="0 0 320 "
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='5%' y='40' rx='5' ry='5' width='90%' height='80' />
      <Rect x='5%' y='130' rx='5' ry='5' width='90%' height='80' />
      <Rect x='5%' y='220' rx='5' ry='5' width='90%' height='80' />
    </ContentLoader>
  );
  const EmptyTransactions = () => {
    return (
      <View style={{marginTop: responsiveHeight(20)}}>
        <Text
          style={{
            alignSelf: 'center',
            ...theme.fonts.SourceSansPro_Regular_14,
            lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
            color: theme.colors.mainDark,
            fontSize: 20,
          }}
        >
          No Transactions
        </Text>
      </View>
    );
  };
  /**
 * Purpose: Get Transaction Detail
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 14 Jun 2023
 * Steps:
   1.fetch user details from API and append to state variable
*/
  const getTransactionDetails = () => {
    dispatch(setTransactionLoading(true));
    var formdata = new FormData();
    DataManager.getShareTransactionDetails(formdata).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true && data.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data?.status !== 'Token is Expired'
          ) {
            dispatch(setTransactionDetails(data));
            setTimeout(() => {
              dispatch(setTransactionLoading(false));
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
              dispatch(setTransactionLoading(false));
            }, 1000);
          }
        } else {
          Utilities.showToast('Failed', data.status, 'error', 'bottom');
          setTimeout(() => {
            dispatch(setTransactionLoading(false));
          }, 1000);
        }
      },
    );
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
  const more = () => {
    return (
      <View
        style={{
          alignItems: 'flex-end',
          marginRight: responsiveWidth(6),
          bottom: responsiveWidth(14),
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
          }}
          onPress={() => {
            setMore(true);
          }}
        >
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 6,
              color:
                ismore === false
                  ? theme.colors.mainDark
                  : theme.colors.mainDark,
              textTransform: 'capitalize',
            }}
            numberOfLines={1}
          >
            + more
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  /**Header Component
   *Displayed back button and title
   */
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'Shares'}
        backstyle={{
          marginRight: responsiveHeight(2),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(30),
          marginTop: 18,
        }}
      />
    );
  };
  /** Purpose: Showing Transaction List
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
  1. checked with condition
     *if transactionLoading === true displayed transactionloader else showing transaction list
  2. transactionDetails perform as redux state
     * maped function declared=> transaction list array to return object
   */
  const renderTransactions = () => {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={{
          flexGrow: 0,
          marginBottom: 40,
        }}
      >
        {transactionDetails.length > 0 ? (
          <View style={{paddingHorizontal: 20, marginTop: responsiveHeight(3)}}>
            {transactionDetails?.map((item, index) => {
              var id = item?.user_id;
              var month = moment(item?.created_at).format('MMMM');
              var date = moment(item?.created_at).format('DD');
              return (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: theme.sizes.marginBottom_14,
                  }}
                >
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
                      {date}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {month}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft:
                        month === 'May' ||
                        month === 'June' ||
                        month === 'July' ||
                        month === 'March' ||
                        month === 'April'
                          ? responsiveWidth(20)
                          : responsiveWidth(12),
                      marginRight: 'auto',
                    }}
                  >
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
                      {item.type}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {item?.dr_cr
                        ?.split(' ')
                        .map((word) => word.toUpperCase())
                        .join(' ') || 'N/A'}{' '}
                    </Text>
                  </View>
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_14,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                      color: theme.colors.mainDark,
                    }}
                  >
                    {item.dr_cr === 'cr'
                      ? '+' + item.amount
                      : '-' + item.amount}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyTransactions />
        )}
        {/* {ismore === true ? (
          <View style={{paddingHorizontal: 20, marginTop: responsiveHeight(1)}}>
            {moretransactions.map((item, index, array) => {
              const last = array.length === index + 1;

              return (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: last ? 0 : 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
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
                      {item.date}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      {item.month}
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
                      {item.paymentTo}
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
                    {item.price}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null} */}
      </ScrollView>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.white,
        }}
      >
        {transactionDetails.status !== 'Token is Invalid'
          ? renderTransactions()
          : null}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(76)}}>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};

export default Transactions;
