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
            barStyle: 'dark-content',
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        const {userinfo} = this.props;
        console.log(userinfo.login);
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
                    }, userinfo.login ? userinfo.userid : '', false)}

                    {ViewUtil.getSettingMenu('昵称', () => {
                        this.myModalBox.show();
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
                    onPress={() => {
                        this.props.onClearUserinfoAll();
                    }}
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
                <MyModalBox title={'修改昵称'} style={{
                    // height:
                    width: width - 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 5,
                }}
                            sureClick={this._sureClick}
                            rightTitle={'更新'}
                            ref={ref => this.myModalBox = ref}>
                    <View style={{
                        paddingBottom: 10,
                        width: width - 40,
                        paddingHorizontal: 15,
                    }}>
                        <TextInput
                            ref={ref => this.textInput = ref}
                            autoCapitalize={'none'}
                            autoComplete={'off'}
                            autoCorrect={'false'}
                            blurOnSubmit={false}
                            onChangeText={this._onChangeText}
                            maxLength={15}
                            multiline={true}
                            // placeholder={this.props.placeholder}

                            style={{
                                height: 50,
                                backgroundColor: '#e8e8e8',
                                marginTop: 10,
                                fontSize: 13,
                                paddingHorizontal: 5,
                                borderRadius: 5,
                                padding: 0,
                                textAlignVertical: 'top',
                                // borderWidth: this.animations.width,
                                // borderColor: `rgba(255, 0, 0, 1)`,

                            }}

                        />
                    </View>

                </MyModalBox>
            </SafeAreaViewPlus>
        );
    }

    username = '';
    _sureClick = () => {
        if (this.username.length == 0) {
            this.textInput.setNativeProps({
                style: {borderWidth: 1, borderColor: `rgba(255, 0, 0, 1)`},
            });
        } else {
            this.textInput.setNativeProps({
                style: {borderWidth: 0},
            });
            const {onSetUserName, userinfo} = this.props;
            onSetUserName(userinfo.token, this.username, () => {
                this.myModalBox.hide();
                this.username = '';
            });
        }
    };
    _onChangeText = (text) => {
        this.username = text;
    };
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
    onSetUserName: (token, value, callback) => dispatch(actions.onSetUserName(token, value, callback)),
    onClearUserinfoAll: () => dispatch(actions.onClearUserinfoAll()),
});
const AccountSettingRedux = connect(mapStateToProps, mapDispatchToProps)(AccountSetting);
export default AccountSettingRedux;
