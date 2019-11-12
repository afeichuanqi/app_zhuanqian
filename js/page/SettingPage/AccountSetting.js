/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, Dimensions} from 'react-native';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import {theme} from '../../appSet';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtils from '../../navigator/NavigationUtils';

const {width} = Dimensions.get('window');

class AccountSetting extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {};

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    _goBackClick = () => {
        this.props.navigation.goBack();
    };

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '账号管理', null, theme, 'black', 16);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{
                    borderTopWidth: 0.3,
                    borderTopColor: 'rgba(0,0,0,0.1)',
                }}/>
                <View style={{flex: 1}}>
                    {ViewUtil.getSettingMenu('账号ID', () => {
                        NavigationUtils.goPage({}, 'AccountSetting');
                    })}
                    {ViewUtil.getSettingMenu('手机号码', () => {
                    }, '15061142750')}
                    {ViewUtil.getSettingMenu('微信', () => {
                    }, '立即绑定')}
                </View>
                <View style={{
                    position: 'absolute',
                    bottom: 50,
                    width,
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <Text style={{color:'red',}}>退出当前账号</Text>
                </View>
            </SafeAreaViewPlus>
        );
    }

}

export default AccountSetting;
