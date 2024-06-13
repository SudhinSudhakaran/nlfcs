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
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
  useRoute,
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

const FullImageView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectImage, setSelectImage] = useState('');
  const documentDetails = useSelector(
    (state) => state.documentDetails.documentDetails,
  );
  const route = useRoute();
  const pdfRef = useRef();

  useEffect(() => {
    //Disable screenshot
    screenshotPrevent();
    setSelectImage(route?.params?.source);
    console.log('uri----', route?.params?.source);
    setModalVisible(true);

    return () => {};
  }, []);

  const screenshotPrevent = async () => {
    await CaptureProtection.preventScreenshot();
  };
  const allowScreenShot = async () => {
    await CaptureProtection.allowScreenshot();
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
    //Enable screenshot
    // allowScreenShot();
  };
  const Close = () => {
    navigation.goBack();
    // allowScreenShot();
  };
  // const DocumentSelection = () => {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         overflow: 'hidden',
  //       }}
  //       onStartShouldSetResponder={() => true}
  //     >
  //       <TouchableOpacity
  //         onPress={() => Close()}
  //         style={{
  //           top: responsiveHeight(2),
  //           position: 'absolute',
  //           zIndex: 10,
  //           right: responsiveWidth(3),

  //           width: responsiveWidth(8),
  //           height: responsiveWidth(8),
  //         }}
  //       >
  //         <Image
  //           style={{
  //             resizeMode: 'contain',
  //             tintColor: theme.colors.textColor,
  //           }}
  //           source={Images.CLOSE_ICON}
  //         />
  //       </TouchableOpacity>
  //       {route?.params?.item ? (
  //         <View style={{marginBottom: responsiveHeight(18)}}>
  //           <Image
  //             source={{uri: route?.params?.item}}
  //             style={{
  //               width: '100%',
  //               height: '100%',
  //             }}
  //             resizeMode='contain'
  //           />
  //         </View>
  //       ) : (
  //         <></>
  //       )}
  //     </View>
  //   );
  // };
  return (
    <components.SafeAreaView>
      <TouchableOpacity
        onPress={() => Close()}
        style={{
          top:
            Platform.OS === 'android'
              ? responsiveHeight(5)
              : responsiveHeight(5),
          position: 'absolute',
          zIndex: 100,
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
        // key={'cachedPdf'}
        // id={'cachedPdf'}
        source={route?.params?.source}
        trustAllCerts={Platform.OS === 'ios'}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          backgroundColor: 'white',
        }}
        renderActivityIndicator={(progress) => {
          //console.log(progress);
          return <ActivityIndicator color={theme.colors.textColor} />;
        }}
        single
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log('error',error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
      />
    </components.SafeAreaView>
  );
};

export default FullImageView;
