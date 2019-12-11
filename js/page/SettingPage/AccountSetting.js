/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import SafeAreaViewPlus from '../../common/SafeAreaViewPlus';
import {theme} from '../../appSet';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtils from '../../navigator/NavigationUtils';
import actions from '../../action';
import {connect} from 'react-redux';
import PickerSex from '../../common/PickerSex';
import MyModalBox from '../../common/MyModalBox';
import BackPressComponent from '../../common/BackPressComponent';

const {width} = Dimensions.get('window');

class AccountSetting extends PureComponent {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    state = {};

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }


    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
            barStyle: 'dark-content',
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        const {userinfo} = this.props;
        // console.log(userinfo.login);
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '账号管理', null, theme, 'black', 16,()=>{},false);
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
                    }, userinfo.login ? userinfo.userid : '', false)}

                    {ViewUtil.getSettingMenu('昵称', () => {
                        NavigationUtils.goPage({},'UpdateUserName')
                        // this.myModalBox.show();
                    }, userinfo.login ? userinfo.username : '')}
                    {ViewUtil.getSettingMenu('性别', () => {
                        this.pickerSex.show();
                    }, userinfo.login ? userinfo.sex == 0 ? '男' : '女' : '请完善')}


                    {ViewUtil.getSettingMenu('手机号码', () => {
                    }, userinfo.login ? userinfo.phone : '', false)}
                    {ViewUtil.getSettingMenu('微信', () => {
                    }, '立即绑定')}
                </View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this._clearAccountInfo}
                    style={{
                        position: 'absolute',
                        bottom: 50,
                        width,
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                    <Text style={{color: 'red'}}>退出当前账号</Text>
                </TouchableOpacity>
                <PickerSex select={this._sexSelect} ref={ref => this.pickerSex = ref} popTitle={'性别'}/>

            </SafeAreaViewPlus>
        );
    }

    _clearAccountInfo = () => {
        this.props.onClearUserinfoAll();
        NavigationUtils.goBack(this.props.navigation)
    };
    username = '';

    _sexSelect = (sex) => {
        const {onSetUserSex, userinfo} = this.props;
        onSetUserSex(userinfo.token, sex, () => {
            this.pickerSex.hide();
        });
        // this.hide();
    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onSetUserSex: (token, value, callback) => dispatch(actions.onSetUserSex(token, value, callback)),
    // onSetUserName: (token, value, callback) => dispatch(actions.onSetUserName(token, value, callback)),
    onClearUserinfoAll: () => dispatch(actions.onClearUserinfoAll()),
});
const AccountSettingRedux = connect(mapStateToProps, mapDispatchToProps)(AccountSetting);
export default AccountSettingRedux;
