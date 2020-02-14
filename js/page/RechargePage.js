/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions, Text,
    View, StatusBar,
    TextInput, TouchableOpacity, Image, Platform, TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {bottomTheme} from '../appSet';
import Toast from 'react-native-root-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import XPay from 'react-native-puti-pay';
import {ApplePay} from 'react-native-apay';
import {alipaySignOrder, wechatSignOrder} from '../util/AppService';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImagePro from '../common/FastImagePro';
import actions from '../action';
import Global from '../common/Global';
import JShareModule from 'jshare-react-native';
import JPush from 'jpush-react-native';

const width = Dimensions.get('window').width;

class RechargePage extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };
    state = {
        taskData: {},
        rechargeVal: 0,
        moneyBoxIndex: 0,


    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        this.backPress.componentDidMount();
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    nums = [
        // {id: 0, num: 1, info: '1元'},
        {id: 1, num: 10, info: '10元'},
        {id: 2, num: 50, info: '50元'},
        {id: 3, num: 100, info: '100元'},
        {id: 4, num: 300, info: '300元'},
        {id: 5, num: 500, info: '500元'},
        {id: 6, num: 800, info: '800元'},

    ];

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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '充值管理', null, 'white', 'black', 16, null, false, false, '清空', 'black');
        console.log(Global.apple_pay, 'Global.apple_pay');
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                        {this.props.userinfo.login && <TouchableOpacity
                            onPress={() => {
                                NavigationUtils.goPage({userid: this.props.userinfo.userid}, 'ShopInfoPage');
                            }}
                            activeOpacity={0.6}
                            style={{
                                flexDirection: 'row',
                                padding: 10,
                                paddingLeft: 15,
                                backgroundColor: 'white',
                                marginTop: 3,
                                alignItems: 'center',
                                paddingVertical: hp(2),
                            }}>
                            <FastImagePro
                                source={{uri: this.props.userinfo.avatar_url}}
                                style={{width: hp(9), height: hp(9), borderRadius: hp(10) / 2}}
                            />
                            <View style={{
                                marginLeft: 10,
                                justifyContent: 'space-around',
                                height: hp(10),
                                paddingVertical: 5,
                            }}>
                                <Text style={{fontSize: hp(2.7), color: 'black'}}>{this.props.userinfo.username}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image
                                            resizeMode={'stretch'}
                                            style={{height: hp(1.6), width: hp(1.6)}}
                                            source={require('.././res/img/recharge/recharge_id.png')}/>
                                        <Text style={{
                                            fontSize: hp(1.7),
                                            marginLeft: 4,
                                            color: 'rgba(0,0,0,0.7)',
                                        }}>{this.props.userinfo.userid}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                                        <Image
                                            resizeMode={'stretch'}
                                            style={{height: hp(1.6), width: hp(1.6)}}
                                            source={require('.././res/img/recharge/recharge_money.png')}/>
                                        <Text style={{
                                            fontSize: hp(1.7),
                                            marginLeft: 4,
                                            color: 'rgba(0,0,0,0.7)',
                                        }}>{this.props.userinfo.task_currency}</Text>
                                    </View>
                                </View>
                            </View>

                        </TouchableOpacity>}

                        <View style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>
                            <Text style={{fontSize: hp(2), color: 'rgba(0,0,0,0.5)'}}>选择数量:</Text>
                            <View style={{
                                width: width - 20,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                            }}>
                                {this.nums.map((item, index, arr) => {
                                    return this.renderMoneyBox(index, item);
                                })}
                            </View>
                            <InputPro onChangeText={(text) => {
                                this.setState({
                                    rechargeVal: parseFloat(text),
                                });
                            }}/>

                        </View>
                        {/*<View style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>*/}
                        {/*    <Text style={{fontSize: hp(2), color: 'rgba(0,0,0,0.5)'}}>支付方式:</Text>*/}
                        {/*    <PayType ref={ref => this.payType = ref}/>*/}
                        {/*</View>*/}
                        {(Global.apple_pay == 1 && Platform.OS === 'ios') ? null :
                            <View style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>
                                <Text style={{fontSize: hp(2), color: 'rgba(0,0,0,0.5)'}}>支付方式:</Text>
                                <PayType ref={ref => this.payType = ref}/>
                            </View>}
                        <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 10}}>
                            <Text style={{fontSize: hp(2), color: 'rgba(0,0,0,0.5)', top: hp(1)}}>应付:</Text>
                            <Text style={{
                                fontSize: hp(3),
                                color: bottomTheme,
                                marginHorizontal: 5,
                            }}>{this.state.rechargeVal}</Text>
                            <Text style={{fontSize: hp(2), color: 'rgba(0,0,0,0.5)', top: hp(1)}}>元</Text>
                        </View>
                        <View style={{marginTop: 20, padding: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: hp(2)}}>充值须知
                            </Text>
                            <Text style={{fontSize: hp(1.6), color: 'rgba(0,0,0,0.5)', marginTop: 10}}>1、目前支持支付宝和微信支付充值、后续其他充值方式及时公告通知大家
                            </Text>
                            <Text style={{fontSize: hp(1.6), color: 'rgba(0,0,0,0.5)', marginTop: 5}}>2、充值无最低额度限制，请根据发布任务的单价和数量确定充值金额，账户余额可以提现，但会收取2%的手续费(支付平台收取并非简易赚APP)
                            </Text>
                            <Text style={{fontSize: hp(1.6), color: 'rgba(0,0,0,0.5)', marginTop: 5}}>3、目前支持支付宝和微信支付充值、后续其他充值方式及时公告通知大家
                            </Text>
                        </View>
                        <View style={{height: hp(7)}}/>
                    </KeyboardAwareScrollView>
                    <TouchableHighlight
                        underlayColor={'#2170cd'}
                        onPress={this.sureRecharGe}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: wp(100),
                            height: hp(7),
                            alignItems: 'center',
                            backgroundColor: bottomTheme,
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}>
                        <Text style={{fontSize: hp(2.5), fontWeight: 'bold', color: 'white'}}>确认充值</Text>
                    </TouchableHighlight>
                </View>

            </SafeAreaViewPlus>
        );
    }

    renderMoneyBox = (index, item) => {
        return <TouchableOpacity
            onPress={() => {
                this.setState({
                    rechargeVal: parseFloat(item.num),
                    moneyBoxIndex: item.id,
                });
            }}
            key={index}
            style={{
                marginTop: 15,
                width: wp(30),
                height: hp(10),
                borderWidth: 0.5,
                borderColor: this.state.moneyBoxIndex == item.id ? bottomTheme : 'rgba(0,0,0,0.2)',
                borderRadius: 5,

                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'black', fontSize: hp(2.3)}}>{item.num}</Text>
                <Image
                    resizeMode={'stretch'}
                    style={{height: hp(2), width: hp(2), marginLeft: 3}}
                    source={require('.././res/img/recharge/recharge_money.png')}/>
            </View>
            <Text style={{marginTop: 3, fontSize: hp(1.99), color: 'rgba(0,0,0,0.5)'}}>{item.info}</Text>
            {this.state.moneyBoxIndex == item.id && <Image
                resizeMode={'stretch'}
                style={{height: hp(3), width: hp(3), position: 'absolute', bottom: 0, right: 0}}
                source={require('.././res/img/recharge/changed.png')}/>}

        </TouchableOpacity>;
    };
    iosPay = () => {
        const requestData = {
            merchantIdentifier: 'merchant.com.yiertong.easyz',
            supportedNetworks: ['mastercard', 'visa', 'chinaunionpay'],
            countryCode: 'HK',
            currencyCode: 'HKD',
            paymentSummaryItems: [
                {
                    label: 'Item label',
                    amount: '0.1',
                },
            ],
        };

        // Check if ApplePay is available
        if (ApplePay.canMakePayments) {
            ApplePay.requestPayment(requestData)
                .then((paymentData) => {
                    console.log(paymentData);
                    // Simulate a request to the gateway
                    setTimeout(() => {
                        // Show status to user ApplePay.SUCCESS || ApplePay.FAILURE
                        ApplePay.complete(ApplePay.SUCCESS)
                            .then(() => {
                                console.log('completed');
                                // do something
                            });
                    }, 1000);
                });
        }
        ;
    };
    sureRecharGe = () => {
        const rechargeVal = this.state.rechargeVal;
        if (!this.props.userinfo.login) {
            Toast.show('请登录');
            return;
        }
        if (!rechargeVal || parseFloat(rechargeVal) <= 0) {
            Toast.show('请输入正确的金额哦 ～ ～');
            return;
        }
        if (Global.apple_pay == 1 && Platform.OS === 'ios') {
            this.iosPay();
            return;
        }

        if (this.payType.getActiveIndex() === 0) {

            this.wechatPay(rechargeVal);
        }
        if (this.payType.getActiveIndex() === 1) {
            this.aliPay(rechargeVal);
        }

    };
    addLocalNotification = (rechargeVal) => {
        JPush.addLocalNotification({
            messageID: '10',
            title: '任务币充值成功',
            content: `您充值${rechargeVal}个任务币已经到账`,
            extras: {priority: '2'},
        });
    };
    aliPay = (rechargeVal) => {
        const params = {
            subject: '任务币充值',
            body: '任务币充值-RechargePage',
            product_code: 'Recharge-Task-Money',
            platform: Platform.OS,
            total_amount: rechargeVal,
        };
        alipaySignOrder(params, this.props.userinfo.token).then(result => {
            const orderInfo = result.orderInfo;
            // console.log(orderInfo);
            //设置支付宝URL方案
            XPay.setAlipayScheme('ap2021001108698283');
            //支付宝开启沙箱模式仅限安卓
            XPay.setAlipaySandbox(false);
            XPay.alipay(orderInfo, (result) => {
                let msg = '支付未成功';
                console.log(result, 'result');
                if (result.resultStatus == 9000) {
                    msg = '支付成功';
                } else if (result.resultStatus == 8000) {
                    msg = '正在处理中';
                } else if (result.resultStatus == 4000) {
                    msg = '订单支付失败';
                } else if (result.resultStatus == 5000) {
                    msg = '重复请求';
                } else if (result.resultStatus == 6001) {
                    msg = '用户中途取消';
                } else if (result.resultStatus == 6002) {
                    msg = '网络连接出错';
                } else if (result.resultStatus == 6004) {
                    msg = '支付结果未知（有可能已经支付成功）';
                }
                if (result.resultStatus == 9000) {
                    Toast.show(msg);
                    setTimeout(() => {
                        NavigationUtils.goPage({navigationIndex: 2}, 'UserBillListPage');
                        const {userinfo, onGetUserInFoForToken} = this.props;
                        onGetUserInFoForToken(userinfo.token, () => {
                        });
                    }, 1000);
                    this.addLocalNotification(rechargeVal);
                } else {
                    Toast.show(msg);

                }
            });
        }).catch(msg => {
            Toast.show(msg);
        });
    };
    wechatPay = (rechargeVal) => {
        JShareModule.isWeChatInstalled(bool => {
            if (bool) {
                const params = {
                    subject: '任务币充值',
                    body: '任务币充值-RechargePage',
                    product_code: 'Recharge-Task-Money',
                    platform: Platform.OS,
                    total_amount: rechargeVal,
                };
                wechatSignOrder(params, this.props.userinfo.token).then(result => {
                    console.log(result);
                    const {partnerid, noncestr, timestamp, prepayid, sign} = result.params;
                    XPay.setWxId('wx361451af380461c2');
                    const data = {
                        partnerId: partnerid,
                        prepayId: prepayid,
                        packageValue: result.params.package,
                        nonceStr: noncestr,
                        timeStamp: String(timestamp),
                        sign: sign,
                    };

                    XPay.wxPay(data, (res) => {
                        if (res.errCode == '-2') {
                            Toast.show('用户中途取消');
                        }
                        if (res.errCode == '0') {
                            Toast.show('支付成功');
                            setTimeout(() => {
                                NavigationUtils.goPage({navigationIndex: 2}, 'UserBillListPage');
                                const {userinfo, onGetUserInFoForToken} = this.props;
                                onGetUserInFoForToken(userinfo.token, () => {
                                });
                            }, 1000);
                            this.addLocalNotification(rechargeVal);
                        }
                        if (res.errCode == '-1') {
                            Toast.show('发生错误,请联系客服');
                        }
                    });
                    console.log(data);
                }).catch(msg => {
                    // console.log(msg);
                    Toast.show(msg);
                });
            } else {
                Toast.show('请安装微信客户端');
            }
        });
    };
    page = {
        pageIndex: 0,
    };

}

class PayType extends React.Component {
    state = {
        activeIndex: 1,
    };

    items = [

        {title: '支付宝', id: 1, source: require('../res/img/payType/alipay.png'), info: '亿万用户的选择，更快更安全', isRecommend: 1},
        {title: '微信支付', id: 0, source: require('../res/img/payType/wechat.png'), info: '用户量第二大支付平台', isRecommend: 0},
    ];
    getActiveIndex = () => {
        return this.state.activeIndex;
    };

    render() {
        return <View style={{alignItems: 'center', marginTop: 10}}>
            {this.items.map((item, index, arr) => {
                return this.genRadio(item);
            })}
        </View>;
    }

    genRadio = (item) => {
        return <TouchableOpacity
            key={item.id}
            activeOpacity={0.6}
            onPress={() => {
                this._radioClick(item);
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,

                height: hp(8), width: width - 20, borderRadius: 7,

            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                    source={item.source}
                    resizeMode={'contain'}
                    style={{width: wp(6), height: wp(5), borderRadius: 5}}
                />
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems:'center',


                    }}>
                        <Text style={{fontSize: hp(2), marginLeft: 10, color: 'black'}}>{item.title}</Text>
                        {item.isRecommend === 1 &&
                        <View style={{
                            backgroundColor: bottomTheme,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 7,
                            paddingHorizontal: 4,
                            borderRadius: 3,
                            paddingVertical:0,
                            height:hp(2),
                        }}>
                            <Text style={{fontSize: hp(1.35), color: 'white'}}>推荐</Text>
                        </View>}

                    </View>

                    <Text style={{
                        fontSize: hp(1.6),
                        marginLeft: 10,
                        color: 'rgba(0,0,0,0.5)',
                        marginTop: 5,
                    }}>{item.info}</Text>
                </View>
            </View>


            {this.state.activeIndex === item.id ? <Image
                source={require('../res/img/ok.png')}
                style={{
                    width: 16, height: 16, borderRadius: 10,
                    borderBottomRightRadius: 5,
                }}
            /> : <View
                style={{width: 16, height: 16, borderRadius: 10, borderColor: 'rgba(0,0,0,0.5)', borderWidth: 1}}/>}


        </TouchableOpacity>;
    };
    _radioClick = (item) => {
        if (this.state.activeIndex !== item.id) {
            this.setState({
                activeIndex: item.id,
            });
        }

    };
}

class InputPro extends React.PureComponent {
    state = {
        isFocused: false,
        text: '',
    };

    render() {
        const {isFocused} = this.state;
        return <TextInput
            onFocus={() => {
                this.setState({isFocused: true});
                if (this.state.text.length > 0) {
                    this.props.onChangeText(this.state.text);
                }

            }}
            onBlur={() => {
                this.setState({
                    isFocused: false,
                });
            }}
            onChangeText={(text) => {
                this.setState({
                    text,
                });
                this.props.onChangeText(text);
            }}
            maxLength={4}
            value={this.state.text}
            style={{
                width: width - 20 - wp(1.6),
                height: hp(10),
                borderWidth: 0.5,
                backgroundColor: isFocused ? 'rgba(33,150,243,0.1)' : 'rgba(255,255,255,0.1)',
                borderColor: isFocused ? bottomTheme : 'rgba(0,0,0,0.3)',
                marginTop: 15,
                alignSelf: 'center',
                borderRadius: 5,
                paddingLeft: 15,
                fontSize: hp(2.5),
            }}>

        </TextInput>;
    }

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onGetUserInFoForToken: (token, callback) => dispatch(actions.onGetUserInFoForToken(token, callback)),
});
const RechargePageRedux = connect(mapStateToProps, mapDispatchToProps)(RechargePage);


export default RechargePageRedux;

