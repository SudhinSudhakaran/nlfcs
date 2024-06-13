/**
    * Purpose:* Create New Ticket screen
              * add text input field and upload image option
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
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
} from 'react-native-responsive-dimensions';
import FitImage from 'react-native-fit-image';

import {components} from '../components';
import {theme} from '../constants';
import {svg} from '../assets/svg';
import EditPersonalInfo from './EditPersonalInfo';
import Textarea from 'react-native-textarea/src/Textarea';
import {useRoute} from '@react-navigation/native';
import Images from '../constants/Images';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions} from '../helpers/utils/Permission';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DisplayUtils from '../helpers/utils/DisplayUtils';
import {useDispatch, useSelector} from 'react-redux';
import Utilities from '../helpers/utils/Utilities';
import {Keyboard} from 'react-native';
import DataManager from '../helpers/apiManager/DataManager';
import APIConnections from '../helpers/apiManager/APIConnections';
import {
  setMyTicketsDetails,
  setMyTicketsPendingDetails,
} from '../store/myTicketSlice';
import {BackHandler} from 'react-native';
import {setScreen} from '../store/tabSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import BottomBar from './BottomBar';

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
const NewTicket = ({navigation}) => {
  const dispatch = useDispatch();
  const route = useRoute();

  const [isModalVisible, setModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [messageValidation, setMessageValidation] = useState('');
  const [subjectValidation, setSubjectValidation] = useState('');
  const subRef = useRef();
  const messRef = useRef();
  const imageRef = useRef();
  useEffect(() => {
    //Back button action in phone
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
    if (subject !== '' || message !== '' || imageList.length > 0) {
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

  /** Purpose:  Validation Function
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 30-06-2023
   * Steps:
   1. Initially set 2 variables value=0
   2. checked the  fields with conditions
   * conditions are......
   * checked subject and message length equals zero
   3. if these conditions are false displayed error message
   4. also set declared variable values equal zero if the conditions are false
   5. If the conditions are true set the declared variable values equal one
   6. If conditions true navigate to create tickets api call
   *  */
  const validateField = () => {
    var _isValidSubject = 0;
    var _isValidMessage = 0;
    if (subject.length <= 0) {
      setSubjectValidation('Subject field is required');
      _isValidSubject = 0;
    } else {
      setSubjectValidation('');
      _isValidSubject = 1;
    }
    if (message.length === 0) {
      setMessageValidation('Message field is required');
      _isValidMessage = 0;
    } else {
      setMessageValidation('');
      _isValidMessage = 1;
    }
    if (_isValidSubject === 1 && _isValidMessage === 1) {
      if (isConnected) {
        performCreateTicket();
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
  // API CALL
  /**
   * Purpose: Perform Create Tickets
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
  steps
    1.If success call performMyTicket api
   */

  const performCreateTicket = () => {
    Keyboard.dismiss();
    var formdata = new FormData();
    formdata.append(APIConnections.KEYS.SUBJECT, subject);
    formdata.append(APIConnections.KEYS.MESSAGE, message);
    if (imageList.length > 0) {
      for (let i = 0; i < imageList.length; i++) {
        formdata.append(APIConnections.KEYS.ATTACHMENT, imageList[i]);
      }
    }
    DataManager.performCreateTicket(formdata).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true && data?.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data.status !== 'Token is Expired'
          ) {
            performMyTicket();
            setMessage('');
            setSubject('');
            setImageList('');
            Utilities.showToast('Success', message, 'success', 'bottom');
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
  // API CALL
  /**
   * Purpose: Perform Mytickets
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
      1.pending status passed
      2.fetch  pending ticket details from API and append to state variable
   */

  const performMyTicket = () => {
    Keyboard.dismiss();
    var formdata = new FormData();
    formdata.append(APIConnections.KEYS.STATUS, 'pending');
    DataManager.performMyTicket(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true) {
        dispatch(setMyTicketsPendingDetails(data?.data?.data));
        navigation.goBack();
      } else {
      }
    });
  };
  const toggleModal = () => {
    setModalVisible(true);
  };
  const Close = () => {
    setModalVisible(false);
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
            left: responsiveWidth(10),
            bottom: responsiveHeight(7),
          }}
        >
          <Image
            style={{
              width: responsiveWidth(3),
              height: responsiveHeight(3),
              tintColor: theme.colors.textColor,
              resizeMode: 'contain',
            }}
            source={Images.CLOSE_ICON}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const openCamera = async () => {
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA]
        : [PERMISSIONS.ANDROID.CAMERA];

    // Call our permission service and check for permissions
    var isPermissionGranted = await checkMultiplePermissions(permissions);
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
      // latitude: position.coords.latitude,
      // longitude: position.coords.longitude,
    })
      .then((image) => {
        // console.log('selected Image', image);
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
        // console.log('itemmap===', currentItem);
        setImageList([...imageList, currentItem]);
        setModalVisible(false);
        // console.log('items-camera: ', imageList);
      })
      .catch((err) => {
        console.log('catch ==>', err);
      });
  };
  //Displayed back button and title
  const renderHeader = () => {
    return (
      <components.Header
        goBackFromTickets
        title={
          route?.params?.Benefits
            ? 'Create Enquiry For' + ' ' + route.params.parameter
            : 'Create New Ticket'
        }
        backstyle={{
          marginRight: responsiveHeight(6),
          left: route?.params?.Benefits
            ? responsiveWidth(10)
            : responsiveWidth(0),
          marginTop: 46,
        }}
        onPress={() => {
          backButtonAction();
        }}
        titleStyle={{
          marginRight: route?.params?.Benefits
            ? responsiveHeight(6.9)
            : responsiveHeight(13),
          width: route?.params?.Benefits ? responsiveWidth(80) : undefined,
          height: route?.params?.Benefits ? 50 : undefined,
          marginTop: 18,
        }}
        numberOfLines={2}
      />
    );
  };
  /**
   * Purpose: Perform Submit Action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
      1.All fields cleared
      2.call validation function
   */
  const submitAction = () => {
    validateField();
  };
  //render UI
  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={responsiveHeight(50)}
        keyboardShouldPersistTaps='always'
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          borderColor: '#f5f5ef',
          borderWidth: 3,
          marginHorizontal: 6,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_18,
            fontSize: theme.fonts.SourceSansPro_Regular_18.fontSize * 0.9,
            color: theme.colors.mainDark,
            bottom: responsiveHeight(1),
            marginTop: responsiveHeight(2),
          }}
        >
          Subject
        </Text>
        <components.InputField
          containerStyle={{}}
          editable={true}
          subRef={subRef}
          onChangeText={setSubject}
          value={subject}
          // onSubmitEditing={() => {
          //   messRef.current.focus();
          // }}
          placeholder={
            route?.params?.Benefits
              ? route?.params?.parameter +
                ' ' +
                'Enquiry From' +
                ' ' +
                userDetails.id +
                ''
              : ''
          }
          // userIcon={true}
        />
        <Text
          style={{
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            color: 'red',
            ...theme.fonts.SourceSansPro_Regular_10,
            marginTop: responsiveHeight(1),
          }}
        >
          {subjectValidation}
        </Text>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_18,
            fontSize: theme.fonts.SourceSansPro_Regular_18.fontSize * 0.9,
            color: theme.colors.mainDark,
            bottom: responsiveHeight(1),
            marginTop: responsiveHeight(1),
          }}
        >
          Message
        </Text>
        <Textarea
          containerStyle={styles.textareaContainer}
          style={styles.textarea}
          onChangeText={setMessage}
          value={message}
          ref={messRef}
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
              // flex: 1,
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
                  // marginLeft:responsiveWidth(5),
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
                  tintColor: theme.colors.newPrimaryColor,
                  // marginLeft:responsiveWidth(5),
                }}
                source={Images.IMAGE_ROUND_ICON}
              />
            </View>
            <Text
              style={[
                styles.textarea,
                {
                  marginTop: responsiveHeight(3.5),
                  alignSelf: 'center',
                  height: responsiveHeight(15),
                },
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
                  <TouchableOpacity
                    onPress={() => openCamera()}
                    style={styles.firstMenu}
                  >
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
                        color: theme.colors.textColor,
                        fontSize: 15,
                        marginLeft: responsiveWidth(13),
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
                  <TouchableOpacity
                    onPress={() => openGallery()}
                    style={styles.firstMenu}
                  >
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
                        left: 16,
                        bottom: DisplayUtils.setHeight(16.5),
                        tintColor: theme.colors.mainDark,
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
                      tintColor:  theme.colors.newPrimaryColor,
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
          title='Submit'
          lightShade={true}
          buttonstyle={{
            width: '50%',
            alignSelf: 'center',
            left: responsiveWidth(3),
          }}
          containerStyle={{
            padding: 20,
            marginBottom:
              imageList.length > 0
                ? responsiveHeight(20)
                : responsiveHeight(35),
          }}
          onPress={() => {
            submitAction();
          }}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(75)}}>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textareaContainer: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#f5f5ef',
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: '#333',
  },
});
export default NewTicket;
