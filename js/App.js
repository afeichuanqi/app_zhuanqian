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

type Props = {}

export class App extends Component<Props> {

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
