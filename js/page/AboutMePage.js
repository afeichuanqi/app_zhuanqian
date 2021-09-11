/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions, StyleSheet, Text,
    View, TouchableOpacity, StatusBar,Image,
} from 'react-native';
import {connect} from 'react-redux';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;

class AboutMePage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {};
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        StatusBar.setTranslucent(false);
        StatusBar.setBarStyle('light-content', false);
        StatusBar.setBackgroundColor(bottomTheme, false);
        this.backPress.componentDidMount();
        // this._updatePage(true);
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    render() {

        let statusBar = {
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '关于我们', null, bottomTheme, 'white', hp(2.4), null, false);

        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <View style={{
                        width,
                        marginTop: hp(9),

                    }}>
                        <Image
                            style={{
                                width: hp(15),
                                height: hp(15),
                                alignSelf: 'center',
                                borderRadius: hp(2),
                            }}
                            source={require('../res/img/AbountPage/logo.png')}
                        />
                    </View>
                    <View style={{marginTop: hp(5), alignSelf: 'center'}}>
                        <Text style={{fontSize: hp(3.3)}}>简单兼职赚钱 easy ~</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationUtils.goPage({type: 3}, 'UserProtocol');
                        }}
                        style={{
                            marginTop: hp(10),
                            alignSelf: 'center',
                        }}>
                        <Text>
                            <Text style={{color: bottomTheme, fontSize: hp(2.4)}}>《用户协议》与《隐私政策》</Text>
                            {/*<Text style={{}}>与</Text>*/}
                        </Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaViewPlus>
        );
    }

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
});
const AboutMePageRedux = connect(mapStateToProps, mapDispatchToProps)(AboutMePage);


export default AboutMePageRedux;
