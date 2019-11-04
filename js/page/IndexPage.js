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
import NavigationBar from '../common/NavigationBar';
import SearchComponent from '../common/SearchComponent';

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
    }


    componentDidMount() {


    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);

    }

    render() {

        let statusBar = {
            hidden: false,
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                <SearchComponent
                    onFocus={this.SearchOnFocus}
                />
            </SafeAreaViewPlus>
        );
    }

    SearchOnFocus = () => {
        console.log('我被触发');
    };
}

export default HomePage;
