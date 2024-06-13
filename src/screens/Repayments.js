/**
    * Purpose:* Create Reapayments tab screen
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
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import ParsedText from 'react-native-parsed-text';

import {components} from '../components';
import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import {useRoute} from '@react-navigation/native';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setLoansLoading} from '../store/loansSlice';
import {useDispatch, useSelector} from 'react-redux';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import EmptyRepayments from './emptyLoan/EmptyRepayments';
import BottomBar from './BottomBar';

const loans = [
  {
    id: 1,
    LoanID: '11001',
    Date: '23 April 2023',
    Interest: '4%',
    Amounttopay: '1800',
    LatePenalty: '1500',
  },
  {
    id: 2,
    LoanID: '11034',
    Date: '20 April 2023',
    Interest: '8%',
    Amounttopay: '1800',
    LatePenalty: '1500',
  },
];

const Repayments = ({navigation}) => {
  const [type, setType] = useState('Repayments');
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
      <components.Header
        goBack={true}
        title={type}
        titleStyle={{position: 'absolute', left: 40}}
        backstyle={{right: 180}}
      />
    );
  };

  const renderContent = () => {
    return loansLoading === true ? (
      <LoanDetailsLoader />
    ) : (
      <ScrollView contentContainerStyle={{marginBottom: responsiveHeight(2)}}>
        {loansDetails?.map((items, index) => {
          var repayment = items?.payments;
          return (
            <View key={index}>
              {route?.params?.loanId === items.loan_id ? (
                <View key={index}>
                  {repayment?.length > 0 ? (
                    repayment?.map((item, index) => {
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
                              Date
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
                              {item?.paid_at || ''}
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
                              Interest
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
                              {item?.interest || ''}
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
                              Amount to Pay
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
                              {item?.amount_to_pay || ''}
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
                              Late Penalty
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
                              {item?.late_penalties || ''}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <EmptyRepayments />
                  )}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

export default Repayments;
