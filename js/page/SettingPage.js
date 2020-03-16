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
import BackPressComponent from '../common/BackPressComponent';
import ClearCache from 'react-native-clear-cache';

class SettingPage extends PureComponent {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {
        CacheSize: 0,


    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this.backPress.componentDidMount();
        ClearCache.getAppCacheSize(data => {
            this.setState({
                CacheSize: data,
            });
        });

    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }


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
        const {userinfo} = this.props;
        const {CacheSize} = this.state;

        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '设置', null, theme, 'black', 16, null, false);
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
                        ClearCache.clearAppCache(data => {
                            this.setState({
                                CacheSize: 0,
                            });
                        });
                    }, `${CacheSize < 1 ? `${CacheSize * 1024}KB` : `${CacheSize}M`}`)}
                    {/*{ViewUtil.getSettingMenu('隐私政策')}*/}
                    {ViewUtil.getSettingMenu('接单规则', () => {
                        NavigationUtils.goPage({type: 2}, 'UserProtocol');
                    })}
                    {ViewUtil.getSettingMenu('发单规则', () => {
                        NavigationUtils.goPage({type: 1}, 'UserProtocol');
                    })}
                    {ViewUtil.getSettingMenu('用户协议与隐私政策', () => {
                        NavigationUtils.goPage({type: 3}, 'UserProtocol');
                    })}
                    {/*{ViewUtil.getSettingMenu('关于简单赚')}*/}
                    {/*{ViewUtil.getSettingMenu('检测新版本', () => {*/}
                    {/*}, '版本号:1.0.12')}*/}
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
