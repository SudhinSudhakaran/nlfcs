import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import {components} from '../components';
import {svg} from '../assets/svg';
import {Globals, Images, theme} from '../constants';
import DisplayUtils from '../helpers/utils/DisplayUtils';
import {useDispatch, useSelector} from 'react-redux';

import APIConnections from '../helpers/apiManager/APIConnections';
import ProfileImageLoader from './ProfileImageLoader';
import {
  setMemberLoading,
  setShareDetails,
  setUserDetails,
} from '../store/userSlice';
import {setIsAuthorized} from '../redux/slice/authenticationSlice';
import StorageManager from '../helpers/storageManager/StorageManager';

import DataManager from '../helpers/apiManager/DataManager';
import Utilities from '../helpers/utils/Utilities';

const Header = ({
  goBack,
  creditCard,
  goBackFromTickets,
  onPress,
  user,
  userTitleStyle,
  title,
  backstyle,
  containerStyle,
  titleStyle,
  goBackColor,
  numberOfLines,
  file,
  showRound,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const memberLoading = useSelector((state) => state.userDetails.memberLoading);
  useEffect(() => {
    getUserDetails();
  }, []);
  useEffect(() => {
    dispatch(setMemberLoading(true));
    if (userDetails !== null || userDetails !== undefined) {
      setTimeout(() => {
        dispatch(setMemberLoading(false));
      }, 1000);
    }
  }, []);
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
          setTimeout(() => {
            dispatch(setMemberLoading(false));
          }, 1000);
        } else {
          setTimeout(() => {
            dispatch(setMemberLoading(false));
          }, 1000);
        }
      } else {
        Utilities.showToast('Failed', message, 'error', 'bottom');
        setTimeout(() => {
          dispatch(setMemberLoading(false));
        }, 1000);
      }
    });
  };
  const renderGoBack = () => {
    if (goBack) {
      return (
        <View
          style={{
            right: 30,
            bottom: 15,
            alignItems: 'center',
            marginTop: DisplayUtils.setHeight(3.2),
            ...backstyle,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            onPress={() => navigation.goBack()}
          >
            <svg.GoBackSvg color={goBackColor} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };
  const renderGoBackFromTickets = () => {
    if (goBackFromTickets) {
      return (
        <View
          style={{
            right: 30,
            bottom: 15,
            alignItems: 'center',
            marginTop: DisplayUtils.setHeight(3.2),
            ...backstyle,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            onPress={onPress}
          >
            <svg.GoBackSvg color={goBackColor} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };
  const renderTitle = () => {
    if (title) {
      return (
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_18,
            lineHeight: theme.fonts.SourceSansPro_Regular_18.fontSize * 1.2,
            color: theme.colors.mainDark,
            ...titleStyle,
          }}
          numberOfLines={numberOfLines}
        >
          {title}
        </Text>
      );
    }

    if (!title) {
      return null;
    }
  };

  const renderCreditCard = () => {
    if (creditCard) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            paddingHorizontal: 20,
          }}
          onPress={() => navigation.navigate('CardMenu')}
        >
          <svg.CreditCardSvg />
        </TouchableOpacity>
      );
    }

    if (!creditCard) {
      return null;
    }
  };

  const renderUser = () => {
    if (user) {
      return (
        <>
          {showRound && (
            <View
              style={{
                backgroundColor: theme.colors.newRoundBgColor,
                width: responsiveWidth(100),
                height: responsiveWidth(100),
                borderRadius: responsiveWidth(80),
                position: 'absolute',

                left: responsiveWidth(-35),
                top: responsiveHeight(-25),
              }}
            />
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 0,
              alignItems: 'center',
              paddingHorizontal: 20,
              flexDirection: 'row',
            }}
            onPress={() => navigation.navigate('Profile')}
          >
            {/* {memberLoading === true ? (
            <ProfileImageLoader />
          ) : ( */}
            <>
              {userDetails?.profile_picture !== undefined ||
              userDetails?.profile_picture !== null ? (
                <Image
                  style={{
                    alignSelf: 'center',
                    width: responsiveHeight(5),
                    borderRadius: responsiveHeight(1.5),
                    height: responsiveHeight(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  source={{
                    uri: 'http://' + userDetails?.profile_picture,
                  }}
                />
              ) : (
                <Image
                  style={{
                    alignSelf: 'center',
                    width: responsiveHeight(5),
                    height: responsiveHeight(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  source={Images.DEFAULT_PROFILE_IMAGE}
                />
              )}
              <Text
                style={{
                  color: theme.colors.newPrimaryColor,
                  fontFamily: 'Poppins-SemiBold',
                  // textTransform: 'capitalize',
                  ...userTitleStyle,
                }}
              >
                {userDetails?.name
                  ?.split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ') ||
                  Globals?.USER_DETAILS?.name
                    ?.split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
              </Text>
            </>
            {/* )} */}
          </TouchableOpacity>
        </>
      );
    }

    if (!user) {
      return null;
    }
  };

  const renderFile = () => {
    if (file) {
      return (
        <View style={{position: 'absolute', right: 0, alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            onPress={() => {}}
          >
            <svg.FileTextSvg />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View
      style={{
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...containerStyle,

        marginTo: 20,
      }}
    >
      {renderGoBack()}
      {renderGoBackFromTickets()}
      {renderTitle()}
      {renderUser()}
      {renderFile()}
      {/* {renderCreditCard()} */}
    </View>
  );
};

export default Header;
