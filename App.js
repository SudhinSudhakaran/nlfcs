import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {View, Text, Linking, BackHandler, Alert} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import store, {persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import VersionCheck from 'react-native-version-check';
import {CaptureProtection} from 'react-native-capture-protection';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import NoNetworkScreen from './src/screens/NoNetworkScreen';
const App = () => {
  const [isConnected, setIsConnected] = useState(true); // this state use for check internet connectivity
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    checkUpdateNeeded();
    //Disable screenshot
    allowScreenShot();
  }, []);
  const allowScreenShot = async () => {
    await CaptureProtection.allowScreenshot();
  };
  const checkUpdateNeeded = async () => {
    let updateNeeded = await VersionCheck.needUpdate();
    console.log('IsUpdate needed', updateNeeded);
    if (updateNeeded && updateNeeded.isNeeded) {
      //Alert the user and direct to the app url
      Alert.alert(
        'Please Update',
        'You will have to update your app to the latest version to continue using',
        [
          {
            text: 'Update',
            onPress: () => {
              BackHandler.exitApp();
              Linking.openURL(updateNeeded?.storeUrl);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsLoading(false); // Set isLoading to false when connectivity is checked
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const toastConfig = {
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
    success: (props) => {
      return props.isVisible ? (
        <BaseToast
          {...props}
          style={{borderLeftColor: 'green'}}
          contentContainerStyle={{paddingHorizontal: 15}}
          text1Style={{
            fontSize: 12,
            marginTop: 5,
            textAlign: 'left',
          }}
          text2Style={{
            fontSize: 10,
            textAlign: 'left',
          }}
        />
      ) : null;
    },
    /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
    error: (props) => (
      <ErrorToast
        {...props}
        style={{borderLeftColor: 'red'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 12,
          marginTop: 5,
          textAlign: 'left',
        }}
        text2Style={{
          fontSize: 10,
          textAlign: 'left',
        }}
      />
    ),
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
    info: (props) => (
      <BaseToast
        {...props}
        style={{borderLeftColor: '#5ED4FF', width: '90%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 12,
          marginTop: 5,
          textAlign: 'left',
        }}
        text2Style={{
          fontSize: 10,
          textAlign: 'left',
        }}
      />
    ),

    /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
    tomatoToast: ({text1, props}) => (
      <View
        style={{
          height: 50,
          width: '80%',
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{color: 'white', textAlign: 'left'}}>{text1}</Text>
      </View>
    ),
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {!isConnected ? (
              <NoNetworkScreen />
            ) : (
              <NavigationContainer>
                <StackNavigator />

                <Toast setRef={Toast.setRootRef} config={toastConfig} />
              </NavigationContainer>
            )}
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
