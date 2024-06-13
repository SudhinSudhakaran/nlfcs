import {
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
  Image,
  Touchable,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useRoute} from '@react-navigation/core';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {NetInfo} from '@react-native-community/netinfo';
import {theme, Globals, Images} from '../../constants';
import {components} from '../../components/index';
import base64 from 'react-native-base64';
import DataManager from '../../helpers/apiManager/DataManager';
import RenderHtml from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsAccountAdded,
  setSecretKey,
} from '../../store/googleAuthenticatorSlice';
import Utilities from '../../helpers/utils/Utilities';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import querystring from 'querystring';
import StorageManager from '../../helpers/storageManager/StorageManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import jwt_decode from 'jwt-decode';
import {setNotificationRefresh} from '../../store/notificationSlice';
const OtpScreen = () => {
  const navigation = useNavigation();
  const userDetails = useSelector((state) => state.userDetails.userDetails);

  const otpRef = useRef();
  const [enteredPin, setEnteredPin] = useState('');
  const [isValidEnteredPin, setIsValidEnteredPin] = useState(true);
  const [pinValidationMessage, setPinValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [networkValidation, setNetworkValidation] = useState('');

  const [image, setImage] = useState('');
  const [secret, setSecret] = useState('');

  const [validCode, setValidCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const [qrValue, setQrValue] = useState('');
  const yourAppName = 'NLFCS';
  const email = Globals?.USER_DETAILS?.email;
  const userName = Globals?.USER_DETAILS?.name || userDetails?.name;
  const route = useRoute();
  const [urlForAuth, setUrlForAuth] = useState('');

  const {isAccountAdded, secretKey} = useSelector(
    (state) => state.googleAuthenticator,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('secret in otp :::::::::::', secretKey);
    console.log('???', userName, userDetails?.google2fa_secret);
    return () => {
      setEnteredPin('');
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // setSecret(generateRandomKey(20));
      dispatch(setNotificationRefresh(false));
      // addAccountToAuthenticator();

      return () => {};
    }, []),
  );

  const continueButtonAction = () => {
    isValidInputs();
  };
  /**
 <---------------------------------------------------------------------------------------------->
 * Purpose:  add account to authentication
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 26-05-2023
 * Steps:
 * 1.   Check account is already added to authentication
 * 2.   If not added  call the link api and pass secret key
 * 3.   Saved the response
 <---------------------------------------------------------------------------------------------->
 */
  const addAccountToAuthenticator = async () => {
    // console.log('======================', isAccountAdded);
    if (isAccountAdded) {
    } else {
      setIsLoading(true);
      let url = `https://www.authenticatorApi.com/pair.aspx?AppName=${yourAppName}&AppInfo=${userName}&SecretCode=${
        secretKey || userDetails?.google2fa_secret
      }`;

      // console.log('Url ==========', url);
      const [isSuccess, message, responseData] = await DataManager.fetchQrData(
        url,
      );
      setQrValue(responseData);
      setIsLoading(false);
    }
  };
  /**
 <---------------------------------------------------------------------------------------------->
 * Purpose: Validation function
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 26-05-2023
 * Steps:
 * 1.   Check the length of entered pin
 * 2.   call valid otp function if validation is success
 * 3.
 <---------------------------------------------------------------------------------------------->
 */
  const isValidInputs = () => {
    var _isValidEnteredPin = 0;
    if (enteredPin) {
      setPinValidationMessage('');
      setIsValidEnteredPin(true);
      _isValidEnteredPin = 1;
    } else {
      setPinValidationMessage('please enter your valid PIN');
      setIsValidEnteredPin(false);
      _isValidEnteredPin = 0;
    }
    if (_isValidEnteredPin === 1) {
      setEnteredPin('');
      // validateOtp();
      perform2FAVerify2FA();
    }
  };
  /**
 <---------------------------------------------------------------------------------------------->
 * Purpose:  Add account to Google authenticator
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 26-05-2023
 * Steps:
 * 1.   Extract url from qr code value by matching regex
 * 2.   Slice the url for encrypted code
 * 3.   Open the generate url  with Linking
 * 4.   Download google authenticator app if it is not installed in our app
 * 5.
 <---------------------------------------------------------------------------------------------->
 */
  const openGoogleAuthenticator = () => {
    const iosUrl = 'itms-apps://apps.apple.com/US/app/id388497605';
    const androidUrl =
      'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';

    var regex = /src\s*=\s*'(.+?)'/;
    var _urlForAuth = qrValue.match(regex);

    // Extract the URL from the QR code data
    const startIndex = _urlForAuth?.[1].indexOf('chl=') + 4; // Find the start index of the URL
    const endIndex = _urlForAuth?.[1].length; // Use the full length of the string as the end index
    const _url = decodeURIComponent(
      _urlForAuth?.[1].slice(startIndex, endIndex),
    );
    Linking.openURL(_url)
      .then(() => {
        dispatch(setIsAccountAdded(true));
      })
      .catch(async () => {
        if (Platform.OS === 'ios') {
          const supported = await Linking.canOpenURL(iosUrl);
          supported && (await Linking.openURL(iosUrl));
        } else if (Platform.OS === 'android') {
          const supported = await Linking.canOpenURL(androidUrl);
          supported && (await Linking.openURL(androidUrl));
        }
      });
  };
  /**
 <---------------------------------------------------------------------------------------------->
 * Purpose:   Otp validation
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 26-05-2023
 * Steps:
 * 1.   Pass otp and secret key to Api
 * 2.   Navigate to dash board if varification is successful
 <---------------------------------------------------------------------------------------------->
 */
  const validateOtp = async () => {
    setIsLoading(true);
    let url = `https://www.authenticatorApi.com/Validate.aspx?Pin=${enteredPin}&SecretCode=${secretKey}`;
    console.log('Url ==========', url);
    const [isSuccess, message, responseData] = await DataManager.validateOTP(
      url,
    );
    // if (responseData === 'True') {
    if (route?.params?.staff !== 'isfromstafflogin') {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'TabNavigator',
          },
        ],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'StaffTabNavigator',
          },
        ],
      });
    }
    setIsLoading(false);
    // } else {
    //   setIsLoading(false);
    //   Utilities.showToast('Sorry!', 'Invalid otp', 'error', 'bottom');
    //   setEnteredPin('');
    // }
  };
  // API CALL
  /**
   * Purpose: Perform 2FA Verify 2FA Api impementation
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26 Jun 2023
   */

  const perform2FAVerify2FA = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    var formdata = new FormData();
    formdata.append(APIConnections.KEYS.ONE_TIME_PASSWORD, enteredPin),
      DataManager.perform2FAVerify2FA(formdata).then(
        ([isSuccess, message, response]) => {
          console.log('response data ====>>>>', isSuccess, response);
          if (isSuccess === true) {
            Globals.TOKEN = response?.data?.token;
            decodeToken(response?.data?.token, response?.data?.first_login);
            setIsLoading(false);
          } else {
            Utilities.showToast('Failed', message, 'error', 'bottom');
            Keyboard.dismiss();
            setIsLoading(false);
          }
        },
      );
  };
  /**
   <---------------------------------------------------------------------------------------------->
   * Purpose: decode the JWT
   * Created/Modified By: Sudhin Sudhakaran
   * Created/Modified Date: 14-07-2023
   * Steps:
   * 1.   check the role
   * 2. navigationg to staff tab navigator ifrole is user
   * 3. other ways navigating to otp screen
   <---------------------------------------------------------------------------------------------->
   */
  const decodeToken = (token, login) => {
    const decodedToken = jwt_decode(token);
    console.log('decodedToken =', decodedToken);
    if (decodedToken.role === 'user') {
      console.log('Globals Staff Token=======', Globals.TOKEN);
      navigation.navigate('StaffTabNavigator', {
        staff: 'isfromstafflogin',
        tempToken: token,
      });
    } else if (login === 1) {
      /**
             <---------------------------------------------------------------------------------------------->
             * Purpose: Checking first time login or not
             * Created/Modified By: Sudhin Sudhakaran
             * Created/Modified Date: 14-07-2023
             * Steps:
             * 1.   if it is 1 the navigating to change password screen
             * 2.  if it is  0 navigatiing to dashboard
             *
             <---------------------------------------------------------------------------------------------->
             */
      navigation.navigate('NewPassword', {isFromOTP: true});
      // navigation.navigate('PasswordResetScreen', {
      //   token: response?.data?.token,
      // });
    } else {
      navigation.navigate('TabNavigator', {
        tempToken: token,
      });
      console.log('Globals Token=======', Globals.TOKEN);
    }
  };
  const copyText = () => {
    Clipboard.setString(secretKey);
  };
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraHeight={responsiveHeight(15)}
      keyboardShouldPersistTaps='always'
      contentContainerStyle={{alignItems: 'center'}}
      style={styles.container}
    >
      {/* {!isAccountAdded ? (
        <View style={{marginTop: responsiveHeight(25), alignItems: 'center'}}>
          {qrValue ? (
            <RenderHtml
              contentWidth={200}
              source={{
                html: qrValue,
              }}
            />
          ) : (
            <View style={{width: 200, height: 200}} />
          )}

          <TouchableOpacity
            onPress={() => {
              copyText();
            }}
            style={{
              width: responsiveWidth(80),
              height: responsiveHeight(6),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_18,
                color: theme.colors.bodyTextColor,
              }}
            >
              ZNGVD2VV7ZCUSAIE
            </Text>
            {Platform.OS === 'ios' ? (
              <Image
                source={Images.COPY_ICON}
                style={{width: 20, height: 20, marginLeft: 20}}
              />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: responsiveHeight(10),
              width: responsiveWidth(60),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,

              height: 40,
              backgroundColor: theme.colors.mainDark,
            }}
            onPress={() => {
              openGoogleAuthenticator();
            }}
          >
            <Text
              style={{
                color: theme.colors.white,

                ...theme.fonts.SourceSansPro_SemiBold_16,
              }}
            >
              Open Google Authenticator
            </Text>
          </TouchableOpacity>
        </View>
      ) : ( */}
      <View style={{marginTop: responsiveHeight(5), alignItems: 'center'}}>
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.mainDark,

            textAlign: 'right',
            marginTop: responsiveHeight(30),
          }}
        >
          Enter FOTP
        </Text>
        {isLoading ? (
          <components.Loader />
        ) : (
          <>
            <View style={{marginTop: responsiveHeight(2)}}>
              <OTPInputView
                ref={otpRef}
                style={{
                  width: responsiveWidth(80),
                  height: 100,
                  // padding: responsiveHeight(6),
                  // backgroundColor:'red'
                }}
                pinCount={6}
                code={enteredPin}
                autoFocusOnLoad={false}
                secureTextEntry={true}
                onCodeChanged={(code) => {
                  setEnteredPin(code);
                }}
                codeInputFieldStyle={{
                  color: theme.colors.textColor,
                  ...theme.fonts.SourceSansPro_Regular_18,
                }}
              />
            </View>
            <View style={{marginTop: -10}}>
              <Text
                style={{
                  color: 'red',
                  fontSize: responsiveFontSize(1.5),
                  textAlign: 'right',
                  marginRight: responsiveWidth(-10),
                }}
              >
                {pinValidationMessage
                  ? pinValidationMessage
                  : networkValidation}
              </Text>
              <components.Button
                title='Continue'
                textStyle={{}}
                containerStyle={{
                  marginBottom: theme.sizes.marginBottom_30,
                  alignItems: 'center',
                  marginTop: responsiveHeight(10),
                }}
                onPress={() => {
                  continueButtonAction();
                }}
              />
            </View>
          </>
        )}
      </View>
      {/* // )} */}
    </KeyboardAwareScrollView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  buttontext: {
    ...theme.fonts.SourceSansPro_Regular_20,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: responsiveFontSize(1.6),
    color: theme.colors.white,
  },
});
