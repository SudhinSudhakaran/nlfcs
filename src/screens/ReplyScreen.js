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
  PermissionsAndroid,
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
import {setMyTicketsDetails, setMyTicketsLoading} from '../store/myTicketSlice';
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
const ReplyScreen = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [attachment, setAttachment] = useState('');
  const [showFullScreenDoc, setFullScreenDoc] = useState(false);
  const [messageValidation, setMessageValidation] = useState('');
  const imageRef = useRef();
  const screen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const homeIndicatorHeight = insets.bottom;
  //Redux states for storing ticket details
  const myTicketsDetails = useSelector(
    (state) => state.myTicketsDetails.myTicketsDetails,
  );
  const userDetails = useSelector((state) => state.userDetails.userDetails);
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
    if (message !== '') {
      Alert.alert(
        'Review Changes',
        'Do you want to save changes?',
        [
          {
            text: 'No',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => console.log('Cancel Pressed')},
        ],
        {cancelable: false},
      );
    } else {
      //navigate to back
      navigation.goBack();
    }
  };
  const removeImageArray = (_index) => {
    const filteredArray = imageList.filter((item, index) => index !== _index);
    setImageList(filteredArray);
  };
  const Item = ({item, index}) => {
    if (imageList.length > 1) {
      removeImageArray(0);
    }
    return (
      <View style={[]}>
        <Image
          source={{uri: item.uri}}
          style={{
            height: responsiveHeight(7),
            width: responsiveWidth(10),
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: responsiveHeight(1),
            marginTop: responsiveHeight(3),
          }}
        />
        <TouchableOpacity
          onPress={() => removeImageArray(index)}
          style={{
            position: 'absolute',
            bottom: responsiveHeight(5.6),
            width: responsiveHeight(3),
            height: responsiveHeight(3),
            borderRadius: 20,
            backgroundColor: theme.colors.lightGrey,
            left: responsiveWidth(8),
          }}
        >
          <Image
            style={{
              width: responsiveWidth(3),
              height: responsiveHeight(3),
              left: responsiveWidth(1.4),
              tintColor: theme.colors.bodyTextColor,
              resizeMode: 'contain',
            }}
            source={Images.CLOSE_ICON}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const toggleModal = () => {
    setModalVisible(true);
  };
  const Close = () => {
    setModalVisible(false);
  };
  const openCamera = async () => {
    // console.log(' Camera selected');
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA]
        : [PERMISSIONS.ANDROID.CAMERA];

    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    // console.log('isPermissionGranted ===>', isPermissionGranted);
    if (isPermissionGranted) {
      _openCamera();
    } else {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the camera.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };
  const openGallery = async () => {
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.MEDIA_LIBRARY]
        : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] || [
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          ];
    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    if (isPermissionGranted || granted !== 'never_ask_again') {
      _openGallery();
    } else {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the storage.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };
  const _openGallery = () => {
    ImagePicker.openPicker({
      width: 512,
      height: 512,
    })
      .then((image) => {
        let imgArray = [];
        let ImageItem = {
          uri: image.path,
          type: image.mime,
          name:
            Platform.OS === 'ios'
              ? image.filename
              : `my_profile_${Date.now()}.${
                  image.mime === 'image/jpeg' ? 'jpg' : 'png'
                }`,
        };
        imgArray.push(ImageItem);
        let list = [...imgArray];
        setImageList(list);
        setModalVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const _openCamera = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.5,
      width: 512,
      height: 512,
      cropping: true,
      includeBase64: true,
      useFrontCamera: false,
      mediaType: 'photo',
    })
      .then((image) => {
        let ImageItem = {
          uri: image.path,
          type: image.mime,
          name:
            Platform.OS === 'ios'
              ? image.filename
              : `my_profile_${Date.now()}.${
                  image.mime === 'image/jpeg' ? 'jpg' : 'png'
                }`,
        };
        var currentItem = {...imageList, ...ImageItem};
        setImageList([...imageList, currentItem]);
        setModalVisible(false);
      })
      .catch((err) => {
        console.log('catch ==>', err);
      });
  };
  const route = useRoute();
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
  // API CALL
  /**
   * Purpose: Perform Reply Tickets
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 30 Jun 2023
   */

  const performReplyTicket = () => {
    Keyboard.dismiss();
    var formdata = new FormData();
    formdata.append(APIConnections.KEYS.MESSAGE, message);
    if (imageList.length > 0) {
      for (let i = 0; i < imageList.length; i++) {
        formdata.append(APIConnections.KEYS.ATTACHMENT, imageList[i]);
      }
    }
    DataManager.performReplyTicket(formdata).then(
      ([isSuccess, message, data]) => {
        console.log('response data ====>>>>', isSuccess, response);
        if (isSuccess === true && data?.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data.status !== 'Token is Expired'
          ) {
            Utilities.showToast(
              'Success',
              message + ' successfully',
              'success',
              'bottom',
            );
            performMyTicket();
            // navigation.goBack();
            setMessage('');
            setImageList('');
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
        } else {
          Utilities.showToast('Failed', message, 'error', 'bottom');
          Keyboard.dismiss();
        }
      },
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
  /** Purpose:  Validation Function
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 30-06-2023
   * Steps:
   1. Initially set message variables value=0
   2. checked the  fields with conditions
   * conditions are......
   * checked  message length equals zero
   3. if these conditions are false displayed error message
   4. also set declared variable values equal zero if the conditions are false
   5. If the conditions are true set the declared variable values equal one
   6. If conditions true navigate to create tickets api call
   *  */
  const validateField = () => {
    var _isValidMessage = 0;

    if (message.length === 0) {
      setMessageValidation('Message field is required');
      _isValidMessage = 0;
    } else {
      setMessageValidation('');
      _isValidMessage = 1;
    }
    if (_isValidMessage === 1) {
      if (isConnected) {
        performReplyTicket();
      } else {
        Utilities.showToast(
          'Sorry!',
          'Please check your internet connection',
          'error',
          'bottom',
        );
      }
    }
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
          borderColor: '#f5f5ef',
          borderWidth: 3,
          marginHorizontal: 6,
          marginTop: 10,
        }}
      >
        {myTicketsDetails?.map((item, index, array) => {
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
                              source={
                                Images.ADMIN
                                // userMessage?.sender?.profile_picture ||
                              }
                            />
                            <Image
                              style={{
                                alignSelf: 'center',
                                position: 'absolute',
                                width: responsiveWidth(3),
                                top: responsiveHeight(6),
                                height: responsiveHeight(4),
                                marginLeft: responsiveWidth(72),
                                tintColor: theme.colors.lightGrey,
                                transform: [{rotate: '180deg'}],
                              }}
                              source={Images.LESS_THAN_ICON}
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
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_18,
            fontSize: theme.fonts.SourceSansPro_Regular_18.fontSize * 0.9,
            color: theme.colors.mainDark,
            marginTop: responsiveHeight(4),
          }}
        >
          Leave Message
        </Text>
        <Textarea
          containerStyle={styles.textareaContainer}
          style={styles.messagearea}
          placeholder={'Write your message here.....'}
          onChangeText={setMessage}
          value={message}
          // onChangeText={this.onChange}
          // defaultValue={this.state.text}
          // maxLength={120}
          // placeholder={'mm'}
          placeholderTextColor={'#c7c7c7'}
          underlineColorAndroid={'transparent'}
        />
        <Text
          style={{
            marginTop: responsiveHeight(1),
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            color: 'red',
            ...theme.fonts.SourceSansPro_Regular_10,
          }}
        >
          {messageValidation}
        </Text>
        <View
          style={[
            {
              borderStyle: 'dashed',
              width: responsiveWidth(90),
              height: responsiveHeight(10),
              marginTop: responsiveHeight(3),
            },
          ]}
        >
          <TouchableOpacity
            onPress={toggleModal}
            style={{height: responsiveHeight(5), width: responsiveWidth(90)}}
          >
            <View style={{marginTop: responsiveHeight(1)}}>
              <Image
                style={{
                  marginTop: responsiveHeight(0),
                  alignSelf: 'center',
                  position: 'absolute',
                  tintColor: theme.colors.mainDark,
                }}
                source={Images.ADD_IMAGE_ICON}
              />
            </View>
            <View style={{marginTop: 0, flex: 1}}>
              <Image
                style={{
                  marginTop: responsiveHeight(0),
                  alignSelf: 'center',
                  position: 'absolute',
                  tintColor: theme.colors.mainDark,
                }}
                source={Images.IMAGE_ROUND_ICON}
              />
            </View>
            <Text
              style={[
                styles.textarea,
                {marginTop: responsiveHeight(3.5), alignSelf: 'center'},
              ]}
            >
              Add Image
            </Text>
            <Modal
              isVisible={isModalVisible}
              onRequestClose={() => Close()}
              style={{justifyContent: 'flex-end', margin: 0}}
            >
              <View
                style={{
                  height: responsiveHeight(30),
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  margin: 0,
                  backgroundColor: '#ffffff',
                  marginTop: responsiveHeight(50),
                }}
              >
                <View
                  style={{
                    marginTop: responsiveHeight(3),
                    marginLeft: responsiveWidth(4),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      marginLeft: responsiveWidth(0),
                      color: theme.colors.textColor,
                    }}
                  >
                    Select an option
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: responsiveHeight(2),
                  }}
                >
                  <TouchableOpacity onPress={() => openCamera()}>
                    <Image
                      style={{
                        width: responsiveWidth(6),
                        height: responsiveHeight(3),
                        marginLeft: responsiveWidth(2),
                        tintColor: theme.colors.mainDark,
                        position: 'absolute',
                      }}
                      source={Images.CAMERA_ICON}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        marginLeft: responsiveWidth(13),
                        color: theme.colors.textColor,
                      }}
                    >
                      Open Camera
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: responsiveHeight(2),
                  }}
                >
                  <TouchableOpacity onPress={() => openGallery()}>
                    <Image
                      style={{
                        width: responsiveWidth(6),
                        height: responsiveHeight(3),
                        marginLeft: responsiveWidth(2),
                        position: 'absolute',
                        tintColor: theme.colors.mainDark,
                      }}
                      source={Images.ADD_IMAGE_ICON}
                    />
                    <Image
                      style={{
                        marginTop: responsiveHeight(0.5),
                        alignSelf: 'center',
                        position: 'absolute',
                        tintColor: theme.colors.mainDark,
                        left: responsiveWidth(4),
                      }}
                      source={Images.IMAGE_ROUND_ICON}
                    />
                    <Text
                      style={{
                        color: theme.colors.textColor,
                        fontSize: 15,
                        marginLeft: responsiveWidth(13),
                      }}
                    >
                      Open Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => Close()}
                  style={{position: 'absolute'}}
                >
                  <Image
                    style={{
                      width: responsiveWidth(4),
                      height: responsiveHeight(2),
                      tintColor: theme.colors.newPrimaryColor,
                      resizeMode: 'contain',
                      marginTop: responsiveHeight(4),
                      marginLeft: responsiveWidth(90),
                      // position:'absolute'
                    }}
                    source={Images.CLOSE_ICON}
                  />
                </TouchableOpacity>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={imageRef}
          contentContainerStyle={{paddingHorizontal: responsiveWidth(2)}}
          data={imageList}
          renderItem={({item, index}) => <Item item={item} index={index} />}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={(item) => item.id}
        />
        <components.Button
          title='Send message'
          lightShade={true}
          buttonstyle={{
            width: '50%',
            alignSelf: 'center',
            left: responsiveWidth(3),
          }}
          containerStyle={{
            padding: 20,
            marginBottom:
              imageList.length > 0 ? responsiveHeight(0) : responsiveHeight(10),
          }}
          onPress={() => {
            validateField();
          }}
        />
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
                  width: '80%',
                  height: '100%',
                  alignSelf: 'center',
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
    // padding: 30,
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
export default ReplyScreen;
