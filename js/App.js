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
type Props = {}
export default class App extends Component<Props> {

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
