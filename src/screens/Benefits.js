/**
    * Purpose:* Create Benefits screen
              * display Benefit list
              * add navigate to details
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import {components} from '../components';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import StorageManager from '../helpers/storageManager/StorageManager';
import {Keyboard} from 'react-native';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import Utilities from '../helpers/utils/Utilities';
import {Alert} from 'react-native';
import DataManager from '../helpers/apiManager/DataManager';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setBenefitDetails, setBenefitLoading} from '../store/benefitSlice';

import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import BottomBar from './BottomBar';

//demo array
const loans = [
  {
    id: 1,
    minusBalance: '- 20 532.00',
    loanName: 'Housing Loan',
    rate: '13 %',
    loanAmount: '50000',
    period: '24 months',
    monthlyPayment: '1117.00',
    totalPaid: '4468.00',
    currency: 'USD',
  },
  {
    id: 2,
    minusBalance: '- 20 532.00',
    loanName: 'Education Loan',
    rate: '10 %',
    loanAmount: '50000',
    period: '48 months',
    monthlyPayment: '10000.00',
    totalPaid: '4468.00',
    currency: 'USD',
  },
  {
    id: 3,
    minusBalance: '- 20 532.00',
    loanName: 'Car Loan',
    rate: '10 %',
    loanAmount: '500000',
    period: '48 months',
    monthlyPayment: '10000.00',
    totalPaid: '4468.00',
    currency: 'USD',
  },
];

const Benefits = () => {
  const navigation = useNavigation();
  //Redux states
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const benefitDetails = useSelector(
    (state) => state.benefitDetails.benefitDetails,
  );
  const benefitLoading = useSelector(
    (state) => state.benefitDetails.benefitLoading,
  );

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
        //initially loading set as true
        dispatch(setBenefitLoading(true));
      }, 1000);
      //call benefit api
      getBenefitDetails();
    }, []),
  );
  //shimmer for benefit list
  const BenefitLoader = () => (
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
  /**
 * Purpose: Get Benefit Detail
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 14 Jun 2023
 * Steps:
   1.fetch user details from API and append to state variable
*/
  const getBenefitDetails = () => {
    dispatch(setBenefitLoading(true));
    var formdata = new FormData();
    DataManager.getBenefitDetails(formdata).then(
      ([isSuccess, message, data]) => {
        console.log('data', data);
        if (isSuccess === true && data?.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data.status !== 'Token is Expired'
          ) {
            dispatch(setBenefitDetails(data));
            setTimeout(() => {
              dispatch(setBenefitLoading(false));
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
              dispatch(setBenefitLoading(false));
            }, 1000);
          }
        } else {
          Utilities.showToast('Failed', data.status, 'error', 'bottom');
          setTimeout(() => {
            dispatch(setBenefitLoading(false));
          }, 1000);
        }
      },
    );
  };
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
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
  //Displayed back button and title
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'Benefits'}
        backstyle={{
          marginRight: responsiveHeight(3),
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
  /** Purpose:  Navigation from each benefit list
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   *1.passed 2 parameters such as id and password stored in 2 variables
   *2. Navigate to Benefit Details
   */
  const BenefitNavigation = (id, name) => {
    navigation.navigate('BenefitsDetail', {item: id, name: name});
  };
  /** Purpose: benefit list displayed
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   *1. checked with condition
   *if benefitLoading === true displayed benefit loader else displyed benefit list
   *2. benefitdetail perform as redux state
   * maped function declared=> benefitdetails array to return object
   *3.Touchable action navigate to curresponding benefit details
   */
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          marginTop: responsiveHeight(2),
        }}
      >
        {/* {benefitLoading === true ? (
          <BenefitLoader />
        ) : ( */}
        <>
          {benefitDetails.map((item, index) => {
            var user_id = item?.user_id;
            var id = item?.id;
            var name = item?.scheme?.name;
            return user_id === userDetails?.id ? (
              <View key={index}>
                <View
                  style={{}}
                  // onPress={() => BenefitNavigation(id, name)}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f5f5ef',
                      borderRadius: 10,
                      padding: 20,
                      marginTop: responsiveHeight(1.5),
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          ...theme.fonts.SourceSansPro_Regular_14,
                          lineHeight:
                            theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                          textTransform: 'capitalize',
                          color: theme.colors.bodyTextColor,
                        }}
                      >
                        {item?.scheme?.name || ''}
                      </Text>
                      <Text
                        style={{
                          ...theme.fonts.SourceSansPro_Regular_14,
                          lineHeight:
                            theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                          textTransform: 'capitalize',
                          color: theme.colors.bodyTextColor,
                        }}
                      >
                        {item?.status || ''}
                      </Text>
                    </View>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                      }}
                    >
                      {item?.amount || ''}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null;
          })}
        </>
        {/* )} */}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(75)}}>
        {renderHeader()}
        {benefitDetails?.status !== 'Token is Invalid' ? renderContent() : null}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};

export default Benefits;
