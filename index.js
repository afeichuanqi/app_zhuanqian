/**
 * @format
 */
import 'react-native-gesture-handler'
import {AppRegistry} from 'react-native';
import App from './js/App';
import {name as appName} from './app.json';
// if (!__DEV__) {
//     global.console = {
//         info: () => {
//         },
//         log: () => {
//         },
//         warn: () => {
//         },
//         debug: () => {
//         },
//         error: () => {
//         },
//     };
//
//
// }
AppRegistry.registerComponent(appName, () => App);
