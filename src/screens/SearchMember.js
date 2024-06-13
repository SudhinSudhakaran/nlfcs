/**
    * Purpose:* Search with member id
              * display searched id details
              * add document uploads
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Linking,
  Platform,
  TextInput,
  Keyboard,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Image from 'react-native-scalable-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {components} from '../components';
import {Globals, theme} from '../constants';
import {svg} from '../assets/svg';
import SearchBox from './SearchBox';
import TransactionDetails from './TransactionDetails';
import Modal from 'react-native-modal';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions} from '../helpers/utils/Permission';
import Images from '../constants/Images';
import ImagePicker from 'react-native-image-crop-picker';
import StaffCard from '../components/custom/StaffCard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import DataManager from '../helpers/apiManager/DataManager';
import Utilities from '../helpers/utils/Utilities';
import {
  setAccountTypeDetails,
  setAccountTypeLoading,
  setDocumentTypeId,
} from '../store/accountTypeSlice';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setFullInfo, setUserDetails} from '../store/userSlice';
import StorageManager from '../helpers/storageManager/StorageManager';
import APIConnections from '../helpers/apiManager/APIConnections';
import moment from 'moment';
import {
  setDocumentImage,
  setSearchMemberDetails,
  setSearchMemberLoading,
} from '../store/searchMemberSlice';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {CaptureProtection} from 'react-native-capture-protection';
import ImageViewer from 'react-native-image-viewing-rtl';
import ImageResizer from '@bam.tech/react-native-image-resizer';
// import DocumentScanner from '../components/react-native-document-scanner-plugin';
import DocumentScanner from 'react-native-document-scanner-plugin';
import uuid from 'react-native-uuid';

//demo array
const uploadtype = [
  {
    id: 1,
    title: 'Share Cert',
    icon: require('../assets/icons/documents.png'),
  },
  {
    id: 2,
    title: 'Doc Type 1',
    icon: require('../assets/icons/documents.png'),
  },
  {
    id: 3,
    title: 'Doc Type 2',
    icon: require('../assets/icons/documents.png'),
  },
];
//demo array
const members = [
  {
    id: 1,
    name: 'Nithin',
    memberid: '11101110',
    title: 'Share Cert',
    source: {
      uri: Images.DOCUMENTS,
    },
    icon: require('../assets/icons/documents.png'),
  },
];

const tabs = [
  {
    name: 'Notification',
    icon: svg.NotificationSvg,
  },
];
const SearchMember = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [searchItem, setSearchItem] = useState(false);
  const imageRef = useRef();
  const [upload, setUpload] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [showFullScreenDoc, setFullScreenDoc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  var _reactNative = require('react-native');
  // Redux states
  const accountTypeDetails = useSelector(
    (state) => state.accountTypeDetails.accountTypeDetails,
  );
  const accountTypeLoading = useSelector(
    (state) => state.accountTypeDetails.accountTypeLoading,
  );
  const documentTypeId = useSelector(
    (state) => state.accountTypeDetails.documentTypeId,
  );
  const searchMemberDetails = useSelector(
    (state) => state.searchMemberDetails.searchMemberDetails,
  );
  const documentImage = useSelector(
    (state) => state.searchMemberDetails.documentImage,
  );
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  useEffect(() => {
    // Disable screenshot
    allowScreenShot();
  }, []);
  const allowScreenShot = async () => {
    await CaptureProtection.allowScreenshot();
  };
  const screenshotPrevent = async () => {
    await CaptureProtection.preventScreenshot();
  };
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
    navigation.goBack();
  };
  /**
   * Purpose: Get document types api
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 19 Jun 2023
   * Steps:
     1.fetch user details from API and append to state variable
*/

  const getDocumentTypes = () => {
    dispatch(setAccountTypeLoading(true));
    var formdata = new FormData();
    DataManager.getDocumentTypes(formdata).then(
      ([isSuccess, message, data]) => {
        if (isSuccess === true && data.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data.status !== 'Token is Expired'
          ) {
            dispatch(setAccountTypeDetails(data));
            setTimeout(() => {
              dispatch(setAccountTypeLoading(false));
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
              dispatch(setAccountTypeLoading(false));
            }, 1000);
          }
        } else {
          Utilities.showToast('Failed', message, 'error', 'bottom');
          setTimeout(() => {
            dispatch(setAccountTypeLoading(false));
          }, 1000);
        }
      },
    );
  };
  /** session expired action
   * Cleared User details,autherization,email,token from storage
   * Navigate to SignIn
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
  /**
   * Purpose: Get Search Member id
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 19 Jun 2023
   * Steps:
     1.fetch user details from API and append to state variable
*/

  const getSearchMember = () => {
    dispatch(setSearchMemberLoading(true));
    var formdata = new FormData();
    Globals.SEARCH_MEMBER = search;
    // formdata.append((APIConnections.KEYS.MEMBER_ID = search));
    DataManager.getSearchMember().then(([isSuccess, message, data]) => {
      if (isSuccess === true && data.status !== 'Token is Invalid') {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          dispatch(setSearchMemberDetails(data));
          setTimeout(() => {
            dispatch(setSearchMemberLoading(false));
          }, 3000);
        } else {
          setTimeout(() => {
            dispatch(setSearchMemberLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast('Failed', message, 'error', 'bottom');
        setTimeout(() => {
          dispatch(setSearchMemberLoading(false));
        }, 1000);
      }
    });
  };
  /**
   * Purpose: open camera
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 20 Jun 2023
   * Steps:
     1.Check permissions for access camera
     2.If permission granted go to the _opencamera function
     3.else display alert and go to settings
*/

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
  const clean = () => {
    ImagePicker.clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch((e) => {
        alert(e);
      });
  };
  /**
   * Purpose: open camera
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 20 Jun 2023
   * Steps:
     1.Call imagepicker
     2.variable declare for store response
     3.state declare for storing upload image details
     4.call uploaddocument Api also passed the image
*/
  const _openCamera = async (type) => {
    // ImagePicker.openCamera({
    //   compressImageQuality: 0.5,
    //   width: 512,
    //   height: 512,
    //   cropping: false,
    //   includeBase64: true,
    //   useFrontCamera: false,
    //   mediaType: 'photo',
    // })
    //   .then((image) => {
    //     ImageResizer.createResizedImage(image.path, 512, 512, 'PNG', 100, 0)
    //       .then((response) => {
    //         // response.uri is the URI of the new image that can now be displayed, uploaded...
    //         // response.path is the path of the new image
    //         // response.name is the name of the new image with the extension
    //         // response.size is the size of the new image
    //         console.log('response====', response);

    //         let imgArray = [];
    //         let ImageItem = {
    //           uri: response?.uri,
    //           type: 'image/png',
    //           name:
    //             Platform.OS === 'ios'
    //               ? image.filename
    //               : type + '_' + Date.now(),
    //         };
    //         imgArray.push(ImageItem);
    //         const list = [...imageList, ImageItem];
    //         var doc1 = list;
    //         dispatch(setDocumentImage(list));
    //         performUploadDocument(ImageItem);
    //         if (search === '') {
    //           setImageList('');
    //         }
    //         setModalVisible(false);
    //       })
    //       .catch((err) => {
    //         // Oops, something went wrong. Check that the filename is correct and
    //         // inspect err to get more details.
    //         console.log('err====', err);
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // const DocumentScanner = _reactNative.NativeModules.DocumentScanner
    //   ? _reactNative.NativeModules.DocumentScanner
    //   : new Proxy(
    //       {},
    //       {
    //         get() {
    //           throw new Error('Error');
    //         },
    //       },
    //     );
    // console.log('DocumentScanner', DocumentScanner);
    const {scannedImages} = await DocumentScanner.scanDocument({
      letUserAdjustCrop: true,
      croppedImageQuality: 100,
    });

    // if (scannedImages.length > 0) {
    //   console.log('scannedImages------', scannedImages);

    //   // Asynchronous function to resize each image and return the resized list
    //   const resizeImages = async () => {
    //     let list = [];
    //     try {
    //       // Use Promise.all to wait for all resize operations to complete
    //       await Promise.all(
    //         scannedImages.map(async (item, index) => {
    //           try {
    //             const response = await ImageResizer.createResizedImage(
    //               item,
    //               512,
    //               512,
    //               'PNG',
    //               100,
    //               0,
    //             );

    //             console.log('response====', response);

    //             const ImageItem = {
    //               uri: response?.uri,
    //               type: 'image/png',
    //               name: type.name + '_' + Date.now(),
    //             };
    //             list.push(ImageItem);
    //           } catch (err) {
    //             console.log('err====', err);
    //           }
    //         }),
    //       );

    //       return list;
    //     } catch (error) {
    //       console.log('Error while resizing images:', error);
    //       return [];
    //     }
    //   };

    //   const processImages = async () => {
    //     // Call the function to resize images and get the updated list
    //     const resizedList = await resizeImages();

    //     if (search === '') {
    //       setImageList([]);
    //     }

    //     console.log('List ===', resizedList);
    //     setModalVisible(false);
    //     dispatch(setDocumentImage(resizedList));
    //     performUploadDocument(resizedList, type);
    //   };

    //   processImages();
    // }

    if (scannedImages.length > 0) {
      console.log('scannedImages------', scannedImages);

      if (scannedImages.length > 0) {
        let list = [];
        scannedImages.forEach((item, index) => {
          console.log('response====', item);
          var androidPath = item.replace('.jpg', '.JPG');
          var iosPath = item.replace('file://', '');
          let ImageItem = {
            uri:
              Platform.OS === 'ios'
                ? iosPath.replace('.jpg', '.JPG')
                : androidPath,
            type: 'image/jpeg',
            name: type.name + '_' + uuid.v4(),
          };
          list = [...list, ImageItem];
        });
        if (search === '') {
          setImageList([]);
        }

        console.log('List ===', list);
        setModalVisible(false);
        dispatch(setDocumentImage(list));
        performUploadDocument(list, type);
      }
    }
  };
  /**
 <---------------------------------------------------------------------------------------------->
 * Purpose: Congigure image item
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 27-06-2023
 * Steps:
 * 1.  receive image path
 * 2.  Add name and type
 * 3.  Call file upload api
 <---------------------------------------------------------------------------------------------->
 */
  const configureImage = (image) => {
    setShowScanner(false);
    let imgArray = [];
    let ImageItem = {
      uri: image,
      type: 'image/jpeg',
      name: `${selectedType}` + Date.now(),
    };
    console.log('Image item in config', ImageItem);
    imgArray.push(ImageItem);
    const list = [...imgArray, ImageItem];
    var doc1 = list;
    dispatch(setDocumentImage(list));
    imgArray.push(ImageItem);
    performUploadDocument(ImageItem);
  };
  // API CALL
  /**
   * Purpose: Perform upload document api
      *steps:
      1.send data in the form of form data
      2.succes,fail toast displayed
      3.mapped the passed doc array to object and get item
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 20 Jun 2023
   */

  const performUploadDocument = (list, docDetails) => {
    setIsLoading(true);
    console.log('doc1ist', list, docDetails);
    setUpload(false);
    var formdata = new FormData();

    formdata.append(APIConnections.KEYS.DOCUMENT_NAME, list[0].name);
    formdata.append(APIConnections.KEYS.DOCUMENT_TYPE_ID, docDetails.id);
    formdata.append(APIConnections.KEYS.USER_ID, searchMemberDetails[0].id);
    for (let i = 0; i < list.length; i++) {
      formdata.append(APIConnections.KEYS.DOCUMENT_ARRAY, list[i]);
    }

    DataManager.performUploadDocument(formdata).then(
      ([isSuccess, message, response]) => {
        setSelectedType('');
        console.log('response data ====>>>>', isSuccess, response);
        if (isSuccess === true) {
          getUserDetails();
          setUpload(true);
          setImageList([list, ...imageList]);
          console.log('Image list after api calll', imageList);
          Utilities.showToast('Success', message, 'success', 'bottom');
          setIsLoading(false);
        } else {
          setUpload(false);
          Utilities.showToast('Failed', message, 'error', 'bottom');
          Keyboard.dismiss();
          setIsLoading(false);
        }
      },
    );
  };
  /**
   * Purpose: Get userDetail
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 28 Jun 2023
   * Steps:
     1.fetch user details from API and append to state variable
*/

  const getUserDetails = () => {
    var formdata = new FormData();
    DataManager.getUserDetails(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true && data.status !== 'Token is Invalid') {
        dispatch(setFullInfo(data));
      } else {
      }
    });
  };

  const onPressDocItem = (item) => {
    navigation.navigate('UploadImageFullView', {item: item.uri});
    setSelectedDocument(item);
    setFullScreenDoc(true);
  };

  const configImageArray = (list) => {
    let urlArray = [];
    if (list.length > 0) {
      list.forEach((item) => {
        urlArray.push({uri: item?.uri});
      });
    }
    screenshotPrevent();
    setSelectedDocument(urlArray);
    setFullScreenDoc(true);
  };

  /**
   * Purpose: Show Searched member tile
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 20 Jun 2023
   * Steps:
     1.map searchmemberdetails state and get each item
*/
  const Item = ({item, index}) => {
    // console.log('========================image', item);
    return (
      <View style={{marginTop: responsiveHeight(0)}}>
        <View style={{flexGrow: 0, marginBottom: 10}}>
          <View style={{paddingHorizontal: responsiveWidth(2)}}>
            {searchMemberDetails?.map((item1, index, array) => {
              const date = moment().format('Y-MM-DD');
              const last = array.length === index + 1;
              var id = item1.id;
              return (
                <TouchableOpacity
                  onPress={() => {
                    configImageArray(item);
                  }}
                  key={index}
                  style={{
                    width: responsiveWidth(90),
                    height: 100,
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: last ? 0 : 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    // borderRadius: 5,
                  }}
                >
                  <View style={{marginLeft: 10}}>
                    <components.Image
                      source={{uri: item[0].uri}}
                      style={{
                        width: responsiveWidth(16),
                        right: 10,
                        bottom: responsiveHeight(0.6),
                        aspectRatio: 1 / 1,
                        filter: 'grayscale(10%)',
                      }}
                      imageStyle={{
                        borderRadius: 13,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: responsiveWidth(2),
                      bottom: responsiveHeight(1),

                      width: '75%',
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                        textTransform: 'capitalize',
                      }}
                      numberOfLines={2}
                      ellipsizeMode='tail'
                    >
                      {item[0].name}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
                        color: theme.colors.mainDark,
                        textTransform: 'capitalize',
                      }}
                      numberOfLines={1}
                    >
                      {date || ''}
                    </Text>
                  </View>
                </TouchableOpacity>
                // <View>
                //   {item1?.account_number === search ? (

                //   ) : null}
                // </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };
  /**
   * Purpose: Close Search text
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 20 Jun 2023
   * Steps:
     1.clear search text and images
*/
  const closeButtonAction = () => {
    clean();
    setImageList([]);
    setSearch('');
    Keyboard.dismiss();
    setSearchItem(false);
  };
  /**
   * Purpose: Search Filter Funcytion
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 20 Jun 2023
   * Steps:
     1.Function to filter the data based on the search term
     2.Check if searched text is not blank
     3.Applying filter for the inserted text in search bar
*/
  const searchFilterFunction = (text) => {
    if (text) {
      // Inserted text is not blank
      // Filter the member and update FilteredDataSource
      const newData = members?.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.memberid
          ? item.memberid.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
      setImageList([]);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with member
      setFilteredDataSource(members);
      setSearch(text);
      setImageList([]);
      setSearchItem(false);
    }
  };
  const ItemRender = ({item}) => {
    return (
      <View style={{marginTop: responsiveHeight(3)}}>
        <View
          style={{
            flexGrow: 0,
            marginBottom: 10,
            paddingLeft: responsiveWidth(5),
          }}
        >
          {item.account_number === search &&
          searchItem === true &&
          searchMemberDetails?.length > 0 ? (
            <View style={{paddingHorizontal: 0}}>
              <View>
                <View
                  style={{
                    width: responsiveWidth(90),
                    height: 100,
                    backgroundColor: '#f5f5ef',
                    borderRadius: 10,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View style={{marginLeft: 14}}>
                    <components.Image
                      source={{
                        uri: 'http://' + item?.profile_picture,
                      }}
                      style={{
                        alignSelf: 'center',
                        width: responsiveWidth(20),
                        right: 10,
                        bottom: responsiveHeight(2),
                        aspectRatio: 1 / 1,
                        marginTop: responsiveHeight(4),
                      }}
                      imageStyle={{
                        borderRadius: 200,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: responsiveWidth(6),
                      bottom: responsiveHeight(0),
                    }}
                  >
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_14,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 2,
                        fontSize:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.2,
                        color: theme.colors.mainDark,
                        textTransform: 'capitalize',
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        ...theme.fonts.SourceSansPro_Regular_12,
                        lineHeight:
                          theme.fonts.SourceSansPro_Regular_12.fontSize * 2,
                        color: theme.colors.bodyTextColor,
                        fontSize:
                          theme.fonts.SourceSansPro_Regular_14.fontSize * 1.2,
                      }}
                    >
                      {item.account_number}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={{}}>
              <EmptyMember />
            </View>
          )}
        </View>
        <View>
          {item.account_number === search && searchItem === true ? (
            <>
              <Text
                style={{
                  ...theme.fonts.SourceSansPro_Regular_10,
                  color: theme.colors.bodyTextColor,
                  lineHeight: theme.fonts.SourceSansPro_Regular_10.fontSize * 3,
                  left: responsiveWidth(5),
                  top: responsiveHeight(1),
                  fontSize: theme.fonts.SourceSansPro_Regular_10.fontSize * 1.5,
                }}
              >
                Select a document type to upload
              </Text>
              <View
                style={{
                  flexGrow: 0,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 30,
                  left: responsiveWidth(5),
                  top: responsiveHeight(3),
                }}
              >
                {accountTypeDetails?.map((item, index, array) => {
                  const lastElement = array.length === index + 1;
                  var type = item?.name;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        marginBottom: 6,
                        backgroundColor: theme.colors.white,
                        marginRight: lastElement ? 20 : responsiveWidth(3),
                        borderRadius: 10,
                        borderColor: theme.colors.mainDark,
                        borderWidth: 1,

                        flexDirection: 'row',
                        alignItems: 'center',
                        height: responsiveHeight(9),
                        width: responsiveWidth(28),
                      }}
                      onPress={() => {
                        _openCamera(item);
                      }}
                    >
                      <components.Image
                        source={Images.DOCS}
                        style={{
                          width: responsiveWidth(8),
                          right: responsiveWidth(0),
                          aspectRatio: 1 / 1,
                          marginHorizontal: 3,
                        }}
                        tintColor={theme.colors.mainDark}
                      />
                      <Text
                        style={{
                          ...theme.fonts.SourceSansPro_Regular_10,
                          color: theme.colors.textColor,
                          lineHeight:
                            theme.fonts.SourceSansPro_Regular_10.fontSize * 1.2,
                          right: responsiveWidth(1),
                          width: responsiveWidth(17),
                        }}
                        numberOfLines={2}
                      >
                        {item?.name || ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : null}
        </View>

        <Modal isVisible={isLoading} backdropOpacity={0.3}>
          <View style={styles.container}>
            <components.Loader />
          </View>
        </Modal>
      </View>
    );
  };
  /**
   * Purpose:Peform Search Button Action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 20 Jun 2023
   * Steps:
     1.keyboard dismissed
     2.searchitem state set as true
     3.call getSearchMember && getDocumentTypes Api
*/
  const SearchButtonAction = () => {
    Keyboard.dismiss();
    setSearchItem(true);
    getSearchMember();
    getDocumentTypes();
  };
  // Showing Search member
  const MemberDetailsTile = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        data={searchMemberDetails || []}
        renderItem={({item}) => <ItemRender item={item} />}
        keyExtractor={(item, index) => index.toString()} //2
        keyboardShouldPersistTaps={'handled'}
        ListEmptyComponent={EmptyMember}
      />
    );
  };
  // Showing UploadType
  const UploadTile = () => {
    return (
      <FlatList
        ref={imageRef}
        scrollEnabled={true}
        contentContainerStyle={{
          paddingHorizontal: responsiveWidth(2),
          marginBottom: responsiveHeight(0),
        }}
        data={imageList}
        renderItem={({item, index}) => <Item item={item} index={index} />}
        keyExtractor={(item) => item.id}
      />
    );
  };
  const searchFunction = () => {
    return (
      <View
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginBottom: responsiveHeight(0),
          }}
        >
          <View style={{flex: 1}}>
            <SearchBox
              search={search}
              searchFilterFunction={searchFilterFunction}
              closeButtonAction={closeButtonAction}
            />
          </View>
          <View style={{flex: 1, left: responsiveWidth(3)}}>
            {search !== '' ? (
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  marginLeft: responsiveWidth(8),
                  marginTop: responsiveHeight(4),
                }}
                onPress={() => closeButtonAction()}
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
            ) : null}
            <components.Button
              title='Search'
              onPress={() => {
                SearchButtonAction();
              }}
              containerStyle={{
                marginTop: responsiveHeight(2.1),
                height:
                  Platform.OS === 'ios'
                    ? responsiveHeight(5)
                    : responsiveHeight(5.8),
                width: '55%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.newPrimaryColor,
                borderRadius: 10,
                marginLeft: responsiveWidth(15),
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  //Showing Empty Member
  const EmptyMember = () => (
    <View
      style={{
        alignSelf: 'center',
        right: responsiveWidth(4),
        marginTop: responsiveHeight(20),
      }}
    >
      <Text
        style={{
          ...theme.fonts.SourceSansPro_Regular_14,
          lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
          color: theme.colors.bodyTextColor,
          fontSize: theme.fonts.SourceSansPro_Regular_12.fontSize * 1.7,
          // textTransform: 'capitalize',
        }}
        numberOfLines={1}
      >
        Member does not exist
      </Text>
    </View>
  );
  const renderCards = () => {
    return (
      <View
        style={{
          marginBottom: 0,
          marginTop: Platform.OS === 'ios' ? 20 : responsiveHeight(2),
        }}
        showsHorizontalScrollIndicator={false}
      >
        <StaffCard />
      </View>
    );
  };
  const renderHeader = () => {
    return (
      <components.Header
        creditCard={true}
        user={true}
        userTitleStyle={{left: responsiveWidth(4)}}
        titleStyle={{marginRight: responsiveWidth(50)}}
        showRound={true}
      />
    );
  };
  const renderContent = () => {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          alwaysBounceVertical={false}
          enableResetScrollToCoords={true}
          keyboardShouldPersistTaps={'always'}
          contentInsetAdjustmentBehavior={'automatic'}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: theme.colors.newRoundBgColor,
              width: responsiveWidth(30),
              height: responsiveWidth(30),
              borderRadius: responsiveWidth(80),
              position: 'absolute',

              right: responsiveWidth(-18),
              top: responsiveHeight(22),
            }}
          />
          {/* <Modal
            style={{margin: 0}}
            isVisible={showFullScreenDoc}
            onBackdropPress={() => setFullScreenDoc(false)}
          >
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: responsiveHeight(2),
                right: responsiveWidth(5),
                zIndex: 10,
              }}
              onPress={() => setFullScreenDoc(false)}
            >
              <Image source={Images.CLOSE_ICON} />
            </TouchableOpacity>

            <FlatList
              contentContainerStyle={{  }}
              data={selectedDocument}
              renderItem={({item, index}) => {
                return (
                  <ReactNativeZoomableView
                    maxZoom={30}
                    // Give these to the zoomable view so it can apply the boundaries around the actual content.
                    // Need to make sure the content is actually centered and the width and height are
                    // dimensions when it's rendered naturally. Not the intrinsic size.
                    // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
                    // Therefore, we'll feed the zoomable view the 300x150 size.
                    contentWidth={300}
                    contentHeight={150}
                  >
                    <components.Image
                      source={item}
                      style={{
                        width: responsiveWidth(90),
                      
                        aspectRatio: 1 / 1,
                        filter: 'grayscale(10%)',
                      }}
                      imageStyle={{
                        borderRadius: 13,
                      }}
                    />
                  </ReactNativeZoomableView>
                );
              }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              keyExtractor={(item) => item.id}
            />
          </Modal> */}
          {renderHeader()}
          {renderCards()}
          {searchFunction()}
          {MemberDetailsTile()}
          {UploadTile()}
        </ScrollView>
        <ImageViewer
          swipeToCloseEnabled={Platform.OS === 'ios'}
          images={selectedDocument}
          index={0}
          visible={showFullScreenDoc}
          enablePreload={true}
          useNativeDriver={true}
          onRequestClose={() => {
            allowScreenShot();
            setFullScreenDoc(false);
          }}
        />
      </SafeAreaView>
    );
  };

  return <View style={{flex: 1}}>{renderContent()}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textareaContainer: {
    padding: 5,
    backgroundColor: '#f5f5ef',
  },
  textarea: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    height: responsiveHeight(15),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.7,
  },
});
export default SearchMember;
