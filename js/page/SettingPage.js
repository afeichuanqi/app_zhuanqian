/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {StatusBar, View} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import {connect} from 'react-redux';


class SettingPage extends PureComponent {
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
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        const {userinfo} = this.props;

        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '设置', null, theme, 'black', 16);
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
                    {userinfo.login && ViewUtil.getSettingMenu('账号管理', () => {
                        NavigationUtils.goPage({}, 'AccountSetting');
                    })}
                    {ViewUtil.getSettingMenu('清理储存空间', () => {
                    }, '128.36KB')}
                    {/*{ViewUtil.getSettingMenu('隐私政策')}*/}
                    {ViewUtil.getSettingMenu('接单规则', () => {
                        NavigationUtils.goPage({type: 2}, 'UserProtocol');
                    })}
                    {ViewUtil.getSettingMenu('发单规则', () => {
                        NavigationUtils.goPage({type: 1}, 'UserProtocol');
                    })}
                    {ViewUtil.getSettingMenu('关于简单赚')}
                    {ViewUtil.getSettingMenu('检测新版本', () => {
                    }, '版本号:1.0.12')}
                </View>
            </SafeAreaViewPlus>
        );
    }

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onUploadAvatar: (token, data, callback) => dispatch(actions.onUploadAvatar(token, data, callback)),
});
const SettingPageRedux = connect(mapStateToProps, mapDispatchToProps)(SettingPage);
export default SettingPageRedux;
