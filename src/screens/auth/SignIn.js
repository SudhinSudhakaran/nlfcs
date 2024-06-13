import React, {useEffect, useState} from 'react';
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
import jwt_decode from 'jwt-decode';
const SignIn = ({navigation}) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [memberId, setMemberId] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [signAsStaff, setSignAsStaff] = useState('staff');

  const {isAccountAdded, secretKey} = useSelector(
    (state) => state.googleAuthenticator,
  );
  const isAuthorized = useSelector((state) => state.authorization);
  const userPassword = useSelector((state) => state.userDetails.userPassword);
  const userDetails = useSelector((state) => state.userDetails.userDetails);

  const dispatch = useDispatch();
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const generateRandomKey = (digits) => {
    let randomKey = '';
    for (let i = 0; i < digits; i++) {
      randomKey += base32Chars[Math.floor(Math.random() * base32Chars.length)];
    }
    return randomKey;
  };
  // useEffect(() => {
  //   if (secretKey === undefined) {
  //     let key = generateRandomKey(20);
  //     dispatch(setSecretKey(userDetails?.google2fa_secret));
  //   }

  //   console.log('secretKey in sign in', secretKey);
  //   return () => {};
  // }, []);

  const handleRegister = () => {
    navigation.navigate('SignUp');
  };
  const ClearStaffAction = () => {
    navigation.navigate('StaffTabNavigator');
    Keyboard.dismiss();
    setMemberId('');
    setPassword('');
  };
  const ClearMemberAction = () => {
    performLogin();
    Keyboard.dismiss();
    setMemberId('');
    setPassword('');
  };
  /** Purpose:  Validation Function
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 16-06-2023
   * Steps:
   1. Initially set 2 variables value=0
   2. checked the password fields with conditions
   * conditions are......
   * checked password and email length equals zero
   * checked password and email length less than 6
   3. if these conditions are false displayed error message
   4. also set declared variable values equal zero if the conditions are false
   5. If the conditions are true set the declared variable values equal one
   6. If conditions true navigate to login api call
   *  */
  const validateField = () => {
    var _isValidEmail = 0;
    var _isValidPassword = 0;
    if (memberId.length <= 0) {
      setEmailErrorText('Please enter member id');
      _isValidEmail = 0;
    } else {
      setEmailErrorText('');
      _isValidEmail = 1;
    }
    if (password.length === 0) {
      setPasswordError('Please enter password');
      _isValidPassword = 0;
    } else if (password.length < 6) {
      setPasswordError('Must contain at least 6 or more characters');
      _isValidPassword = 0;
    } else {
      setPasswordError('');
      _isValidPassword = 1;
    }
    if (_isValidEmail === 1 && _isValidPassword === 1) {
      if (isConnected) {
        performLogin();
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

  // const validateField = () => {
  //   var _isValidEmail = 0;
  //   var _isValidPassword = 0;
  //   if (memberId.length <= 0) {
  //     setEmailErrorText('Please enter member/staff id');
  //     _isValidEmail = 0;
  //   }
  //   if (memberId !== '20221001' && memberId !== '50105010') {
  //     setEmailErrorText('Please enter valid id');
  //     _isValidEmail = 0;
  //   } else {
  //     setEmailErrorText('');
  //     _isValidEmail = 1;
  //   }
  //   if (password.length === 0) {
  //     setPasswordError('Please enter password');
  //     _isValidPassword = 0;
  //   } else if (password !== '123456' && password !== 'staff123') {
  //     setPasswordError('Please enter valid password');
  //     _isValidEmail = 0;
  //   } else if (password.length < 6) {
  //     setPasswordError('Must contain at least 6 or more characters');
  //     _isValidPassword = 0;
  //   } else {
  //     setPasswordError('');
  //     _isValidPassword = 1;
  //   }
  //   if (
  //     _isValidEmail === 1 &&
  //     _isValidPassword === 1 &&
  //     memberId === '20221001' &&
  //     password === '123456'
  //   ) {
  //     if (isConnected) {
  //       ClearMemberAction();
  //       // navigation.navigate('OtpScreen');
  //       // navigation.navigate('TabNavigator');
  //     } else {
  //       Utilities.showToast(
  //         'Sorry!',
  //         'Please check your internet connection',
  //         'error',
  //         'bottom',
  //       );
  //     }
  //   } else if (
  //     _isValidEmail === 1 &&
  //     _isValidPassword === 1 &&
  //     memberId === '50105010' &&
  //     password === 'staff123'
  //   ) {
  //     if (isConnected) {
  //       ClearStaffAction();
  //       // navigation.navigate('OtpScreen', {staff: 'isfromstafflogin'});
  //     } else {
  //       Utilities.showToast(
  //         'Sorry!',
  //         'Please check your internet connection',
  //         'error',
  //         'bottom',
  //       );
  //     }
  //   } else if (password === 'staff123') {
  //     setPasswordError('Please enter valid password');
  //   } else if (password === 'member123') {
  //     setPasswordError('Please enter valid password');
  //   }
  // };

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
  const decodeToken = (token) => {
    const decodedToken = jwt_decode(token);
    console.log('decodedToken =', decodedToken);
    Globals.TEMP_TOKEN = token;
    console.log('Temptoken====', Globals.TEMP_TOKEN);
    navigation.navigate('OtpScreen', {tempToken: token});
  };
  // API CALL
  /**
   * Purpose: Perform login api
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 9 Jun 2023
   */

  const performLogin = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    var _body = {
      [APIConnections.KEYS.ACCOUNT_NUMBER]: memberId,
      [APIConnections.KEYS.PASSWORD]: password,
    };

    const formBody = Object.keys(_body)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
      )
      .join('&');

    DataManager.performEmailLogin(formBody).then(
      ([isSuccess, message, response]) => {
        console.log('response data ====>>>>', isSuccess, response);
        if (isSuccess === true) {
          dispatch(setTempToken(response.token));
          StorageManager.saveIsAuth('true');
          StorageManager.saveToken(response?.token);
          Globals.TEMP_TOKEN = response?.token;
          console.log('Temptoken====', Globals.TEMP_TOKEN);
          // decode the token
          // decodeToken(response?.token);
          navigation.navigate('OtpScreen', {tempToken: response?.token});

          dispatch(setUserPassword(password));
          StorageManager.saveUserEmail(memberId);
          StorageManager.saveUserPassword(password);
          Globals.USER_EMAIL = memberId;
          Globals.PASSWORD = password;
          // getUserDetails();
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
   * Purpose: Get userDetail
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 12 Jun 2023
   * Steps:
     1.fetch user details from API and append to state variable
*/

  const getUserDetails = () => {
    dispatch(setMemberLoading(true));
    var formdata = new FormData();
    DataManager.getUserDetails(formdata).then(([isSuccess, message, data]) => {
      if (isSuccess === true && data.status !== 'Token is Invalid') {
        if (
          data !== undefined &&
          data !== null &&
          data.status !== 'Token is Expired'
        ) {
          data?.share?.map((item) => {
            item = item;
            dispatch(setShareDetails(item));
          });
          StorageManager.saveUserDetails(data.user);
          Globals.USER_DETAILS = data.user;
          dispatch(setUserDetails(data.user));
          console.log('?????', userDetails, secretKey);
          if (
            secretKey === undefined ||
            secretKey === '' ||
            secretKey === null
          ) {
            let key = generateRandomKey(20);
            dispatch(setSecretKey(userDetails?.google2fa_secret));
            if (memberId === '10000001') {
              navigation.navigate('StaffTabNavigator', {
                staff: 'isfromstafflogin',
              });
            } else {
              navigation.navigate('OtpScreen', {tempToken: response.token});
            }
          }
          setTimeout(() => {
            dispatch(setMemberLoading(false));
          }, 1000);
        } else {
          setTimeout(() => {
            dispatch(setMemberLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast('Failed', data?.status, 'error', 'bottom');
        setTimeout(() => {
          dispatch(setMemberLoading(false));
        }, 1000);
      }
    });
  };
  const renderHeader = () => {
    // return <components.Header goBack={true} />;
  };

  const renderStatusBar = () => {
    return (
      <StatusBar barStyle='dark-content' backgroundColor={theme.colors.white} />
    );
  };
  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        alwaysBounceVertical={false}
        enableResetScrollToCoords={true}
        keyboardShouldPersistTaps={'always'}
        contentInsetAdjustmentBehavior={'automatic'}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_SemiBold_32,
            lineHeight: theme.fonts.SourceSansPro_SemiBold_32.fontSize * 1.6,
            color: theme.colors.mainDark,
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          Welcome to NLFCS!
        </Text>
        <components.InputField
          emailIcon={true}
          placeholder='Member ID'
          containerStyle={{marginBottom: theme.sizes.marginBottom_10}}
          checkIcon={true}
          onChangeText={setMemberId}
          value={memberId}
          keyboardType={'numeric'}
        />
        <Text
          style={{
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            color: 'red',
            ...theme.fonts.SourceSansPro_Regular_10,
          }}
        >
          {emailErrorText}
        </Text>

        <components.InputField
          keyIcon={true}
          placeholder='Password'
          secureTextEntry={isShowPassword}
          eyeOffIcon={true}
          onChangeText={setPassword}
          eyeButtonAction={setIsShowPassword}
          containerStyle={{
            marginBottom: theme.sizes.marginBottom_10,
            marginTop: theme.sizes.marginTop_20,
          }}
          value={password}
          onSubmitEditing={() => {
            validateField();
          }}
        />
        <Text
          style={{
            marginLeft: 37,
            marginRight: 7,
            textAlign: 'right',
            color: 'red',
            ...theme.fonts.SourceSansPro_Regular_10,
          }}
        >
          {passwordError}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.sizes.marginBottom_30,
          }}
        >
          <TouchableOpacity
            style={{marginLeft: 'auto'}}
            onPress={() => navigation.navigate('PasswordResetScreen')}
          >
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_16,
                lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                color: theme.colors.mainDark,
                marginTop: theme.sizes.marginBottom_12,
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
        <components.Button
          title='Sign In'
          containerStyle={{marginBottom: theme.sizes.marginBottom_30}}
          onPress={() => {
            validateField();
          }}
        />
        {/* <components.Button
          title='Sign In With Google Authenticator'
          containerStyle={{marginBottom: theme.sizes.marginBottom_30}}
          onPress={() => {
            // navigation.navigate('TabNavigator');
          }}
        /> */}
        {/* <ParsedText
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
            color: theme.colors.bodyTextColor,
          }}
          parse={[
            {
              pattern: /Register now/,
              style: {color: theme.colors.mainColor},
              onPress: handleRegister,
            },
          ]}
        >
          No account? Register now
        </ParsedText> */}
      </KeyboardAwareScrollView>
    );
  };
  return (
    <components.SafeAreaView background={true}>
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default SignIn;
