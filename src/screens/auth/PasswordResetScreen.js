import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ParsedText from 'react-native-parsed-text';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {components} from '../../components';
import {Globals, theme} from '../../constants';
import {svg} from '../../assets/svg';
import Utilities from '../../helpers/utils/Utilities';
import {useDispatch, useSelector} from 'react-redux';
import {setIsAuthorized} from '../../redux/slice/authenticationSlice';
import {setSecretKey} from '../../store/googleAuthenticatorSlice';
import DataManager from '../../helpers/apiManager/DataManager';
import APIConnections from '../../helpers/apiManager/APIConnections';
import StorageManager from '../../helpers/storageManager/StorageManager';
import {
  setMemberLoading,
  setShareDetails,
  setTempToken,
  setUserDetails,
  setUserPassword,
} from '../../store/userSlice';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BottomBar from '../BottomBar';

const PasswordResetScreen = ({navigation}) => {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const otpRef = useRef();
  //Declaration
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isConfirmPassword, setIsConfirmPassword] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isShowOldPassword, setIsShowOldPassword] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  //Validations
  const [oldpasswordError, setOldPasswordError] = useState('');
  const [newpasswordError, setNewPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [isValidEnteredPin, setIsValidEnteredPin] = useState(true);
  const [pinValidationMessage, setPinValidationMessage] = useState('');
  const [networkValidation, setNetworkValidation] = useState('');
  // API CALL
  /**
   * Purpose: Perform change password api
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 14 Jun 2023
   */

  const performChangePassword = () => {
    setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.OLD_PASSWORD]: oldPassword,
      [APIConnections.KEYS.NEW_PASSWORD]: newPassword,
      [APIConnections.KEYS.CONFIRM_PASSWORD]: confirmPassword,
    };
    //converted to encoded url form
    const formBody = Object.keys(_body)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.performChangePassword(formBody).then(
      ([isSuccess, message, response]) => {
        console.log('response data ====>>>>', isSuccess, response);
        if (isSuccess === true) {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          Utilities.showToast(
            'Success',
            'Password has been changed successfully',
            'success',
            'bottom',
          );
          setIsLoading(false);
        } else {
        }
      },
    );
  };

  /** Save button action
   * keyboard dismissed
   * go to the validation function
   */
  const continueButtonAction = () => {
    Keyboard.dismiss();
    validateField();
  };
  /** Purpose:  Validation
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   1. Initially set 3 variables value=0
   2. checked the password fields with conditions
   * conditions are......
   * checked password length equals zero
   * checked password length less than 6
   * checked Old password is match
   * checked new password and confirm password match
   3. if these conditions are false displayed error message
   4. also set declared variable values equal zero if the conditions are false
   5. If the conditions are true set the declared variable values equal one
   6. If conditions true navigate to changepassword api call
   *  */
  const validateField = () => {
    var _isValidOldPassword = 0;
    var _isValidNewPassword = 0;
    var _isValidConfirmPassword = 0;
    var _isValidEnteredPin = 0;
    // if (enteredPin) {
    //   setPinValidationMessage('');
    //   setIsValidEnteredPin(true);
    //   _isValidEnteredPin = 1;
    // } else {
    //   setPinValidationMessage('please enter your valid PIN');
    //   setIsValidEnteredPin(false);
    //   _isValidEnteredPin = 0;
    // }
    if (memberId?.length === 0) {
      _isValidOldPassword = 0;
      setOldPasswordError('Please enter member id');
    } else {
      _isValidOldPassword = 1;
      setOldPasswordError('');
    }
    if (newPassword.length === 0) {
      setNewPasswordError('Please enter new password');
      _isValidNewPassword = 0;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Must contain at least 6 characters');
      _isValidNewPassword = 0;
    } else {
      setNewPasswordError('');
      _isValidNewPassword = 1;
    }
    if (confirmPassword.length === 0) {
      setConfirmPasswordError('Please enter confirm password');
      _isValidConfirmPassword = 0;
    } else if (confirmPassword.length < 6) {
      setConfirmPasswordError('Must contain at least 6 characters');
      _isValidConfirmPassword = 0;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('New password and confirm password do not match');
      _isValidConfirmPassword = 0;
    } else {
      setConfirmPasswordError('');
      _isValidConfirmPassword = 1;
    }
    if (
      _isValidOldPassword === 1 &&
      _isValidNewPassword === 1 &&
      // _isValidEnteredPin === 1 &&
      _isValidConfirmPassword === 1
    ) {
      if (isConnected) {
        // api call
        // performChangePassword();
        navigation.navigate('PasswordResetOtpScreen', {
          memberId: memberId,
          password: newPassword,
          confirmPassword: confirmPassword,
        });
        // changePassword();
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
   * Purpose: Perform 2FA Verify 2FA Api impementation
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 26 Jun 2023
   */

  const changePassword = () => {
    Keyboard.dismiss();
    setIsLoading(true);

    var _body = {
      [APIConnections.KEYS.ACCOUNT_NUMBER]: memberId,
      [APIConnections.KEYS.PASSWORD]: newPassword,
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

  const renderHeader = () => {
    return (
      <components.Header
        goBack={true}
        title='Reset password'
        titleStyle={{marginRight: responsiveWidth(30)}}
      />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: theme.sizes.marginTop_20,
          paddingBottom: theme.sizes.paddingBottom_20,
        }}
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        alwaysBounceVertical={false}
        enableResetScrollToCoords={true}
        keyboardShouldPersistTaps={'always'}
        contentInsetAdjustmentBehavior={'automatic'}
        showsVerticalScrollIndicator={false}
      >
        <components.InputField
          ref={oldPasswordRef}
          emailIcon={true}
          placeholder='Member ID'
          value={memberId}
          onChangeText={(text) => setMemberId(text.trim())}
          eyeOffIcon={false}
          // onSubmitEditing={() => {
          //   confirmPasswordRef.current.focus();
          // }}
        />
        <Text
          style={{
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            marginBottom: newpasswordError ? responsiveHeight(1) : 0,
            marginTop: newpasswordError ? responsiveHeight(1) : 0,
            color: 'red',
            ...theme.fonts.SourceSansPro_Regular_10,
          }}
        >
          {oldpasswordError}
        </Text>
        <components.InputField
          ref={newPasswordRef}
          keyIcon={true}
          placeholder='Enter new password'
          secureTextEntry={isShowPassword}
          value={newPassword}
          onChangeText={(text) => setNewPassword(text.trim())}
          eyeButtonAction={setIsShowPassword}
          eyeOffIcon={true}
          // onSubmitEditing={() => {
          //   confirmPasswordRef.current.focus();
          // }}
        />
        <Text
          style={{
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            marginBottom: oldpasswordError ? responsiveHeight(1) : 0,
            marginTop: oldpasswordError ? responsiveHeight(1) : 0,
            color: 'red',
            ...theme.fonts.SourceSansPro_Regular_10,
          }}
        >
          {newpasswordError}
        </Text>
        <components.InputField
          ref={confirmPasswordRef}
          placeholder='Confirm new password'
          keyIcon={true}
          secureTextEntry={isConfirmPassword}
          inputstyle={{}}
          eyeOffIcon={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text.trim())}
          eyeButtonAction={setIsConfirmPassword}
          onSubmitEditing={() => {
            continueButtonAction();
          }}
        />
        <Text
          style={{
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            color: 'red',
            marginBottom: confirmpasswordError ? responsiveHeight(1) : 0,
            marginTop: confirmpasswordError ? responsiveHeight(1) : 0,
            ...theme.fonts.SourceSansPro_Regular_10,
          }}
        >
          {confirmpasswordError}
        </Text>
        <components.Button
          title='Reset'
          buttonstyle={{
            marginTop: responsiveHeight(3),
            width: responsiveWidth(30),
            height: responsiveWidth(10),
            alignSelf: 'center',
          }}
          onPress={() => continueButtonAction()}
        />

        {/* <>
          <View style={{marginTop: responsiveHeight(2), alignSelf: 'center'}}>
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
                marginLeft: 37,
                marginRight: 7,
                textAlign: 'right',
                marginBottom: oldpasswordError ? responsiveHeight(1) : 0,
                marginTop: oldpasswordError ? responsiveHeight(1) : 0,
                color: 'red',
                ...theme.fonts.SourceSansPro_Regular_10,
              }}
            >
              {pinValidationMessage ? pinValidationMessage : networkValidation}
            </Text>
            <components.Button
              title='Reset'
              textStyle={{}}
              containerStyle={{
                marginBottom: theme.sizes.marginBottom_30,
                alignItems: 'center',
                marginTop: responsiveHeight(10),
              }}
              onPress={() => continueButtonAction()}
            />
          </View>
        </> */}
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default PasswordResetScreen;
