/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import AppNavigators from './navigator/AppNavigators';
import {Provider} from 'react-redux';
import store from './store';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistStore} from 'redux-persist';
import CodePush from 'react-native-code-push';
import JAnalytics from 'janalytics-react-native';
import JPush from 'jpush-react-native';
import NavigationUtils from './navigator/NavigationUtils';

type Props = {}

// JAnalytics.rnCrashLogON();

export class App extends Component<Props> {
    JPushInit() {

        JPush.setLoggerEnable(true);
        this.localNotificationListener = result => {
            // console.log(result);
            if (result.notificationEventType === 'notificationOpened') {
                let pageName = '', navigationIndex = 0, type = result.messageID;
                if (type > 0 && type <= 3) {
                    pageName = 'TaskReleaseMana';
                    navigationIndex = type - 1;

                } else if (type > 3 && type <= 7) {
                    pageName = 'TaskOrdersMana';
                    navigationIndex = type - 4;
                } else if (type > 7 && type <= 10) {
                    pageName = 'UserBillListPage';
                    navigationIndex = type - 8;
                }
                if (pageName.length > 0) {
                    NavigationUtils.goPage({navigationIndex}, pageName);
                }
            }
        };
        JPush.addLocalNotificationListener(this.localNotificationListener);
        JPush.init();
        JPush.getRegistrationID((text)=>{
            console.log(text);
        })
        this.connectListener = result => {
            console.log('notificationListener:' + JSON.stringify(result));
        };
        // JPush.get
        //连接状态
        JPush.addConnectEventListener(this.connectListener);
        // //通知回调
        // this.notificationListener = result => {
        //     console.log('notificationListener:' + JSON.stringify(result));
        // };
        // JPush.addNotificationListener(this.notificationListener);
        // //本地通知回调
        // this.localNotificationListener = result => {
        //     console.log('localNotificationListener:' + JSON.stringify(result));
        // };
        // JPush.addLocalNotificationListener(this.localNotificationListener);
        // //自定义消息回调
        // this.customMessageListener = result => {
        //     console.log('customMessageListener:' + JSON.stringify(result));
        // };
        // JPush.addCustomMessagegListener(this.customMessageListener);
        // //tag alias事件回调
        // this.tagAliasListener = result => {
        //     console.log('tagAliasListener:' + JSON.stringify(result));
        // };
        // JPush.addTagAliasListener(this.tagAliasListener);
        // //手机号码事件回调
        // this.mobileNumberListener = result => {
        //     console.log('mobileNumberListener:' + JSON.stringify(result));
        // };
        // JPush.addMobileNumberListener(this.mobileNumberListener);
    }

    componentDidMount() {
        this.JPushInit();
        JAnalytics.setLoggerEnable({'enable': true});
        JAnalytics.crashLogON();
        JAnalytics.init({appKey: 'ee6b0ae7c80a1605fe528f83'});

    }

    render() {
        let persistor = persistStore(store);
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <AppNavigators/>
                </PersistGate>
            </Provider>
        );
    }
}

const codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME};
const AppCodePush = CodePush(codePushOptions)(App);
export default AppCodePush;
