/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import SvgUri from 'react-native-svg-uri';
import phone_input_clear from '../res/svg/phone_input_clear.svg';
import gantanhao from '../res/svg/gantanhao.svg';
import {isPoneAvailable} from '../util/CommonUtils';

const {width, height} = Dimensions.get('window');

class LoginPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {};
    phone = '';

    componentDidMount() {

        this.loginBtn.setNativeProps({
            style: {
                opacity: 0.3,
            },
        });
        this.zhedang.setNativeProps({
            style: {
                height: 50,
            },
        });
    }

    componentWillUnmount() {

    }

    _pwdInputOnChangeText = (text) => {
        // this.setState({phone: text});
        console.log('我被触发');
        if (text.length > 0) {
            this.loginBtn.setNativeProps({
                style: {
                    opacity: 1,
                },
            });
            this.zhedang.setNativeProps({
                style: {
                    height: 0,
                },
            });
        } else {
            this.loginBtn.setNativeProps({
                style: {
                    opacity: 0.3,
                },
            });
            this.zhedang.setNativeProps({
                style: {
                    height: 50,
                },
            });
        }
        this.phone = text;
    };

    render() {
        // const {phone} = this.state;

        let statusBar = {
            hidden: false,
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '', null);
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <Text style={{
                        marginTop: 40,
                        marginLeft: 40,
                        fontSize: 20,
                    }}>账号登录</Text>
                    <View style={{width, justifyContent: 'center', alignItems: 'center', marginTop: 80}}>


                        <PhoneInput
                            ref={ref => this.phoneInput = ref}
                            onChangeText={this._pwdInputOnChangeText}/>


                        {/*获取验证码按钮*/}
                        <TouchableOpacity
                            ref={ref => this.loginBtn = ref}
                            activeOpacity={0.6}
                            onPress={this._getCode}
                            style={[{
                                marginTop: 40,
                                width: width - 90,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: bottomTheme,
                                borderRadius: 30,
                                // opacity: 0.3,
                            }]}>
                            <Text style={{color: 'white', fontSize: 17}}>获取验证码</Text>
                        </TouchableOpacity>
                        {/*遮挡物*/}
                        <View
                            ref={ref => this.zhedang = ref}
                            style={{
                                position: 'absolute', top: 55,
                                width: width - 90,
                                height: 50,
                                borderRadius: 30,
                            }}>

                        </View>

                    </View>
                    {/*登录即将同意*/}
                    <View style={{
                        height: 20, width,
                        position: 'absolute',
                        bottom: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <Text style={{fontSize: 11, color: 'rgba(0,0,0,0.5)'}}>登录即代表已阅读并同意</Text>
                        <Text style={{fontSize: 11, color: bottomTheme}}>用户服务协议</Text>
                        <Text style={{fontSize: 11, color: 'rgba(0,0,0,0.5)'}}>即</Text>
                        <Text style={{fontSize: 11, color: bottomTheme}}>隐私协议</Text>
                    </View>
                </View>

            </SafeAreaViewPlus>
        );
    }

    _getCode = () => {
        const isTrue = isPoneAvailable(this.phone);

        this.phoneInput.showError(!isTrue);
        if (isTrue) {
            NavigationUtils.goPage({},'EnterCodePage')
        }
    };
    _goBackClick = () => {
        NavigationUtils.goBack(this.props.navigation);
    };
}

class PhoneInput extends PureComponent {
    state = {
        phone: '',
    };
    nextInput = 0;
    _pwdInputOnChangeText = (text) => {
        if (this.nextInput < text.length) {
            if (text.length === 3 || text.length === 8) {
                text = text + ' ';
            }
        }
        this.nextInput = text.length;
        this._setPhone(text);
    };
    _clearInput = () => {
        this._setPhone('');

    };
    _setPhone = (phone) => {
        this.setState({
            phone: phone,
        });
        phone = phone.replace(/\s+/g, '');
        // console.log(phone);
        // if(isPoneAvailable(phone)){
        //
        // }
        this.props.onChangeText(phone);
    };
    showError = (show) => {
        if (show) {
            this.errorInfo.setNativeProps({
                style: {
                    opacity: 1,
                },
            });
        } else {
            this.errorInfo.setNativeProps({
                style: {
                    opacity: 0,
                },
            });
        }

    };

    render() {
        const {phone} = this.state;

        return <>
            <TextInput
                value={phone}
                dataDetectorTypes={'phoneNumber'}
                // clearButtonMode={'always'}
                placeholder={'请输入手机号码'}
                maxLength={13}
                keyboardType={'number-pad'}
                onChangeText={this._pwdInputOnChangeText}
                // multiline = {false}
                style={{
                    border: 0,
                    width: width - 80,
                    fontSize: 15,
                    color: 'rgba(0,0,0,0.8)',
                }}/>
            {phone.length > 0 &&
            <TouchableOpacity
                onPress={this._clearInput}
                style={{position: 'absolute', top: 2, right: 50}} fill={'rgba(0,0,0,0.6)'}
                activeOpacity={0.7}>
                <SvgUri width={15}
                        height={15}
                        svgXmlData={phone_input_clear}/>
            </TouchableOpacity>
            }

            <View style={{
                width: width - 80,
                height: 0.3,
                marginTop: 5,
                backgroundColor: 'rgba(0,0,0,0.1)',
            }}/>
            <View
                ref={ref => this.errorInfo = ref}
                style={{
                    position: 'absolute', top: 30, left: 40,
                    flexDirection: 'row', alignItems: 'center', opacity: 0,

                }}>
                <SvgUri
                    style={{marginHorizontal: 5}}
                    width={13}
                    height={13}
                    svgXmlData={gantanhao}/>
                <Text style={{color: 'red', fontSize: 11}}>手机号码格式错误,请重新输入</Text>
            </View>
        </>;
    }
}

export default LoginPage;
