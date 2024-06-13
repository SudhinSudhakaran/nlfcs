/**
    * Purpose:* upload file view
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 30 June 2023

    */

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Linking,
  Platform,
  TextInput,
  Keyboard,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Image from 'react-native-scalable-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {SafeAreaView} from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-viewing-rtl';
import {CaptureProtection} from 'react-native-capture-protection';
const UploadImageFullView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedDocument, setSelectedDocument] = useState('');
  const [showFullScreenDoc, setFullScreenDoc] = useState(false);

  const allowScreenShot = async () => {
    await CaptureProtection.allowScreenshot();
  };

  //Backbutton action in phone
  useEffect(() => {
    setSelectedDocument(route?.params?.item);
    setFullScreenDoc(true);
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
    navigation.pop(2);
    allowScreenShot();
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          alwaysBounceVertical={false}
          enableResetScrollToCoords={true}
          keyboardShouldPersistTaps={'always'}
          contentInsetAdjustmentBehavior={'automatic'}
          showsVerticalScrollIndicator={false}
        >
          <ImageViewer
            images={[{uri: route?.params?.item}]}
            index={0}
            visible={showFullScreenDoc}
            enablePreload={true}
            useNativeDriver={true}
            onRequestClose={() => setFullScreenDoc(false)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  };

  return <View style={{flex: 1}}>{renderContent()}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textareaContainer: {
    padding: 5,
    backgroundColor: '#f5f5ef',
  },
  textarea: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    height: responsiveHeight(15),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.7,
  },
});
export default UploadImageFullView;
