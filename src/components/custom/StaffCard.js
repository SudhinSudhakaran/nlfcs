import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  Image,
} from 'react-native';
import React from 'react';

import {Images, theme} from '../../constants';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
const fontColor = '#cac85d';
const StaffCard = () => {
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const fullinfo = useSelector((state) => state.userDetails.fullinfo);

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0.0, y: 0.0}}
        end={{x: 0.5, y: 1.7}}
        colors={[theme.colors.newSecondaryColor, theme.colors.newPrimaryColor]}
        style={{
          width: responsiveWidth(85),
          height: responsiveHeight(26),
          overflow: 'hidden',
          backgroundColor: 'white',
          alignSelf: 'center',
          borderRadius: responsiveWidth(5),
        }}
      >
        <Image
          source={Images.FIRST_OVERLAY}
          style={styles.overlay}
          opacity={0.4}
        />
        <Image
          source={Images.SECOND_OVERLAY}
          style={styles.overlay}
          opacity={0.4}
        />
        <View
          style={{
            width: '100%',
            height: '100%',
          }}
          // source={Images.CARD}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              // backgroundColor: 'red',
              // marginVertical: '3%',
              // marginHorizontal: '8%',
            }}
          >
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.cardNumber,
                  {
                    color: theme.colors.white,
                    marginLeft: '10%',
                    marginTop: '9%',
                  },
                ]}
              >
                NLFCS Staff Card
              </Text>
              <Image
                style={{
                  width: '20%',
                  height: '20%',
                  marginLeft: '10%',
                  marginTop: '3%',
                }}
                source={Images.CHIP_ICON}
              />

              <Text
                style={[
                  styles.cardNumber,
                  {
                    color: theme.colors.white,
                    marginLeft: '10%',
                    marginTop: '7%',
                  },
                ]}
              >
                0000 {''} 0000{' '}
                {userDetails?.account_number?.replace(/(.{4})/g, ' $1 ') || ''}
              </Text>
              <Text
                style={[
                  styles.cardNumber,
                  {
                    color: theme.colors.white,
                    marginLeft: '10%',
                    marginTop: '4%',
                  },
                ]}
              >
                {userDetails?.name?.toUpperCase() || ''}
              </Text>
            </View>
            <View style={{width: '30%', height: '100%'}}>
              <Image
                style={{
                  height: '25%',
                  width: Platform.OS === 'android' ? '40%' : '45%',
                  alignSelf: 'flex-end',
                  marginRight: '20%',
                  marginTop: '25%',
                  resizeMode: 'cover',
                }}
                source={require('../../assets/images/nlfcs_logo_white.png')}
              />
              <Text
                style={{
                  fontFamily: 'RobotoSlab-Bold',
                  marginTop: '65%',
                  marginLeft: '0%',
                  color: 'white',
                }}
              >
                MEMBER
              </Text>
              <Text
                style={{
                  fontFamily: 'RobotoSlab-Bold',
                  marginTop: '0%',
                  marginLeft: '0%',
                  color: 'white',
                }}
              >
                FROM {moment(userDetails?.created_at).format('MM/YY')}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* <LinearGradient
        start={{x: 0.0, y: 0.0}}
        end={{x: 0.5, y: 1.7}}
       
        colors={[theme.colors.newSecondaryColor, theme.colors.newPrimaryColor]}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.patternContainer} />
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.cardNumber,
                {
                  color: theme.colors.white,
                  marginLeft: responsiveWidth(4),
                  marginTop: responsiveHeight(1),
                },
              ]}
            >
              NLFCS Member Card
            </Text>

            <Image
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
                marginLeft: responsiveWidth(4),
                marginTop: responsiveHeight(1),
              }}
              source={Images.SECURITY_ICON}
            />

            <Text
              style={[
                styles.cardNumber,
                {
                  marginLeft: responsiveWidth(4),
                  marginTop: responsiveHeight(1),
                  fontSize: responsiveFontSize(3.6),
                },
              ]}
            >
              0000 {''} 0000{' '}
              {userDetails?.account_number?.replace(/(.{4})/g, ' $1 ') || ''}
            </Text>

            <View
              style={{
                marginLeft: responsiveWidth(41),
                marginTop: responsiveHeight(1),
                flexDirection: 'row',
              }}
            >
              <View>
                <Text
                  style={{
                    color: theme.colors.white,
                    fontFamily: 'SourceSansPro-SemiBold',
                    fontSize: responsiveFontSize(1.5),
                  }}
                >
                  MEMBER
                </Text>
                <Text
                  style={{
                    color: theme.colors.white,
                    fontFamily: 'SourceSansPro-SemiBold',
                    fontSize: responsiveFontSize(1.5),
                  }}
                >
                  FROM
                </Text>
              </View>
            </View>
            <View
              style={{
                marginLeft: responsiveWidth(53),
                bottom: responsiveHeight(3),
              }}
            >
              <Text
                style={[
                  styles.cardNumber,
                  {
                    color: theme.colors.white,
                    fontFamily: 'SourceSansPro-SemiBold',
                    fontSize: responsiveFontSize(1.9),
                  },
                ]}
              >
                {moment(userDetails?.created_at).format('MM/YY')}
              </Text>
            </View>
            <Text
              style={[
                styles.cardNumber,
                {
                  marginLeft: responsiveWidth(4),
                  bottom: responsiveHeight(3),
                },
              ]}
            >
              {userDetails?.name?.toUpperCase() || ''}
            </Text>

            <Image
              style={{
                width: responsiveWidth(8),
                height: responsiveWidth(10),
                right: responsiveWidth(4),
                bottom: responsiveHeight(1),
                position: 'absolute',
              }}
              source={require('../../assets/images/nlfcs_logo_white.png')}
            />
          </View>
        </View>
      </LinearGradient> */}
    </View>
  );
};

export default StaffCard;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: responsiveWidth(100),
    height: responsiveHeight(26),
    marginBottom: responsiveHeight(2),
  },
  gradientContainer: {
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',

    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  gradient: {
    width: responsiveWidth(85),
    height: responsiveHeight(26),
    borderRadius:
      Platform.OS === 'android' ? responsiveHeight(2) : responsiveHeight(2),
    // justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardNumber: {
    color: theme.colors.white,
    fontFamily: 'RobotoSlab-Bold',
  },
  cardHolder: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  cardExpiration: {
    color: 'white',
    fontSize: 16,
  },
  patternContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pattern: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    width: '100%',
    height: '100%',
  },
});
