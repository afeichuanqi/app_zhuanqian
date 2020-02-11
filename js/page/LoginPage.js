/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, TextInput, Dimensions, TouchableOpacity, StatusBar, Image} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import SvgUri from 'react-native-svg-uri';
import phone_input_clear from '../res/svg/phone_input_clear.svg';
import gantanhao from '../res/svg/gantanhao.svg';
import {authorizeWechat, isPoneAvailable} from '../util/CommonUtils';
import {sendSms} from '../util/AppService';
import BackPressComponent from '../common/BackPressComponent';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import JShareModule from 'jshare-react-native';
import Toast from 'react-native-root-toast';
import actions from '../action';
import {connect} from 'react-redux';
import LoddingModal from '../common/LoddingModal';

const {width, height} = Dimensions.get('window');

class LoginPage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;


        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {};
    phone = '';

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this.backPress.componentDidMount();
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
        this.backPress.componentWillUnmount();
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    _pwdInputOnChangeText = (text) => {
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
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
            barStyle: 'dark-content',
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '', null, 'white', 'black', 14, null, false);
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
                        fontSize: hp(2.7),
                        color: 'black',
                    }}>{this.params.updatePhone ? '账号绑定' : '账号登录'}</Text>
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
                            <Text style={{color: 'white', fontSize: hp(2.3)}}>获取验证码</Text>
                        </TouchableOpacity>
                        {/*遮挡物*/}
                        <View
                            ref={ref => this.zhedang = ref}
                            style={{
                                position: 'absolute', top: 55,
                                width: width - 90,
                                height: 50,
                                borderRadius: 30,
                            }}/>


                    </View>
                    {/*第三方登录*/}
                    {!this.params.updatePhone && <View style={{
                        position: 'absolute', bottom: hp(15), justifyContent: 'center',
                        alignItems: 'center', width,
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: hp(3)}}>
                            <View style={{width: wp(20), height: 1, backgroundColor: '#dedede', borderRadius: 5}}/>
                            <Text style={{
                                marginHorizontal: 10,
                                color: 'rgba(0,0,0,0.6)',
                                fontSize: hp(1.6),
                            }}>您还可以用以下方式登录</Text>
                            <View style={{width: wp(20), height: 1, backgroundColor: '#dedede', borderRadius: 5}}/>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={this.handleWechatAuthorize}
                            >
                                <Image
                                    source={require('../res/img/share/wechat.png')}
                                    style={{width: hp(6), height: hp(6)}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    JShareModule.authorize({
                                        platform: 'weibo',
                                    },(info)=>{
                                        console.log(info);
                                    },(msg)=>{
                                        console.log(msg);
                                    })
                                }}
                            >
                                <Image
                                    source={require('../res/img/share/xinlangweibo.png')}
                                    style={{width: hp(6), height: hp(6), marginLeft: hp(3)}}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>}

                    {/*登录即将同意*/}
                    <View style={{
                        height: 20, width,
                        position: 'absolute',
                        bottom: hp(1.5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            fontSize: hp(1.5),
                            color: 'rgba(0,0,0,0.5)',
                        }}>{this.params.updatePhone ? '绑定' : '登录'}即代表已阅读并同意</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                NavigationUtils.goPage({type: 3}, 'UserProtocol');
                            }}
                        >
                            <Text style={{fontSize: hp(1.5), color: bottomTheme}}>用户服务协议与隐私协议</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <LoddingModal
                    ref={ref => this.loddingModal = ref}
                />
            </SafeAreaViewPlus>
        );
    }

    handleWechatAuthorize = () => {
        this.loddingModal.show();
        authorizeWechat((bool, data) => {
            this.loddingModal.hide();
            if (bool) {
                this.props.onWechatAuthorizeLogin({
                    open_id: data.open_id,
                    access_token: data.access_token,
                }, (bool, data) => {
                    if (bool) {
                        Toast.show('登录成功');
                        NavigationUtils.goBack(this.props.navigation);
                    } else {
                        Toast.show(data.msg);
                    }
                });
            } else {
                if (data.code == '40009') {
                    Toast.show('未安装微信客户端');
                }else{
                    Toast.show('授权失败');
                }

            }
        });


    };
    _getCode = () => {
        this.phoneInput.onBlur();
        const isTrue = isPoneAvailable(this.phone);
        if (!isTrue) {
            this.phoneInput.showError('手机号码格式错误，请重新输入');
        } else {
            this.phoneInput.showError('');
        }
        if (isTrue) {
            sendSms({phone: this.phone}).then(() => {
                this.phoneInput.showError('');
                NavigationUtils.goPage({updatePhone: this.params.updatePhone, phone: this.phone}, 'EnterCodePage');
            }).catch((msg) => {
                this.phoneInput.showError(!msg ? '网络错误' : msg);
            });
        }
    };
}

class PhoneInput extends PureComponent {
    state = {
        phone: '',
        errMsg: '',
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
    showError = (errMsg) => {
        this.setState({
            errMsg,
        });
    };
    onBlur = () => {
        this.textInput.blur();
    };

    render() {
        const {phone, errMsg} = this.state;
        return <>
            <TextInput
                ref={ref => this.textInput = ref}
                value={phone}
                dataDetectorTypes={'phoneNumber'}
                placeholder={'请输入手机号码'}
                maxLength={13}
                keyboardType={'number-pad'}
                onChangeText={this._pwdInputOnChangeText}
                style={{
                    width: width - 80,
                    fontSize: hp(2.3),
                    color: 'rgba(0,0,0,0.8)',
                    padding: 0,
                    height: 30,
                }}/>
            {phone.length > 0 &&
            <TouchableOpacity
                onPress={this._clearInput}
                style={{position: 'absolute', top: 10, right: 50}} fill={'rgba(0,0,0,0.6)'}
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
            {errMsg.length > 0 && <View
                ref={ref => this.errorInfo = ref}
                style={{
                    position: 'absolute', top: 40, left: 40,
                    flexDirection: 'row', alignItems: 'center', opacity: 1,

                }}>
                <SvgUri
                    style={{marginHorizontal: 5}}
                    width={13}
                    height={13}
                    svgXmlData={gantanhao}/>
                <Text style={{color: 'red', fontSize: 12}}>{errMsg}</Text>
            </View>}

        </>;
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    onWechatAuthorizeLogin: (data, callback) => dispatch(actions.onWechatAuthorizeLogin(data, callback)),
});
const LoginPageRedux = connect(mapStateToProps, mapDispatchToProps)(LoginPage);
export default LoginPageRedux;
