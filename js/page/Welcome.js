/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {
    View,
    Text,
} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import NavigationBar from '../common/NavigationBar';
import {theme} from '../appSet';
import NavigationUtils from '../navigator/NavigationUtils';
import ChatSocket from '../util/ChatSocket';
import {connect} from 'react-redux';

class Welcome extends PureComponent {
    constructor(props) {
        super(props);
        // console.log('welcome执行');
        ChatSocket.setDispatch(this.props.dispatch);
    }

    state = {
        interVal: 100,

    };

    componentDidMount() {
        const {navigation} = this.props;
        NavigationUtils.navigation = navigation;
        this.timer = setInterval(() => {
            // this.setState
            console.log(this.state.interVal);
            this.setState({
                interVal: this.state.interVal - 100,
            }, () => {
                if (this.state.interVal === 0) {
                    NavigationUtils.toHomePage();
                }
            });


        }, 100);
        //申请微信注册

        // this.requestPermission();
    }


    componentWillUnmount() {
        this.timer && clearInterval(this.timer);

    }

    render() {
        const {interVal} = this.state;

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
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text>{interVal}ms进入HomePage</Text>
                </View>

            </SafeAreaViewPlus>
        );
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
});
const WelcomeRedux = connect(mapStateToProps, mapDispatchToProps)(Welcome);
export default WelcomeRedux;
