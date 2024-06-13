/**
    * Purpose:* Create bottom bar
              * display bottom bar with tabs
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 30 June 2023

    */
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';

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
import {
  setAnnouncementTab,
  setDashboardTab,
  setDepositTab,
  setDocumentTab,
  setFAQTab,
} from '../store/bottomTabSlice';
import LinearGradient from 'react-native-linear-gradient';
const tabs = [
  {
    name: 'Dashboard',
    icon: svg.DashboardSvg,
  },
  {
    name: 'Deposit',
    icon: svg.WalletSvg,
  },
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
];
const BottomBar = ({style}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const screen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;
  const announcementTab = useSelector(
    (state) => state.bottomTab.announcementTab,
  );
  const dashboardTab = useSelector((state) => state.bottomTab.dashboardTab);
  const depositTab = useSelector((state) => state.bottomTab.depositTab);
  const faqTab = useSelector((state) => state.bottomTab.faqTab);
  const documentTab = useSelector((state) => state.bottomTab.documentTab);
  useEffect(() => {
    dispatch(setAnnouncementTab(false));
    dispatch(setDepositTab(false));
    dispatch(setFAQTab(false));
    dispatch(setDashboardTab(false));
    dispatch(setDocumentTab(false));
  }, []);
  const AnnouncemntNavigation = () => {
    dispatch(setAnnouncementTab(true));
    dispatch(setDepositTab(false));
    dispatch(setFAQTab(false));
    dispatch(setDashboardTab(false));
    dispatch(setDocumentTab(false));
    navigation.navigate('Announcements');
  };
  const DocumentNavigation = () => {
    dispatch(setAnnouncementTab(false));
    dispatch(setDepositTab(false));
    dispatch(setFAQTab(false));
    dispatch(setDashboardTab(false));
    dispatch(setDocumentTab(true));
    navigation.navigate('Documents');
  };
  const FAQNavigation = () => {
    dispatch(setAnnouncementTab(false));
    dispatch(setDepositTab(false));
    dispatch(setFAQTab(true));
    dispatch(setDashboardTab(false));
    dispatch(setDocumentTab(false));
    navigation.navigate('FAQ');
  };
  const DepositNavigation = () => {
    dispatch(setAnnouncementTab(false));
    dispatch(setDepositTab(true));
    dispatch(setFAQTab(false));
    dispatch(setDocumentTab(false));
    dispatch(setDashboardTab(false));
    navigation.navigate('Deposit');
  };
  const DashboardNavigation = () => {
    dispatch(setAnnouncementTab(false));
    dispatch(setDepositTab(false));
    dispatch(setDocumentTab(false));
    dispatch(setFAQTab(false));
    dispatch(setDashboardTab(true));
    navigation.navigate('TabNavigator');
  };
  const renderBottomTab = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: theme.colors.newRoundBgColor,

            height: responsiveHeight(8),
          }}
        >
          {dashboardTab === true ? (
            <LinearGradient
              start={{x: 0.0, y: 0.0}}
              end={{x: 0.5, y: 1.7}}
              colors={[
                theme.colors.newRoundBgColor,
                theme.colors.newPrimaryColor,
              ]}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <Image source={Images.HOME_ICON} style={{tintColor: 'white'}} />
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                DashboardNavigation();
              }}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={Images.HOME_ICON}
                style={{tintColor: theme.colors.newPrimaryColor}}
              />
            </TouchableOpacity>
          )}
          {depositTab === true ? (
            <LinearGradient
              start={{x: 0.0, y: 0.0}}
              end={{x: 0.5, y: 1.7}}
              colors={[
                theme.colors.newRoundBgColor,
                theme.colors.newPrimaryColor,
              ]}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <Image source={Images.WALLET} style={{tintColor: 'white'}} />
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                DepositNavigation();
              }}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={Images.WALLET}
                style={{tintColor: theme.colors.newPrimaryColor}}
              />
            </TouchableOpacity>
          )}
          {documentTab === true ? (
            <LinearGradient
              start={{x: 0.0, y: 0.0}}
              end={{x: 0.5, y: 1.7}}
              colors={[
                theme.colors.newRoundBgColor,
                theme.colors.newPrimaryColor,
              ]}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <Image source={Images.DOCS} style={{tintColor: 'white'}} />
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                DocumentNavigation();
              }}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={Images.DOCS}
                style={{tintColor: theme.colors.newPrimaryColor}}
              />
            </TouchableOpacity>
          )}
          {announcementTab === true ? (
            <LinearGradient
              start={{x: 0.0, y: 0.0}}
              end={{x: 0.5, y: 1.7}}
              colors={[
                theme.colors.newRoundBgColor,
                theme.colors.newPrimaryColor,
              ]}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <Image source={Images.MIC_ICON} style={{tintColor: 'white'}} />
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                AnnouncemntNavigation();
              }}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={Images.MIC_ICON}
                style={{tintColor: theme.colors.newPrimaryColor}}
              />
            </TouchableOpacity>
          )}
          {faqTab === true ? (
            <LinearGradient
              start={{x: 0.0, y: 0.0}}
              end={{x: 0.5, y: 1.7}}
              colors={[
                theme.colors.newRoundBgColor,
                theme.colors.newPrimaryColor,
              ]}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <Image source={Images.NEW_FAQ} style={{tintColor: 'white'}} />
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                FAQNavigation();
              }}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={Images.NEW_FAQ}
                style={{tintColor: theme.colors.newPrimaryColor}}
              />
            </TouchableOpacity>
          )}
        </View>
        {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.mainDark,
          borderRadius: 14,
          height: 63,
          paddingHorizontal: 10,
          marginHorizontal: 20,
          marginTop: responsiveHeight(23),
          ...style,
        }}
      >
        {tabs.map((tab, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                paddingHorizontal: 16,
                height: '100%',
                justifyContent: 'center',
              }}
              onPress={() =>
                tab.name === 'Notification'
                  ? AnnouncemntNavigation()
                  : tab.name === 'DigiLocker'
                  ? DocumentNavigation()
                  : tab.name === 'FAQ'
                  ? FAQNavigation()
                  : tab.name === 'Dashboard'
                  ? DashboardNavigation()
                  : tab.name === 'Deposit'
                  ? DepositNavigation()
                  : dispatch(setScreen(tab.name))
              }
            >
              <View>
                {tab.name === 'Notification' ? (
                  <Image
                    style={{
                      marginTop: responsiveHeight(0),
                      alignSelf: 'center',
                      width: 23,
                      height: 20,
                      tintColor:
                        announcementTab === true
                          ? theme.colors.mainColor
                          : theme.colors.white,
                    }}
                    source={Images.ANNOUNCEMENT_ICON}
                  />
                ) : tab.name === 'DigiLocker' ? (
                  <Image
                    style={{
                      marginTop: responsiveHeight(0),
                      alignSelf: 'center',
                      width: 23,
                      height: 20,
                      tintColor:
                        documentTab === true
                          ? theme.colors.mainColor
                          : theme.colors.white,
                    }}
                    source={Images.DOCUMENTS}
                  />
                ) : tab.name === 'FAQ' ? (
                  <Image
                    style={{
                      marginTop: responsiveHeight(0),
                      alignSelf: 'center',
                      width: 23,
                      height: 20,
                      tintColor:
                        faqTab === true
                          ? theme.colors.mainColor
                          : theme.colors.white,
                    }}
                    source={Images.FAQ}
                  />
                ) : tab.name === 'Dashboard' ? (
                  <tab.icon
                    color={
                      dashboardTab === true
                        ? theme.colors.mainColor
                        : theme.colors.white
                    }
                  />
                ) : (
                  <tab.icon
                    color={
                      depositTab === true
                        ? theme.colors.mainColor
                        : theme.colors.white
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View> */}
      </>
    );
  };
  const homeIndicatorSettings = () => {
    if (homeIndicatorHeight !== 0) {
      return homeIndicatorHeight;
    }
    if (homeIndicatorHeight === 0) {
      return 20;
    }
  };
  return <components.SafeAreaView>{renderBottomTab()}</components.SafeAreaView>;
};
export default BottomBar;
