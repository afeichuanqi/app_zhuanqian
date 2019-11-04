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
        this.timer && clearInterval(this.timer);

    }

    render() {
        // const {interVal} = this.state;
        //
        // let statusBar = {
        //     hidden: false,
        // };
        // let navigationBar = <NavigationBar
        //     hide={true}
        //     statusBar={statusBar}
        // />;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                <DynamicTabNavigator/>

            </SafeAreaViewPlus>
        );
    }
}

export default HomePage;
