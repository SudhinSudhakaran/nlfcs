import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  BackHandler,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';

import {components} from '../components';
import {Globals, theme} from '../constants';
import StorageManager from '../helpers/storageManager/StorageManager';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDetails} from '../store/userSlice';
import {PERMISSIONS} from 'react-native-permissions';
import {checkMultiplePermissions, checkPermission} from '../helpers/utils/Permission';
const onboardingData = [
  {
    id: 1,
    title: 'Welcome to NLFCS',
    description:
      'Labore sunt culpa excepteur culpa ipsum. Labore occaecat ex nisi mollit.',
    image: require('../assets/images/nlfcs_logo.png'),
  },
  {
    id: 2,
    title: 'Get a new card in a\nfew clicks!',
    description:
      'Labore sunt culpa excepteur culpa ipsum. Labore occaecat ex nisi mollit.',
    image: require('../assets/images/nlfcs_logo.png'),
  },
  {
    id: 3,
    title: 'Easy payments all\nover the world!',
    description:
      'Labore sunt culpa excepteur culpa ipsum. Labore occaecat ex nisi mollit.',
    image: require('../assets/images/nlfcs_logo.png'),
  },
];

const Onboarding = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();
  //redux states
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state) => state.authorization);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const temptoken = useSelector((state) => state.userDetails.temptoken);

  //Backbutton action in phone
  useEffect(() => {
    console.log('Temp===',Globals.TEMP_TOKEN)
    console.log('Tempstate===',temptoken)

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
    BackHandler.exitApp();
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
      existingUserAuthorizationSuccess();
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
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ],
        {cancelable: false},
      );
    }
  };
  const existingUserAuthorizationSuccess = () => {
    getIsUserLoggedIn().then((res) => {
      console.log('splash screen Globals.IS_AUTHORIZED',res);
      Globals.IS_AUTHORIZED = res === 'true' ? true : false;
      if (Globals.IS_AUTHORIZED === true) {
        console.log('1 Globals.IS_AUTHORIZED', Globals.IS_AUTHORIZED);
        getToken().then((_token) => {
          Globals.TEMP_TOKEN = _token;
          console.log('1 token', Globals.TEMP_TOKEN);
          getUserDetails().then((userIfo) => {
            Globals.USER_DETAILS = userIfo;
            dispatch(setUserDetails(userIfo));
              navigation.navigate('OtpScreen');
          });
          getUserEmail().then((userIfo) => {
            Globals.USER_EMAIL = userIfo;
          });
          getUserPassword().then((userIfo) => {
            Globals.PASSWORD = userIfo;
          });
        });
      } else {
        navigation.navigate('SignIn');
        console.log('2 Globals.IS_AUTHORIZED', Globals.IS_AUTHORIZED);
      }
    });
  };
  //Local storage fetch
  const getIsUserLoggedIn = async () => {
    return await StorageManager.getIsAuth();
  };
  const getToken = async () => {
    return await StorageManager.getSavedToken();
  };
  const getUserDetails = async () => {
    return await StorageManager.getUserDetails();
  };
  const getUserEmail = async () => {
    return await StorageManager.getUserEmail();
  };
  const getUserPassword = async () => {
    return await StorageManager.getUserPassword();
  };
  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / theme.sizes.width);
    setCurrentSlideIndex(currentIndex);
  };

  const renderStatusBar = () => {
    return (
      <StatusBar
        barStyle='light-content'
        translucent={true}
        backgroundColor={theme.colors.transparent}
      />
    );
  };

  const renderImageBackground = () => {
    return (
      <components.Image
        source={require('../assets/bg/03.png')}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
    );
  };

  const renderSlides = () => {
    return (
      <ScrollView
        ref={ref}
        horizontal={true}
        pagingEnabled={true}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{
          paddingTop: responsiveHeight(3),
          paddingBottom: responsiveHeight(4),
        }}
        style={{
          flexGrow: 0,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {onboardingData.map((item, index) => {
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: responsiveHeight(10),
                marginBottom: responsiveWidth(10),
                width: responsiveWidth(100),
              }}
            >
              <View
                key={index}
                style={{
                  width: responsiveWidth(60),
                  alignItems: 'center',
                  justifyContent: 'center',
                  //
                  height: responsiveWidth(60),
                  borderRadius: responsiveWidth(30),
                  backgroundColor: theme.colors.white,
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: responsiveWidth(50),
                    height: responsiveWidth(50),
                    borderRadius: responsiveWidth(25),
                    alignSelf: 'center',
                  }}
                  resizeMode={'contain'}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderContent = () => {
    return (
      <View style={{paddingHorizontal: 20}}>
        {onboardingData.map((item, index) => {
          return (
            <View key={index}>
              {currentSlideIndex === index && (
                <View>
                  <Text
                    style={{
                      color: theme.colors.white,
                      ...theme.fonts.SourceSansPro_SemiBold_32,
                      lineHeight:
                        theme.fonts.SourceSansPro_SemiBold_32.fontSize * 1.2,
                      marginBottom: theme.sizes.marginBottom_14,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: '#B4B4C6',
                      ...theme.fonts.SourceSansPro_Regular_16,
                      lineHeight:
                        theme.fonts.SourceSansPro_Regular_16.fontSize * 1.6,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={{paddingHorizontal: 20, flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {onboardingData.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: theme.sizes.width_20,
                  height: 2,
                  marginRight: 10,
                  backgroundColor: theme.colors.white,
                  opacity: currentSlideIndex === index ? 1 : 0.3,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: responsiveHeight(6),
        }}
      >
        <TouchableOpacity
          style={{
            width: responsiveWidth(40),
            backgroundColor: theme.colors.lightGrey,
            paddingVertical: responsiveHeight(1.5),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: responsiveHeight(1),
          }}
          onPress={() => {
            openCamera();
            // navigation.navigate('SignInCode');
          }}
        >
          <Text
            style={{
              color: theme.colors.mainDark,
              ...theme.fonts.SourceSansPro_SemiBold_16,
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: theme.colors.white,
            position: 'absolute',
            bottom: 10,
            left: 20,
            right: 0,
            textAlign: 'center',
          }}
        >
          0.0.65
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.mainDark}}>
      {renderImageBackground()}
      <SafeAreaView edges={['top', 'bottom']} style={{flex: 1}}>
        {renderStatusBar()}
        {renderSlides()}
        {renderContent()}
        {renderDots()}
        {renderButton()}
      </SafeAreaView>
    </View>
  );
};

export default Onboarding;
