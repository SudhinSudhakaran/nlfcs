import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import ParsedText from 'react-native-parsed-text';
import {components} from '../components';
import {Images, theme} from '../constants';
import {svg} from '../assets/svg';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {setScreen} from '../store/tabSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';

import Utilities from '../helpers/utils/Utilities';
import {
  setTransactionDetails,
  setTransactionLoading,
} from '../store/transactionSlice';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import DataManager from '../helpers/apiManager/DataManager';
import moment from 'moment';
import BottomBar from './BottomBar';
import {setDashboardTab, setDepositTab} from '../store/bottomTabSlice';

const currentDeposits = [
  {
    id: 1,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 1325.27',
    date: '23-April-2023',
    month: 'April',
    currency: 'MYR',
  },
  {
    id: 2,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 8260.27',
    date: '20-April-2023',
    month: 'April',
    currency: 'MYR',
  },
  {
    id: 3,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 1325.27',
    date: '20-April-2023',
    month: 'April',
    currency: 'MYR',
  },
  {
    id: 4,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 8260.27',
    date: '20-April-2023',
    month: 'April',
    currency: 'MYR',
  },
  {
    id: 5,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 1325.27',
    date: '18-April-2023',
    month: 'April',
    currency: 'MYR',
  },
  {
    id: 6,
    paymentTo: 'Deposit',
    type: 'Credit',
    price: '+ 8260.27',
    date: '14-April-2023',
    month: 'April',
    currency: 'MYR',
  },
];

const Deposit = () => {
  const navigation = useNavigation();
  const screen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;
  const dispatch = useDispatch();
  const transactionDetails = useSelector(
    (state) => state.transactionDetails.transactionDetails,
  );
  const transactionLoading = useSelector(
    (state) => state.transactionDetails.transactionLoading,
  );
  useEffect(() => {
    dispatch(setDepositTab(true));
    dispatch(setDashboardTab(false));
    getTransactionDetails();
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
    navigation.goBack();
  };
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'Deposits'}
        backstyle={{
          marginRight: responsiveHeight(1),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(30),
          marginTop: 15,
          marginLeft: responsiveWidth(0),
          left: 10,
        }}
      />
    );
  };
  //shimmer for Deposits
  const DepositsLoader = () => (
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
          No Deposits
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
    DataManager.getTransactionDetails(formdata).then(
      ([isSuccess, message, data]) => {
        console.log('???', data);
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

  const renderDeposits = () => {
    return (
      <View style={{marginBottom: theme.sizes.marginBottom_30}}>
        {/* {transactionLoading === true ? (
          <DepositsLoader />
        ) : ( */}
        <>
          <Text
            style={{
              marginTop: responsiveHeight(5),
              marginBottom: theme.sizes.marginBottom_10,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            Current deposits
          </Text>
          {transactionDetails.map((item, index, array) => {
            const last = array.length === index + 1;
            var date = moment(item?.created_at).format('Y-MM-DD');
            return item.type === 'Deposit' ? (
              <View
                key={index}
                style={{
                  width: '100%',
                  paddingVertical: 17,
                  paddingHorizontal: 14,
                  backgroundColor: '#f5f5ef',
                  borderRadius: 10,
                  marginBottom: last ? 0 : 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {item.status === 'completed' && (
                  <View style={{marginRight: 8}}>
                    <svg.CompletedSvg />
                  </View>
                )}
                {item.status === 'processing' && (
                  <View style={{marginRight: 8}}>
                    <svg.ProcessingSvg />
                  </View>
                )}
                <View style={{marginRight: 'auto'}}>
                  <View style={{flexDirection: 'row'}}>
                    <ParsedText
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_20,
                        color: theme.colors.mainDark,
                      }}
                      parse={[
                        {
                          pattern: /USD/,
                          style: {
                            color: theme.colors.mainDark,
                            ...theme.fonts.SourceSansPro_Regular_14,
                          },
                        },
                      ]}
                    >
                      {item.dr_cr === 'cr' ? '+' : '-'}
                      {' ' + item?.amount + ' ' || ''}
                    </ParsedText>
                    <ParsedText
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_16,
                        color: theme.colors.mainDark,
                        top: responsiveHeight(0.4),
                      }}
                      parse={[
                        {
                          pattern: /USD/,
                          style: {
                            color: theme.colors.mainDark,
                            ...theme.fonts.SourceSansPro_Regular_14,
                          },
                        },
                      ]}
                    >
                      {' ' + 'MYR'}
                    </ParsedText>
                  </View>
                  <Text
                    style={{
                      ...theme.fonts.SourceSansPro_Regular_14,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                      color: theme.colors.bodyTextColor,
                      marginLeft: responsiveWidth(6),
                    }}
                    numberOfLines={1}
                  >
                    {date || ''}
                  </Text>
                </View>
                <Text
                  style={{
                    ...theme.fonts.SourceSansPro_SemiBold_14,
                    color: theme.colors.mainDark,
                  }}
                >
                  {item?.dr_cr
                    ?.split(' ')
                    .map((word) => word.toUpperCase())
                    .join(' ') || 'N/A'}
                </Text>
              </View>
            ) : null;
          })}
        </>
        {/* )} */}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingHorizontal: 20}}
        >
          {renderDeposits()}
        </ScrollView>
      </>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(73)}}>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(3)}} />
    </components.SafeAreaView>
  );
};

export default Deposit;
