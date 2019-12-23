/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {View, Text, TextInput, TouchableOpacity, Platform} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtils from '../navigator/NavigationUtils';
import {connect} from 'react-redux';
import actions from '../action';
import {sendSms} from '../util/AppService';
import SvgUri from 'react-native-svg-uri';
import gantanhao from '../res/svg/gantanhao.svg';
import DeviceInfo from 'react-native-device-info';
import ChatSocket from '../util/ChatSocket';
import BackPressComponent from '../common/BackPressComponent';
import Global from '../common/Global';

export default class EnterCodePage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    state = {};
    phone = '';

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }


    render() {
        // const {phone} = this.state;

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
                        fontSize: 20,
                        color:'black'
                    }}>输入验证码</Text>
                    {/*<View></View>*/}
                    <Text style={{
                        marginLeft: 40,
                        fontSize: 12,
                        marginTop: 10,
                        opacity: 0.6,
                        color:'black'
                    }}>验证码已经发送至{this.params.phone}</Text>

                    <CodeInputRedux showError={this._showError} phone={this.params.phone}
                                    navigation={this.props.navigation}/>
                    <AgainSend ref={ref => this.againSend = ref}/>

                </View>

            </SafeAreaViewPlus>
        );
    }

    _showError = (msg) => {
        this.againSend.showError(msg);
    };
}

class AgainSend extends PureComponent {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.star();
    }

    state = {
        isSend: true,
        interVal: 60,
        errorMsg: '',
    };
    star = () => {
        this.setState({
            isSend: true,
            interVal: 60,
        }, () => {

            this.timer = setInterval(() => {
                const interVal = this.state.interVal;
                if (interVal === 1) {
                    this.setState({
                        isSend: false,
                    });
                    this.timer && clearInterval(this.timer);
                }
                this.setState({
                    interVal: interVal - 1,
                });
            }, 1000);
        });
    };

    componentWillUnmount() {

        this.timer && clearInterval(this.timer);
    }

    showError = (msg) => {
        this.setState({
            errorMsg: msg,
        });
    };

    render() {
        const {isSend, interVal, errorMsg} = this.state;
        return <View

            style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 20,
                paddingHorizontal: 40,
            }}>
            {errorMsg && errorMsg.length > 0 ? <View
                ref={ref => this.errorInfo = ref}
                style={{
                    flexDirection: 'row', alignItems: 'center', marginRight: 20,

                }}>
                <SvgUri
                    style={{marginHorizontal: 5}}
                    width={13}
                    height={13}
                    svgXmlData={gantanhao}/>
                <Text style={{color: 'red', fontSize: 12}}>{errorMsg}</Text>
            </View> : <View/>}

            {isSend ? <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Text style={{color: bottomTheme, fontSize: 13}}>{interVal}S</Text>
                <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 13}}>后重发</Text>
            </View> : <TouchableOpacity
                activeOpacity={0.5}
                onPress={this._againSendSms}

            >
                <Text style={{color: bottomTheme, fontSize: 13}}>重新发送</Text>
            </TouchableOpacity>}
        </View>;
    }

    _againSendSms = () => {
        const {phone} = this.props;
        sendSms(phone).then(() => {
            this.setState({
                errorMsg: '',
            }, () => {
                this.star();
            });

        }).catch((msg) => {
            this.setState({
                errorMsg: msg,
            });
        });


    };
}

class CodeInput extends PureComponent {
    static defaultProps = {
        iptNum: 4,
    };

    constructor(props) {
        super(props);
        this.iptArrayNum = new Array(props.iptNum);

    }

    componentDidMount() {
        setTimeout(() => {
            this.refs['text0'] && this.refs['text0'].focus();
        }, 500);

    }

    getCodeIpt = (index) => {

        return <View
            key={index}
            style={{
                width: 50,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
                marginHorizontal: 5,
                // justifyContent:'center',
            }}>
            <TextInput
                value={this.iptArrayNum[index]}
                keyboardType={'number-pad'}
                onKeyPress={({nativeEvent}) => {
                    if (index == 0) {
                        return;
                    }
                    if (nativeEvent.key === 'Backspace') {
                        this.refs[`text${index - 1}`].focus();
                        this.iptArrayNum[index - 1] = '';
                        if (index == this.props.iptNum - 1) {
                            this.iptArrayNum[index] = '';
                        }
                    }
                    this.forceUpdate();
                }}
                onChangeText={(text) => {
                    if (text.length > 0) {
                        this.iptArrayNum[index] = text;
                        if (index + 1 <= this.props.iptNum - 1) {//防止最后一个进行focus
                            this.refs[`text${index + 1}`].focus();
                        }
                        if (index + 1 == this.props.iptNum) {
                            this.refs[`text3`] && this.refs[`text3`].blur();
                            setTimeout(() => {
                                this._onLogin();
                            }, 500);

                            this.forceUpdate();
                        }
                    }
                    // this.forceUpdate();
                }}
                ref={`text${index}`}
                maxLength={1}
                style={{
                    fontSize: 20,
                    // marginLeft: 25,
                    color:'black',

                    width: 50,
                    textAlign:'center',

                }}/>
        </View>;
    };
    _onLogin = () => {
        const {phone} = this.props;
        const code = this.iptArrayNum.join('');
        const DeviceID = DeviceInfo.getUniqueId();
        const platform = Platform.OS;
        const device_brand = DeviceInfo.getBrand();
        const device_name = DeviceInfo.getDeviceName();
        const device_system_version = DeviceInfo.getSystemVersion();
        const device_is_tablet = DeviceInfo.isTablet();
        // device_brand, device_name, device_system_version, device_is_tablet
        this.props.onLogin(phone, code, platform, DeviceID, device_brand, device_name, device_system_version, device_is_tablet, (isTrue, data) => {
            if (isTrue) {
                this.props.showError('');
                const {routes, navigation} = this.props;
                const key = routes[0].routes[1].key;

                Global.token = data.token;//进行验证token
                ChatSocket.verifyIdentidy();//进行验证token
                NavigationUtils.goBack(navigation, key);
                setTimeout(()=>{
                    ChatSocket.selectAllFriendMessage(20);//进行获取好友列表
                },2000)
            } else {

                // console.log(data.msg, 'data.msg');
                this.props.showError(data.msg);
                this.iptArrayNum = new Array(this.props.iptNum);
                this.refs[`text0`].focus();
                this.forceUpdate();
            }

        });
    };

    render() {
        const {iptNum} = this.props;
        const iptArray = [];
        for (let i = 0; i < iptNum; i++) {
            iptArray.push(this.getCodeIpt(i));
        }
        return <View style={{
            marginTop: 40, justifyContent: 'space-between', alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 40,
        }}>
            {iptArray.map((item, index, arr) => {
                return item;
            })}
        </View>;
    }
}

const mapStateToProps = state => ({
    routes: state.nav.routes,
});
const mapDispatchToProps = dispatch => ({
    onLogin: (phone, code, platform, DeviceID, device_brand, device_name, device_system_version, device_is_tablet, callback) => dispatch(actions.onLogin(phone, code, platform, DeviceID, device_brand, device_name, device_system_version, device_is_tablet, callback)),
});
const CodeInputRedux = connect(mapStateToProps, mapDispatchToProps)(CodeInput);
