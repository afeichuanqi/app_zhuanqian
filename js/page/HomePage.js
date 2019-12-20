/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import {StatusBar} from 'react-native';

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    render() {

        return (
            <SafeAreaViewPlus
                topColor={theme}
                bottomInset={false}
            >
                <DynamicTabNavigator/>

            </SafeAreaViewPlus>
        );
    }
}

export default HomePage;
