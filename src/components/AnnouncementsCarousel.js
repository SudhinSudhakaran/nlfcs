import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {
  responsiveWidth,
  responsiveScreenWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import DataManager from '../helpers/apiManager/DataManager';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import {Images, theme} from '../constants';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Announcements from '../screens/Announcements';
import LinearGradient from 'react-native-linear-gradient';
const AnnouncementsCarousel = () => {
  const width = Dimensions.get('window').width;
  const [announcementList, setAnnouncementList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const carouselRef = useRef(null);
  const DATA = [
    {
      name: 'test',
      announcement_body: `<body>
		<h2>Hi Sudhin!</h2>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p> 
	</body>`,
    },
    {
      name: 'test',
      announcement_body: `<body>
		<h2>Hi Sudhin!</h2>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p> 
	</body>`,
    },
    {
      name: 'test',
      announcement_body: `<body>
		<h2>Hi Sudhin!</h2>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p> 
	</body>`,
    },
    {
      name: 'test',
      announcement_body: `<body>
		<h2>Hi Sudhin!</h2>
	</body>`,
    },
    {
      name: 'test',
      announcement_body: `<body>
		<h2>Hi Sudhin!</h2>
	</body>`,
    },
    {
      name: 'test',
      announcement_body: `<body>
		<h2>Hi Sudhin!</h2>
	</body>`,
    },
    {
      name: 'test',
      announcement_body: `<body>
		<h2>Hi Sudhin!</h2>
	</body>`,
    },
  ];
  useFocusEffect(
    React.useCallback(() => {
      getAnnouncements();
      setCurrentIndex(1);
      return () => {};
    }, []),
  );
  /**
 <---------------------------------------------------------------------------------------------->
 * Purpose: Get announcement list
 * Created/Modified By: Sudhin Sudhakaran
 * Created/Modified Date: 28-06-2023
 * Steps:
 * 1.   call announcement api
 * 2.  Render in Html tag in carousel screen
 <---------------------------------------------------------------------------------------------->
 */
  // step 1
  const getAnnouncements = () => {
    setIsLoading(true);
    var formdata = new FormData();
    DataManager.getAnnouncements(formdata).then(
      ([isSuccess, message, data]) => {
        console.log('data', data);
        if (isSuccess === true && data?.status !== 'Token is Invalid') {
          if (
            data !== undefined &&
            data !== null &&
            data.status !== 'Token is Expired'
          ) {
            setAnnouncementList(data.slice(0, 3));
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      },
    );
  };
  //step 2
  const RenderItem = ({item, index}) => {
    var date = moment(item?.date).format('Y-MM-DD');
    const lastElement = announcementList.length === index + 1;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AnnouncementDetails', {item: item}); //id passed to announcement detail screen
        }}
      >
        <LinearGradient
          start={{x: 0.0, y: 0.0}}
          end={{x: 0.5, y: 1.7}}
          colors={[theme.colors.newRoundBgColor, theme.colors.newPrimaryColor]}
          style={{
            width: responsiveWidth(65),
            height: responsiveHeight(18),
            borderRadius: responsiveWidth(5),

            backgroundColor: '#E4FAE3',
            marginLeft: responsiveWidth(5),
            paddingHorizontal: 5,
            marginRight: lastElement ? responsiveWidth(5) : undefined,
          }}
        >
          {/* <Text
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            right: '4%',
            top: '4%',
            ...theme.fonts.SourceSansPro_Regular_10,
            color: 'white',
            lineHeight: theme.fonts.SourceSansPro_Regular_10.fontSize * 1.2,
          }}
        >{`${currentIndex} / ${announcementList.length}`}</Text> */}
          {/* 
        {announcementList.length > 1 ? (
          <TouchableOpacity
            onPress={() => {
              carouselRef?.current?.next();
            }}
            style={{
              width: 30,
              height: 30,
              position: 'absolute',
              alignSelf: 'flex-end',
              top: '40%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={Images.RIGHT_ARROW}
              style={{width: 25, height: 25, tintColor: theme.colors.mainDark}}
            />
          </TouchableOpacity>
        ) : null}
        {announcementList.length > 1 ? (
          <TouchableOpacity
            onPress={() => {
              carouselRef?.current?.prev();
            }}
            style={{
              width: 30,
              height: 30,
              position: 'absolute',
              alignSelf: 'flex-start',
              top: '40%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={Images.RIGHT_ARROW}
              style={{
                width: 25,
                height: 25,
                tintColor: theme.colors.mainDark,
                transform: [{scaleX: -1}],
              }}
            />
          </TouchableOpacity>
        ) : null} */}
          <Text
            style={{
              // ...theme.fonts.SourceSansPro_SemiBold_14,
              color: 'white',
              marginTop: Platform.OS === 'ios' ? '4.5%' : '3%',
              marginLeft: '5%',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 13,
            }}
          >
            {item?.name || ''}
          </Text>

          <View
            style={{
              height: '65%',
              width: '90%',

              marginLeft: '5%',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins-Light',
                fontSize: 10,
                color: 'white',
                overflow: 'hidden',
            
                textAlign: 'justify',
                fontWeight: '500',
              }}
              numberOfLines={6}
              ellipsizeMode='tail'
            >
              {item?.announcement_body.replace(/<[^>]+>/g, '') || ''}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'flex-start',
              height: '18%',

              position: 'absolute',
              width: '100%',
              bottom: 5,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 4,

                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              {/* <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_10,
                color: 'white',
                lineHeight: theme.fonts.SourceSansPro_Regular_10.fontSize * 1.2,
                textAlign: 'left',
              }}
            >
              {date}
            </Text> */}
            </View>
            <View style={{width: 30}} />
            {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('AnnouncementDetails', {item: item}); //id passed to announcement detail screen
            }}
            style={{
              flex: 1,
              borderRadius: 4,
              borderColor: theme.colors.mainDark,
              borderWidth: 0.7,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                ...theme.fonts.SourceSansPro_Regular_10,
                color: theme.colors.mainDark,
                lineHeight: theme.fonts.SourceSansPro_Regular_10.fontSize * 1.2,
              }}
            >
              View more
            </Text>
          </TouchableOpacity> */}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return isLoading ? (
    <View style={{marginTop: responsiveHeight(10)}}>
      {/* <ActivityIndicator color={theme.colors.newPrimaryColor} /> */}
    </View>
  ) : (
    <View style={{marginBottom: responsiveHeight(2)}}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: Platform.OS === 'ios' ? responsiveHeight(1) : undefined,
        }}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_SemiBold_16,
            color: theme.colors.newPrimaryColor,
            alignSelf: 'flex-start',
            marginBottom: 6,
            marginLeft: responsiveWidth(10),
          }}
        >
          New Announcements
        </Text>
        <Image
          source={Images.RIGHT_ARROW}
          style={{
            width: 25,
            height: 25,
            tintColor: theme.colors.mainDark,
            transform: [{scaleX: 1}],
          }}
        />
      </View>
      {announcementList.length > 0 ? (
        <>
          {/* <Carousel
          ref={carouselRef}
          loop={announcementList.length > 1}
          width={responsiveWidth(100)}
          height={responsiveWidth(100) / 2}
          autoPlay={false}
          // data={announcementList}
          data={DATA}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setCurrentIndex(index + 1)}
          renderItem={renderItem}
          snapEnabled={false}
          enabled={false}
        /> */}
          <ScrollView
            horizontal
            style={{
              marginTop:
                Platform.OS === 'ios' ? responsiveHeight(1) : undefined,
            }}
            showsHorizontalScrollIndicator={false}
          >
            {announcementList.map((item, index) => {
              return <RenderItem item={item} index={index} />;
            })}
          </ScrollView>
        </>
      ) : (
        <View
          style={{
            width: responsiveWidth(90),
            alignSelf: 'center',
            height: responsiveHeight(21),
            borderColor: theme.colors.mainDark,
            borderWidth: 0.7,
            borderRadius: 16,
            padding: responsiveWidth(8),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{textAlign: 'center', color: 'red'}}
          >{`${'No Announcement \n Available'}`}</Text>
        </View>
      )}
    </View>
  );
};

export default AnnouncementsCarousel;

const styles = StyleSheet.create({});
