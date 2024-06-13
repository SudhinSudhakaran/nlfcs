/**
    * Purpose:* Create DigiLocker screen
              * display uploaded documents
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 5 June 2023

    */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Keyboard,
  Platform,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {components} from '../components';
import {Images, theme} from '../constants';
import ImageView from 'react-native-image-viewing';
import {BackHandler} from 'react-native';
import {setBenefitLoading} from '../store/benefitSlice';
import DataManager from '../helpers/apiManager/DataManager';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setDocumentDetails, setDocumentLoading} from '../store/documentSlice';
import Utilities from '../helpers/utils/Utilities';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {setSecretKey} from '../store/googleAuthenticatorSlice';
import {setUserDetails} from '../store/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Pdf from 'react-native-pdf';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import {ActivityIndicator} from 'react-native';
import {CaptureProtection} from 'react-native-capture-protection';
import BottomBar from './BottomBar';
import {setDashboardTab, setDocumentTab} from '../store/bottomTabSlice';
import uuid from 'react-native-uuid';
const documents = [
  {
    id: 1,
    name: 'Doc 1',
    date: '23 April 2023',
    source: {
      uri: Images.DOC_1,
    },
  },
  {
    id: 2,
    name: 'Doc 2',
    date: '20 April 2023',
    source: {
      uri: Images.DOC_1,
    },
  },
  {
    id: 3,
    name: 'Doc 3',
    date: '20 April 2023',
    source: {
      uri: Images.DOC_1,
    },
  },
  {
    id: 4,
    name: 'Doc 4',
    date: '19 April 2023',
    source: {
      uri: Images.DOC_1,
    },
  },
];

const Documents = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectImage, setSelectImage] = useState('');
  const [imageFullScreenVisible, setImageFullScreenVisible] = useState([]);
  const [fullScreenImages, setFullScreenImages] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const documentDetails = useSelector(
    (state) => state.documentDetails.documentDetails,
  );
  const userDetails = useSelector((state) => state.userDetails.userDetails);

  const documentLoading = useSelector(
    (state) => state.documentDetails.documentLoading,
  );
  const ref = useRef();

  //Backbutton action in phone
  useEffect(() => {
    dispatch(setDocumentTab(true));
    dispatch(setDashboardTab(false));
    getDocuments();
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

  useFocusEffect(
    React.useCallback(() => {
      allowScreenShot();
      return () => {};
    }, []),
  );

  const allowScreenShot = async () => {
    await CaptureProtection.allowScreenshot(true);
  };
  const backButtonAction = () => {
    navigation.goBack();
    //Enable screenshot
  };
  /**
 * Purpose: Get Documents
 * Created/Modified By: Monisha Sreejith
 * Created/Modified Date: 26 Jun 2023
 * Steps:
   1.fetch user details from API and append to state variable
*/
  const getDocuments = () => {
    setIsLoading(true);

    var formdata = new FormData();
    DataManager.getDocuments(formdata).then(([isSuccess, message, data]) => {
      console.log('data', data);
      if (isSuccess === true && data?.status !== 'Token is Invalid') {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          // dispatch(setDocumentDetails(data));
          setDocumentList(data);
          setIsLoading(false);
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
          setIsLoading(false);
        }
      } else {
        Utilities.showToast('Failed', data.status, 'error', 'bottom');
        setIsLoading(false);
      }
    });
  };
  /** Purpose:  session expired action
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26-06-2023
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
  const imageFullscreenButtonAction = (url) => {
    console.log('imageFullscreenButtonAction url: ', url, fullScreenImages);
    setFullScreenImages([
      {
        id: 1,
        source: {
          uri: url,
        },
      },
    ]);
    setImageFullScreenVisible(true);
  };
  const Close = () => {
    setModalVisible(false);
  };
  //shimmer for documents
  const DocumentsLoader = () => (
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
  const DocumentSelection = () => {
    return (
      <View>
        <Modal isVisible={isModalVisible} style={{margin: 0}}>
          <TouchableOpacity
            onPress={() => Close()}
            style={{
              marginTop: responsiveHeight(8),
              position: 'absolute',
              zIndex: 10,
              right: responsiveWidth(3),
              width: responsiveWidth(8),
              height: responsiveWidth(8),
            }}
          >
            <Image
              style={{
                resizeMode: 'contain',
                tintColor: theme.colors.textColor,
              }}
              source={Images.CLOSE_ICON}
            />
          </TouchableOpacity>
          <Pdf
            source={selectImage}
            trustAllCerts={Platform.OS === 'android' ? false : true}
            style={{
              flex: 1,
              backgroundColor: theme.colors.white,
            }}
            renderActivityIndicator={(progress) => {
              //console.log(progress);
              return <ActivityIndicator color={theme.colors.textColor} />;
            }}
          />
        </Modal>
      </View>
    );
  };
  const ClickAction = (source) => {
    setSelectImage(source);
    setModalVisible(true);
  };
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'DigiLocker'}
        backstyle={{
          marginRight: responsiveHeight(3),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(28),
          marginTop: 18,
        }}
      />
    );
  };

  const renderDocuments = ({item, index}) => {
    var id = item?.id;
    const last = documentList?.length === index + 1;
    const source = {
      uri: encodeURI('http://' + item?.document),
      method: 'GET',
      cache: true,
    };
    var date = moment(item?.created_at).format('Y-MM-DD');
    var time = moment(item?.created_at).format('hh:mm a');

    return (
      <TouchableOpacity
        style={{
          width: responsiveWidth(90),
          backgroundColor: '#f5f5ef',
          borderRadius: 10,
          padding: 10,
          marginBottom: last ? 0 : 10,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
        }}
        onPress={() => navigation.navigate('FullImageView', {source: source})}
      >
        <View
          style={{
            width: responsiveWidth(20),
            height: responsiveHeight(12),
            borderRadius: 10,
            bottom: responsiveHeight(0.6),
            marginRight: 10,
          }}
        >
          <Image
            source={{uri: 'http://' + item.document_thumbnail}}
            style={{
              width: 80,
              height: 100,
              borderRadius: 10,

              borderColor: theme.colors.bodyTextColor,
            }}
          />
        </View>
        {/* <View style={{marginLeft: 30}} /> */}
        <View
          style={{
            marginLeft: responsiveHeight(1),
            marginRight: 'auto',
            width: responsiveWidth(58),
          }}
        >
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_14,
              lineHeight: theme.fonts.SourceSansPro_Regular_14.fontSize * 1.6,
              color: theme.colors.mainDark,
              textTransform: 'capitalize',
            }}
            numberOfLines={2}
          >
            {item?.document_name || ''}
          </Text>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_12,
              lineHeight: theme.fonts.SourceSansPro_Regular_12.fontSize * 1.6,
              color: theme.colors.bodyTextColor,
            }}
          >
            {date + ' at ' + time || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(78)}}>
        {renderHeader()}
        <ImageView
          images={fullScreenImages}
          imageIndex={0}
          visible={imageFullScreenVisible}
          onRequestClose={() => setImageFullScreenVisible(false)}
        />
        {/* {isLoading === true ? (
          <DocumentsLoader />
        ) : ( */}
        <FlatList
          data={documentList}
          keyExtractor={(item, index) => index + item?.document_name}
          renderItem={renderDocuments}
        />
        {/* )} */}
        {isModalVisible === true ? DocumentSelection() : null}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};

export default Documents;
