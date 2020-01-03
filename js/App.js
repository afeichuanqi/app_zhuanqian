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

type Props = {}
// JAnalytics.rnCrashLogON();

export class App extends Component<Props> {
    componentDidMount() {
        // const accountInfo = {
        //     accountID: 'accountID1',
        //     name: 'name1',
        //     creationTime: 12312123123,
        //     sex: 1,
        //     paid: 2,
        //     birthday: '19900101',
        //     phone: '123414123',
        //     email: '380108184@qq.com',
        //     weiboID: 'weibo213123',
        //     wechatID: 'wechatID21123',
        //     qqID: 'qqid 1231',
        //     extras: {
        //         accountKey1: 'accountValue1',
        //         accountKey2: "accountValue2"
        //     }
        // };
        JAnalytics.setLoggerEnable({'enable': true});
        JAnalytics.crashLogON();
        JAnalytics.init({appKey: 'ee6b0ae7c80a1605fe528f83'});
        // JAnalytics.postEvent({
        //         type: 'register',
        //         extra: {
        //             'registerKey': 'registerValue',
        //         },
        //         method: 'register',
        //         success: true,
        //     },
        // );
        // JAnalytics.identifyAccount(accountInfo, () => {
        //         console.log("identifyAccount success");
        //     }, (errMsg) => {
        //         console.log("identifyAccount fail:" + errMsg);
        //     }
        // )
        // JAnalytics.detachAccount(() => {
        //         console.log("detachAccount success");
        //     }, (errMsg) => {
        //         console.log("detachAccount fail:" + errMsg);
        //     }
        // )
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
