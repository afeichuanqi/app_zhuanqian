/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Linking, Platform} from 'react-native';
import AppNavigators from './navigator/AppNavigators';
import {Provider} from 'react-redux';
import store from './store';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistStore} from 'redux-persist';
import CodePush from 'react-native-code-push';
import JAnalytics from 'janalytics-react-native';
import JPush from 'jpush-react-native';
import NavigationUtils from './navigator/NavigationUtils';
import qs from 'qs';

type Props = {}

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
            JPush.setBadge({badge: 0, appBadge: 0});
        };
        this.NotificationListener = result => {
            JPush.setBadge({badge: 0, appBadge: 0});
        };
        JPush.addLocalNotificationListener(this.localNotificationListener);
        JPush.addNotificationListener(this.NotificationListener);

        JPush.init();
        JPush.getRegistrationID((text) => {
            console.log(text);
        });
        this.connectListener = result => {
            console.log('notificationListener:' + JSON.stringify(result));
        };
        //连接状态
        JPush.addConnectEventListener(this.connectListener);
    }


    _handleOpenURL(event) {
        if (event.url) {
            const prefix = Platform.OS === 'android' ? 14 : 8;
            const url = event.url;
            const coverdomain = url.substring(prefix);
            const findIndex = coverdomain.indexOf('?');
            const funName = coverdomain.substring(0, findIndex);
            const paramsStr = coverdomain.substring(findIndex + 2);
            console.log(funName, paramsStr);
            if (funName === 'openTask') {
                NavigationUtils.goPage({
                    test: false,
                    task_id: qs.parse(paramsStr).task_id,
                }, 'TaskDetails');
            } else if (funName === 'shareFriend') {
                NavigationUtils.goPage({
                    invitationId: qs.parse(paramsStr).invitation_id,
                }, 'InvitationCodePage');
            }
        }
    }

    componentWillUnmount(): void {
        Linking.removeEventListener('url', this._handleOpenURL);
    }

    componentDidMount() {
        this.JPushInit();
        Linking.addEventListener('url', this._handleOpenURL);
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
