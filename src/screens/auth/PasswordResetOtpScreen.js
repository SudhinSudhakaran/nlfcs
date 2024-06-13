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
const PasswordResetOtpScreen = () => {
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
  const {memberId, password, confirmPassword} = route.params;
  useEffect(() => {
    return () => {
      setEnteredPin('');
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // setSecret(generateRandomKey(20));
      console.log('=======', memberId, password, confirmPassword);
      console.log('Globals.Toke', Globals.TOKEN);
      // addAccountToAuthenticator();

      return () => {};
    }, []),
  );

  const continueButtonAction = () => {
    isValidInputs();
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
      changePassword();
    }
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
  const validateOtp = async () => {};
  // API CALL
  /**
   * Purpose: Perform 2FA Verify 2FA Api impementation
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26 Jun 2023
   */

  const changePassword = () => {
    Keyboard.dismiss();
    setIsLoading(true);

    var _body = {
      [APIConnections.KEYS.ACCOUNT_NUMBER]: memberId,
      [APIConnections.KEYS.PASSWORD]: password,
      [APIConnections.KEYS.CONFIRM_PASSWORD]: confirmPassword,
      [APIConnections.KEYS.GOOGLE_2FA_SECRET]: enteredPin,
    };
    //converted to encoded url form
    const formBody = Object.keys(_body)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.performResetPassword(formBody).then(
      ([isSuccess, message, response]) => {
        console.log('response data ====>>>>', isSuccess, response);
        if (isSuccess === true) {
          Utilities.showToast(
            'Success',
            'Password reset successful',
            'success',
            'bottom',
          );

          setIsLoading(false);

          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'SignIn',
              },
            ],
          });
        } else {
          Utilities.showToast('Sorry!', message, 'error', 'bottom');
        }
      },
    );
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

export default PasswordResetOtpScreen;

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
