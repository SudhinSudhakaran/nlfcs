/**
    * Purpose:* Create Announcement Detail screen
              * display Selected Announcements with description
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */

import {
  View,
  Text,
  ScrollView,
  Keyboard,
  Alert,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';

import {Images, theme} from '../constants';
import {components} from '../components';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useRoute} from '@react-navigation/native';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setUserDetails} from '../store/userSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {useDispatch, useSelector} from 'react-redux';
import {setAnnouncementLoading} from '../store/announcementSlice';
import HTMLView from 'react-native-htmlview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {svg} from '../assets/svg';

import {setScreen} from '../store/tabSlice';
import BottomBar from './BottomBar';

const announcements = [
  {
    id: 1,
    title: 'Education Home Loan',
    status:
      'THE MOST PREFERRED HOME LOAN PROVIDER" voted in AWAAZ Consumer Awards along with the MOST PREFERRED BANK AWARD in a survey conducted by TV 18 in association with AC Nielsen-ORG Marg in 21 cities across India. SBI Home Loans come to you on the solid foundation of trust and transparency built in the tradition of SBI. It includes options for purchase of ready built property, purchase of under construction property, purchase of pre-owned homes, construction of a house, extension of house and repair/renovation',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 2,
    title: 'Eligibility Requirements',
    status:
      'Our general eligibility requirements include that you have financial need, are a U.S. citizen or eligible noncitizen, and are enrolled in an eligible degree or certificate program at your college or career school. There are more eligibility requirements you must meet to qualify for federal student aid.',
    date: 'Apr 10, 2023 at 12:47 PM',
  },
  {
    id: 3,
    title: 'Regular Home Loan',
    status:
      'THE MOST PREFERRED HOME LOAN PROVIDER" voted in AWAAZ Consumer Awards along with the MOST PREFERRED BANK AWARD in a survey conducted by TV 18 in association with AC Nielsen-ORG Marg in 21 cities across India. SBI Home Loans come to you on the solid foundation of trust and transparency built in the tradition of SBI. It includes options for purchase of ready built property, purchase of under construction property, purchase of pre-owned homes, construction of a house, extension of house and repair/renovation',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 4,
    title: 'New Loans',
    status:
      'THE MOST PREFERRED HOME LOAN PROVIDER" voted in AWAAZ Consumer Awards along with the MOST PREFERRED BANK AWARD in a survey conducted by TV 18 in association with AC Nielsen-ORG Marg in 21 cities across India. SBI Home Loans come to you on the solid foundation of trust and transparency built in the tradition of SBI. It includes options for purchase of ready built property, purchase of under construction property, purchase of pre-owned homes, construction of a house, extension of house and repair/renovation',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 5,
    title: 'Conditions',
    status:
      'THE MOST PREFERRED HOME LOAN PROVIDER" voted in AWAAZ Consumer Awards along with the MOST PREFERRED BANK AWARD in a survey conducted by TV 18 in association with AC Nielsen-ORG Marg in 21 cities across India. SBI Home Loans come to you on the solid foundation of trust and transparency built in the tradition of SBI. It includes options for purchase of ready built property, purchase of under construction property, purchase of pre-owned homes, construction of a house, extension of house and repair/renovation',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
];

const AnnouncementDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  //Redux states
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
  useEffect(() => {
    dispatch(setAnnouncementLoading(true));
    if (announcementDetails !== null || announcementDetails !== undefined) {
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
  //shimmer for Announcement Description
  const AnnouncementLoader = () => (
    <ContentLoader
      speed={1.5}
      width={'200%'}
      height={1000}
      marginTop={responsiveHeight(1)}
      backgroundColor={'#F6FFF8'}
      foregroundColor={'#D9D9D9'}
      animate={true}
    >
      <Rect x='2%' y='10' rx='5' ry='5' width='45%' height='800' />
    </ContentLoader>
  );
  //Displayed back button and title
  const renderHeader = () => {
    return (
      <View>
        <View>
          <>
            <components.Header
              goBack
              title={route?.params?.item?.name || ''}
              backstyle={{
                marginRight: responsiveHeight(40),
                left: responsiveWidth(0),
                marginTop: 49,
              }}
              numberOfLines={2}
              titleStyle={{
                marginRight: responsiveHeight(5),
                width: responsiveWidth(80),
                marginTop: 15,
                left: 80,
                top: responsiveHeight(1),
                position: 'absolute',
              }}
            />
          </>
        </View>
      </View>
    );
  };

  /** Purpose: Curresponding Announcement details displayed
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26-06-2023
   * Steps:
   *1. checked with condition
   *if announcementLoading === true displayed benefit loader else displyed Announcement description
   *2. announcementdetail perform as redux state
   * maped function declared=> announcementdetail array to return object
   *id get from mapping stored a variable.then
   *checked with parameter passed from Announcement screen
   *if true curresponding Announcement detail descption displayed
   */
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          marginTop: responsiveHeight(4),
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
      >
        {/* {announcementLoading === true ? (
          <AnnouncementLoader />
        ) : ( */}
        <View>
          <>
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
                  marginBottom: theme.sizes.marginBottom_20,
                  marginTop: responsiveHeight(2),
                }}
              >
                <Text
                  style={{
                    ...theme.fonts.SourceSansPro_Regular_12,
                    lineHeight:
                      theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
                    color: theme.colors.bodyTextColor,
                  }}
                >
                  {route?.params?.item?.announcement_body.replace(
                    /<[^>]+>/g,
                    '',
                  ) || ''}
                </Text>
              </View>
              {route?.params?.item?.attachment !== '' ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: responsiveHeight(2),
                  }}
                >
                  <Image
                    source={{
                      uri: 'http://' + route?.params?.item?.attachment_path,
                    }}
                    style={{width: 100, height: 100}}
                  />
                </View>
              ) : null}
            </View>
          </>
        </View>
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

export default AnnouncementDetails;
