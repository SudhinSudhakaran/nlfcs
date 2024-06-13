/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
Text.defaultProps = Text.defaultProps || {}; //this props used for disable font size increase in automatically all over app
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => App);
