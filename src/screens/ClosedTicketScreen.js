/**
    * Purpose:* Create Replay screen
              * add like conversation
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';

import {components} from '../components';
import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import EditPersonalInfo from './EditPersonalInfo';
import Textarea from 'react-native-textarea/src/Textarea';
import {useRoute} from '@react-navigation/native';
import Images from '../constants/Images';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions} from '../helpers/utils/Permission';
import DisplayUtils from '../helpers/utils/DisplayUtils';
import {BackHandler} from 'react-native';
import {setScreen} from '../store/tabSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Keyboard} from 'react-native';
import APIConnections from '../helpers/apiManager/APIConnections';
import DataManager from '../helpers/apiManager/DataManager';
import Utilities from '../helpers/utils/Utilities';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import {
  setMyTicketsClosedDetails,
  setMyTicketsDetails,
  setMyTicketsLoading,
} from '../store/myTicketSlice';
import ImageViewer from 'react-native-image-viewing-rtl';
import BottomBar from './BottomBar';

//demo array
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
const conversations = [
  {
    id: 1,
    ticketname: 'test ticket',
    link: 'completed',
    name: 'Nithin',
  },
];
const response = [
  {
    id: 2,
    ticketname: 'test response',
    link: 'completed',
    name: 'Admin',
  },
];
const ClosedTicketScreen = ({navigation}) => {
  const [imageList, setImageList] = useState([]);
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState('');
  const [showFullScreenDoc, setFullScreenDoc] = useState(false);
  const dispatch = useDispatch();
  const route = useRoute();
  //Redux states for storing ticket details
  const myTicketsClosedDetails = useSelector(
    (state) => state.myTicketsDetails.myTicketsClosedDetails,
  );
  useEffect(() => {
    Globals.TICKET_ID = route?.params?.id;
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
  });
  const backButtonAction = () => {
    //navigate to back
    navigation.goBack();
  };
  const renderHeader = () => {
    return (
      <View>
        <components.Header
          goBackFromTickets
          onPress={() => {
            backButtonAction();
          }}
          title='Conversations'
          backstyle={{
            marginRight: responsiveHeight(35),
            bottom: responsiveHeight(1),
          }}
          titleStyle={{
            marginRight: responsiveHeight(20),
            position: 'absolute',
            right: responsiveHeight(2),
            top: DisplayUtils.setHeight(2),
          }}
        />
      </View>
    );
  };

  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 30-06-2023
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
  const AttachmentView = (item) => {
    setFullScreenDoc(true);
    setAttachment(item);
  };
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          marginHorizontal: 6,
          marginTop: 10,
        }}
      >
        {myTicketsClosedDetails?.map((item, index, array) => {
          const last = array.length === index + 1;
          return (
            <>
              {item?.messages?.map((userMessage) => {
                return (
                  <>
                    {route?.params?.id !==
                    userMessage?.support_ticket_id ? null : (
                      <View style={{flexDirection: 'row'}}>
                        {userMessage?.sender_id !== item?.user_id ? (
                          <View
                            style={{
                              position: 'absolute',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}
                          >
                            <Image
                              style={{
                                alignSelf: 'center',
                                marginLeft: responsiveHeight(37.5),
                                width: responsiveHeight(6),
                                marginTop: responsiveHeight(5),
                                borderRadius: 40,
                                height: responsiveHeight(6),
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              source={{
                                uri:
                                  'http://' +
                                  userMessage?.sender?.profile_picture,
                              }}
                            />
                            <Image
                              style={{
                                alignSelf: 'center',
                                position: 'absolute',
                                width: responsiveWidth(10),
                                top: responsiveHeight(6),
                                height: responsiveHeight(6),
                                marginLeft: responsiveWidth(66),
                                tintColor: theme.colors.lightGrey,
                              }}
                              source={Images.GREATER_THAN_ICON}
                            />
                            <Image
                              style={{
                                marginTop: responsiveHeight(0),
                                alignSelf: 'center',
                                top: responsiveHeight(8),
                                position: 'absolute',
                                width: 23,
                                height: 15,
                                left: responsiveWidth(69),
                                tintColor: theme.colors.white,
                              }}
                              source={Images.LINE_ICON}
                            />
                          </View>
                        ) : (
                          <View
                            style={{
                              right: 20,
                              alignItems: 'center',
                              paddingHorizontal: 20,
                              marginTop: 40,
                            }}
                          >
                            <Image
                              style={{
                                alignSelf: 'center',
                                right: 10,
                                width: responsiveHeight(6),
                                borderRadius: 40,
                                height: responsiveHeight(6),
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: responsiveHeight(1),
                              }}
                              source={{
                                uri:
                                  'http://' +
                                  userMessage?.sender?.profile_picture,
                              }}
                            />
                            <Image
                              style={{
                                alignSelf: 'center',
                                position: 'absolute',
                                width: responsiveWidth(3),
                                top: responsiveHeight(2),
                                height: responsiveHeight(4),
                                left: responsiveWidth(16),
                                tintColor: theme.colors.lightGrey,
                              }}
                              source={Images.LESS_THAN_ICON}
                            />
                            <Image
                              style={{
                                marginTop: responsiveHeight(0),
                                alignSelf: 'center',
                                top: 22,
                                position: 'absolute',
                                width: 30,
                                height: 24,
                                left: responsiveWidth(20),
                                tintColor: theme.colors.white,
                              }}
                              source={Images.LINE_ICON}
                            />
                          </View>
                        )}
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              width:
                                userMessage?.sender_id !== item?.user_id
                                  ? '85%'
                                  : '115%',
                              height: 100,
                              backgroundColor: '#f5f5ef',
                              borderRadius: 10,
                              padding: 10,
                              right:
                                userMessage?.sender_id !== item?.user_id
                                  ? 6
                                  : 30,
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 20,
                            }}
                          >
                            <View style={{marginLeft: 14}}>
                              <Text
                                style={{
                                  ...theme.fonts.SourceSansPro_Regular_12,
                                  lineHeight:
                                    theme.fonts.SourceSansPro_Regular_12
                                      .fontSize * 1.6,
                                  color: theme.colors.bodyTextColor,
                                  fontSize:
                                    theme.fonts.SourceSansPro_Regular_12
                                      .fontSize * 1.2,
                                }}
                              >
                                {userMessage?.message}
                              </Text>
                              {userMessage?.attachment === null ? null : (
                                <TouchableOpacity
                                  onPress={() => {
                                    AttachmentView(userMessage?.attachment);
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...theme.fonts.SourceSansPro_Regular_12,
                                      lineHeight:
                                        theme.fonts.SourceSansPro_Regular_12
                                          .fontSize * 1.6,
                                      color: theme.colors.blue,
                                    }}
                                  >
                                    {userMessage?.attachment || ''}
                                  </Text>
                                </TouchableOpacity>
                              )}
                              <Text
                                style={{
                                  ...theme.fonts.SourceSansPro_Regular_12,
                                  lineHeight:
                                    theme.fonts.SourceSansPro_Regular_12
                                      .fontSize * 1.6,
                                  color: theme.colors.bodyTextColor,
                                }}
                              >
                                {userMessage?.sender?.name
                                  ?.split(' ')
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1),
                                  )
                                  .join(' ') || ''}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </>
                );
              })}
            </>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(76)}}>
        {renderHeader()}
        {renderContent()}
        <Modal
          isVisible={showFullScreenDoc}
          onRequestClose={() => setFullScreenDoc(false)}
        >
          <View
            style={{
              backgroundColor: theme.colors.white,
              width: '110.7%',
              right: responsiveHeight(2.5),
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: responsiveHeight(5),
                left: responsiveWidth(90),
              }}
              onPress={() => setFullScreenDoc(false)}
            >
              <Image
                style={{
                  width: 20,
                  height: 20,
                  tintColor: theme.colors.textColor,
                }}
                source={Images.CLOSE_ICON}
              />
            </TouchableOpacity>
            <View style={{marginBottom: responsiveHeight(18)}}>
              <Image
                source={{uri: 'http://' + attachment}}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode='contain'
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textareaContainer: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#f5f5ef',
  },
  messagearea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: '#333',
  },
  textarea: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center', // hack android
    height: responsiveHeight(15),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.7,
  },
});
export default ClosedTicketScreen;
