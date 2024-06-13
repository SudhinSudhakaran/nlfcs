/**
    * Purpose:* Create Collateral tab screen
              * display tab with details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import RepaymentsSchedule from './RepaymentsSchedule';
import Repayments from './Repayments';
import {useRoute} from '@react-navigation/native';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setLoansLoading} from '../store/loansSlice';
import {useDispatch, useSelector} from 'react-redux';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import EmptyCollateral from './emptyLoan/EmptyCollateral';
import BottomBar from './BottomBar';

const loans = [
  {
    id: 1,
    LoanID: '11001',
    Name: 'Nithin',
    CollateralType: 'aaa',
    SerailNumber: '111',
    EstimatedPrice: '1500',
  },
  {
    id: 2,
    LoanID: '11034',
    Name: 'Anu',
    CollateralType: 'aaa',
    SerailNumber: '111',
    EstimatedPrice: '1500',
  },
  {
    id: 3,
    Name: 'Arun',
    CollateralType: 'aaa',
    SerailNumber: '111',
    EstimatedPrice: '1500',
  },
];

const Collateral = ({navigation}) => {
  const [type, setType] = useState('Collateral');
  const route = useRoute();
  const dispatch = useDispatch();
  const loansDetails = useSelector((state) => state.loansDetails.loansDetails);
  const loansLoading = useSelector((state) => state.loansDetails.loansLoading);
  useEffect(() => {
    dispatch(setLoansLoading(true));
    if (loansDetails !== null || loansDetails !== undefined) {
      setTimeout(() => {
        dispatch(setLoansLoading(false));
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
    }
  }, []);
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   *1. Cleared User details,autherization,email,token from storage
   *2. Navigate to SignIn
   */
  const performSessionExpired = () => {
    Globals.USER_DETAILS = {};
    Globals.IS_AUTHORIZED = false;
    Globals.TOKEN = '';
    Globals.USER_EMAIL = '';
    dispatch(setIsAuthorized(false));
    StorageManager.clearUserRelatedData();
    Keyboard.dismiss();
    //Navigate to SignIn
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };
  //shimmer for Loan list
  const LoanDetailsLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'200%'}
      height={1000}
      marginTop={responsiveHeight(1)}
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='2%' y='20' rx='5' ry='5' width='45%' height='150' />
      <Rect x='2%' y='180' rx='5' ry='5' width='45%' height='150' />
      <Rect x='2%' y='340' rx='5' ry='5' width='45%' height='150' />
    </ContentLoader>
  );
  const renderHeader = () => {
    return (
      <View style={{padding: 20, flexDirection: 'row'}}>
        <components.Header
          goBack={true}
          title={type}
          backstyle={{bottom: responsiveHeight(2.7), right: 20}}
          titleStyle={{
            marginBottom: responsiveScreenHeight(2),
          }}
        />
      </View>
    );
  };

  const renderType = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          bottom: 10,
          marginHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: responsiveWidth(4),
            borderBottomWidth: 1,
            borderBottomColor:
              type === 'Collateral' ? theme.colors.mainDark : 'transparent',
          }}
          onPress={() => setType('Collateral')}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              textTransform: 'capitalize',
              fontSize: theme.fonts.SourceSansPro_Regular_14.fontSize * 1,
            }}
          >
            Collateral
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            right: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor:
              type === 'Schedules' ? theme.colors.mainDark : 'transparent',
          }}
          onPress={() => setType('Schedules')}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.3,
              textTransform: 'capitalize',
              fontSize: theme.fonts.SourceSansPro_Regular_14.fontSize * 1,
            }}
            numberOfLines={2}
          >
            Schedules
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            right: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor:
              type === 'Repayments' ? theme.colors.mainDark : 'transparent',
          }}
          onPress={() => setType('Repayments')}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              textTransform: 'capitalize',
              fontSize: theme.fonts.SourceSansPro_Regular_14.fontSize * 1,
            }}
          >
            Repayments
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        {type === 'Collateral' ? (
          loansLoading === true ? (
            <LoanDetailsLoader />
          ) : (
            <ScrollView contentContainerStyle={{}}>
              {loansDetails?.map((items, index) => {
                var collaterals = items?.collaterals;
                return (
                  <View key={index}>
                    {route?.params?.loanId === items?.loan_id ? (
                      <View key={index}>
                        {collaterals?.length > 0 ? (
                          collaterals?.map((item, index) => {
                            return (
                              <View
                                style={{
                                  paddingHorizontal: 20,
                                  backgroundColor: '#f5f5ef',
                                  borderRadius: 10,
                                  marginTop: responsiveHeight(1),
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: responsiveHeight(2),
                                    marginBottom: theme.sizes.marginBottom_14,
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      textTransform: 'capitalize',
                                      color: theme.colors.bodyTextColor,
                                    }}
                                  >
                                    Name
                                  </Text>
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      color: theme.colors.mainDark,
                                    }}
                                  >
                                    {item?.name || ''}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: theme.sizes.marginBottom_14,
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      textTransform: 'capitalize',
                                      color: theme.colors.bodyTextColor,
                                    }}
                                  >
                                    Collateral Type
                                  </Text>
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      color: theme.colors.mainDark,
                                    }}
                                  >
                                    {item?.collateral_type || ''}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: theme.sizes.marginBottom_14,
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      textTransform: 'capitalize',
                                      color: theme.colors.bodyTextColor,
                                    }}
                                  >
                                    Serail Number
                                  </Text>
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      color: theme.colors.mainDark,
                                    }}
                                  >
                                    {item?.serial_number || ''}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: theme.sizes.marginBottom_14,
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      textTransform: 'capitalize',
                                      color: theme.colors.bodyTextColor,
                                    }}
                                  >
                                    Estimated Price
                                  </Text>
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_14,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_14
                                          .fontSize * 1.6,
                                      color: theme.colors.mainDark,
                                    }}
                                  >
                                    {item?.estimated_price || ''}
                                  </Text>
                                </View>
                              </View>
                            );
                          })
                        ) : (
                          <EmptyCollateral />
                        )}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </ScrollView>
          )
        ) : type === 'Schedules' ? (
          <RepaymentsSchedule />
        ) : type === 'Repayments' ? (
          <Repayments />
        ) : (
          <Collateral />
        )}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(78)}}>
        {renderHeader()}
        {renderType()}
        {renderContent()}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};

export default Collateral;
