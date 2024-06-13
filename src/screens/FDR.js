/**
    * Purpose:* Create Loan List screen
              * display List of loans
              * add navigation from each loan
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import ParsedText from 'react-native-parsed-text';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import {components} from '../components';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import {Keyboard} from 'react-native';
import Utilities from '../helpers/utils/Utilities';
import {Alert} from 'react-native';
import DataManager from '../helpers/apiManager/DataManager';
import {setLoansDetails, setLoansLoading} from '../store/loansSlice';
import LoanDetails from './LoanDetails';
import {useDispatch, useSelector} from 'react-redux';
import {BackHandler} from 'react-native';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import moment from 'moment';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import BottomBar from './BottomBar';
import {setFdrDetails, setFdrLoading, setFrdLoading} from '../store/fdrSlice';
//demo array
const Deposits = [
  {
    id: 1,
    depositId: 2,
    name: 'Yearly',
    date: '2023-07-08',
    depositamount: '6,000.00',
    returnamount: '6,480.00',
    currency: 'MYR',
    mature_date: '2025-07-05',
  },
  {
    id: 2,
    depositId: 3,
    name: 'Monthly Plan',
    date: '2023-07-07',
    depositamount: '4,000.00',
    returnamount: '5,480.00',
    currency: 'MYR',
    mature_date: '2025-07-03',
  },
];

const FDR = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  /**Redux States
   * For Storing loan details from loan Api
   */
  const fdrDetails = useSelector((state) => state.fdrDetails.fdrDetails);
  const fdrLoading = useSelector((state) => state.fdrDetails.fdrLoading);

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
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        //loading shows before showing details
        dispatch(setFdrLoading(true));
      }, 1000);
      //call loan Api
      getFdrs();
    }, []),
  );
  //shimmer for Fdr list
  const FdrListLoader = () => (
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
    </ContentLoader>
  );
  /**
 * Purpose: Get Loans List
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 14 Jun 2023
 * Steps:
   1.fetch Loan list from API and append to state variable
*/
  const getFdrs = () => {
    dispatch(setFdrLoading(true));
    var formdata = new FormData();
    DataManager.getFdrs(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true && data?.status !== 'Token is Invalid') {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          dispatch(setFdrDetails(data));
          console.log('555', fdrDetails);
          setTimeout(() => {
            dispatch(setFdrLoading(false));
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
            dispatch(setFdrLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast('Failed', data.status, 'error', 'bottom');
        setTimeout(() => {
          dispatch(setFdrLoading(false));
        }, 1000);
      }
    });
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
  //Displayed back button and title
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'FDRs'}
        backstyle={{
          marginRight: responsiveHeight(3),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(33),
          marginTop: 18,
        }}
      />
    );
  };
  /** Purpose: Loan list UI
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
  1. checked with condition
     *if loansLoading === true displayed loanlistloader else displyed loan list
  2. loansDetails perform as redux state
     * maped function declared=> loan list array to return object
  3. Touchable action navigate to curresponding Collateral tab
     * passed parameter such as curresponding loanid passed through navigation
   */
  const renderContent = () => {
    return (
      <View
        style={{
          paddingHorizontal: responsiveScreenWidth(4),
        }}
      >
        {/* {fdrLoading === true ? (
          <FdrListLoader />
        ) : ( */}
        <>
          <Text
            style={{
              marginBottom: theme.sizes.marginBottom_30,
              top: responsiveHeight(2),
              left: responsiveWidth(3),
              ...theme.fonts.SourceSansPro_Regular_16,
              lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            Current FDRs
          </Text>
          {fdrDetails.map((item, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.colors.lightGrey,
                    borderRadius: 10,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        marginRight: 8,
                      }}
                    >
                      <svg.PercentageLoanSvg />
                    </View>
                    <ParsedText
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_16,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                      parse={[
                        {
                          pattern: /00 USD/,
                          style: {...theme.fonts.SourceSansPro_Regular_14},
                        },
                      ]}
                    >
                      {item?.deposit_amount + ' ' + 'MYR' || ''}{' '}
                    </ParsedText>
                  </View>
                </View>
                <View style={{paddingHorizontal: 20}}>
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
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
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
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {item?.plan?.name || ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Rate
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {item?.plan?.interest_rate || ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Mature Date
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {item?.mature_date || ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        textTransform: 'capitalize',
                        color: theme.colors.bodyTextColor,
                      }}
                    >
                      Status
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {item?.status || ''}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </>
        {/* )} */}
      </View>
    );
  };

  return (
    <>
      <components.SafeAreaView>
        <ScrollView style={{height: responsiveHeight(75)}}>
          {renderHeader()}
          {renderContent()}
        </ScrollView>
        <BottomBar style={{marginTop: responsiveHeight(0)}} />
      </components.SafeAreaView>
    </>
  );
};

export default FDR;
