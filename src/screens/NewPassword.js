import {Keyboard, Text, Alert} from 'react-native';
import React, {useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {components} from '../components';
import {Globals, theme} from '../constants';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Utilities from '../helpers/utils/Utilities';
import DataManager from '../helpers/apiManager/DataManager';
import StorageManager from '../helpers/storageManager/StorageManager';
import APIConnections from '../helpers/apiManager/APIConnections';
import {useRoute} from '@react-navigation/native';
import {HelperText} from 'react-native-paper';
import BottomBar from './BottomBar';
import {useSelector, useDispatch} from 'react-redux';
const NewPassword = ({navigation}) => {
  const route = useRoute();
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const dispatch = useDispatch();
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
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  //Validations
  const [oldpasswordError, setOldPasswordError] = useState('');
  const [newpasswordError, setNewPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const userDetails = useSelector((state) => state.userDetails.userDetails);
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
          if (route?.params?.isFromOTP === true) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignIn',
                },
              ],
            });
          } else {
            route?.params?.fromSignIn
              ? navigation.goBack()
              : navigation.navigate('Profile');
          }
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
            dispatch(setMemberLoading(false));
          }, 1000);
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
    Globals.USER_DETAILS = {};
    Globals.IS_AUTHORIZED = false;
    Globals.TOKEN = '';
    Globals.USER_EMAIL = '';
    dispatch(setIsAuthorized(false));
    StorageManager.clearUserRelatedData();
    Keyboard.dismiss();
    //Navigate to SignIn
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
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

    if (oldPassword.length === 0) {
      setOldPasswordError('Please enter old password');
      _isValidOldPassword = 0;
    } else if (oldPassword.length < 6) {
      setOldPasswordError('Must contain at least 6 characters');
      _isValidOldPassword = 0;
    } else if (Globals.PASSWORD !== oldPassword) {
      setOldPasswordError('Old password do not match');
      _isValidOldPassword = 0;
    } else {
      setOldPasswordError('');
      _isValidOldPassword = 1;
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
      _isValidConfirmPassword === 1
    ) {
      if (isConnected) {
        // api call
        performChangePassword();
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
  const renderHeader = () => {
    return (
      <components.Header
        goBack={true}
        title='Change password'
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
          keyIcon={true}
          placeholder='Enter old password'
          secureTextEntry={isShowOldPassword}
          value={oldPassword}
          onChangeText={(text) => setOldPassword(text.trim())}
          eyeButtonAction={setIsShowOldPassword}
          eyeOffIcon={true}
          // onSubmitEditing={() => {
          //   newPasswordRef.current.focus();
          // }}
        />
        <Text
          style={{
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            color: 'red',
            ...theme.fonts.SourceSansPro_Regular_10,
            marginBottom: oldpasswordError ? responsiveHeight(1) : 0,
            marginTop: oldpasswordError ? responsiveHeight(1) : 0,
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
            marginBottom: newpasswordError ? responsiveHeight(1) : 0,
            marginTop: newpasswordError ? responsiveHeight(1) : 0,
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
          title='Save'
          buttonstyle={{
            marginTop: responsiveHeight(3),
            width: responsiveWidth(30),
            height: responsiveWidth(10),
            alignSelf: 'center',
          }}
          onPress={() => continueButtonAction()}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView background={true}>
      {renderHeader()}
      {renderContent()}
      {route?.params?.isFromOTP === false ||
        (userDetails?.user_type === 'customer' && (
          <BottomBar style={{marginTop: responsiveHeight(16)}} />
        ))}
    </components.SafeAreaView>
  );
};

export default NewPassword;
