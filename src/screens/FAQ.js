import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';

import {components} from '../components';
import {Images, theme} from '../constants';
import {svg} from '../assets/svg';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {setScreen} from '../store/tabSlice';
import BottomBar from './BottomBar';
import {setDashboardTab, setFAQTab} from '../store/bottomTabSlice';

const frequentlyQuestions = [
  {
    id: '1',
    question: "What's included with a free plan ?",
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '2',
    question: 'What content will my app have ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '3',
    question: 'Can I change my icon ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '4',
    question: 'What is a hybrid app ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '5',
    question: 'How do Push Alerts work ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '6',
    question: 'Why can’t the app upload files ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

const FAQ = () => {
  const navigation = useNavigation();
  const [activeSections, setActiveSections] = useState([]);

  const setSections = (sections) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };
  const screen = useSelector((state) => state.tab.screen);
  const insets = useSafeAreaInsets();
  const homeIndicatorHeight = insets.bottom;
  const dispatch = useDispatch();
  const tabs = [
    {
      name: 'Dashboard',
      icon: svg.DashboardSvg,
    },
    {
      name: 'Deposit',
      icon: svg.WalletSvg,
    },
    // {
    //   name: 'Loans',
    //   icon: svg.PercentageSvg,
    // },
    {
      name: 'DigiLocker',
      icon: svg.PercentageSvg,
    },
    {
      name: 'Notification',
      icon: svg.NotificationSvg,
    },
    {
      name: 'FAQ',
      icon: require('../assets/icons/faq.png'),
    },
    // {
    //   name: 'More',
    //   icon: svg.MoreSvg,
    // },
  ];
  const homeIndicatorSettings = () => {
    if (homeIndicatorHeight !== 0) {
      return homeIndicatorHeight;
    }
    if (homeIndicatorHeight === 0) {
      return 20;
    }
  };
  //Backbutton action in phone
  useEffect(() => {
    dispatch(setFAQTab(true));
    dispatch(setDashboardTab(false));
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
    //navigate to back
    navigation.goBack();
  };
  const renderHeader = () => {
    return (
      <components.Header
        goBack
        title={'FAQ'}
        backstyle={{
          marginRight: responsiveHeight(3),
          left: responsiveWidth(0),
          marginTop: 46,
        }}
        titleStyle={{
          marginRight: responsiveHeight(33),
          marginTop: 18,
        }}
      />
    );
  };

  const renderFaqHeader = (section, _, isActive) => {
    return (
      <View
        style={{
          paddingVertical: theme.sizes.paddingVertical_15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.colors.lightGrey,
          borderRadius: 10,
          paddingHorizontal: 20,
          marginBottom: theme.sizes.marginBottom_10,
          borderWidth: 1,
          borderColor: isActive ? theme.colors.newPrimaryColor : '#FFF7F2',
        }}
      >
        <Text
          style={{
            ...theme.fonts.SourceSansPro_Regular_16,
            lineHeight: theme.fonts.SourceSansPro_Regular_16.fontSize * 1.3,
            textTransform: 'capitalize',
            color: theme.colors.newPrimaryColor,
          }}
        >
          {section.question}
        </Text>
        {isActive ? <svg.ArrowCloseSvg /> : <svg.ArrowOpenSvg />}
      </View>
    );
  };

  const renderFaqContent = (section, _, isActive) => {
    return (
      <View
        style={{
          paddingLeft: 18,
          borderLeftWidth: 1,
          borderLeftColor: theme.colors.newPrimaryColor,
          marginTop: theme.sizes.marginTop_20,
          marginBottom: theme.sizes.marginBottom_30,
        }}
      >
        <View>
          <Text
            style={{
              ...theme.fonts.SourceSansPro_Regular_16,
              color: theme.colors.bodyTextColor,
            }}
          >
            {section.answer}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: theme.sizes.marginTop_10,
          backgroundColor: theme.colors.white,
        }}
      >
        <Accordion
          activeSections={activeSections}
          sections={frequentlyQuestions}
          touchableComponent={TouchableOpacity}
          renderHeader={renderFaqHeader}
          renderContent={renderFaqContent}
          duration={400}
          onChange={setSections}
          sectionContainerStyle={{
            marginHorizontal: 20,
          }}
        />
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      <ScrollView style={{height: responsiveHeight(73)}}>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
      <BottomBar style={{marginTop: responsiveHeight(0)}} />
    </components.SafeAreaView>
  );
};

export default FAQ;
