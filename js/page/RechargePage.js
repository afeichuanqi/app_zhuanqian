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
    TextInput, TouchableOpacity, Image, ScrollView, Platform,
} from 'react-native';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {bottomTheme} from '../appSet';
import Toast from 'react-native-root-toast';

import XPay from 'react-native-puti-pay';
import {alipaySignOrder} from '../util/AppService';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImagePro from '../common/FastImagePro';
import actions from '../action';

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
        activeIndex: 0,
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        this.backPress.componentDidMount();
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    items = [
        {title: '微信', id: 0, source: require('../res/img/payType/wechat.png')},
        {title: '支付宝', id: 1, source: require('../res/img/payType/alipay.png')},
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
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <ScrollView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
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
                        }}>
                        <FastImagePro
                            source={{uri: this.props.userinfo.avatar_url}}
                            style={{width: wp(13), height: wp(13), borderRadius: wp(13) / 2}}
                        />
                        <View style={{
                            marginLeft: 10,
                            justifyContent: 'space-around',
                            height: wp(13),
                            paddingVertical: 5,
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontSize: 16, color: 'black'}}>{this.props.userinfo.username}</Text>
                                <Text style={{
                                    color: 'black',
                                    opacity: 0.5,
                                    marginLeft: 10,
                                }}>ID:{this.props.userinfo.userid}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    color: 'black',
                                    opacity: 0.5,
                                    fontSize: 12,
                                }}>余额:</Text>
                                <Text style={{
                                    color: 'black',
                                    opacity: 0.5,
                                    fontSize: 12,
                                    marginLeft: 5,
                                }}>{this.props.userinfo.task_currency}</Text>
                            </View>
                        </View>

                    </TouchableOpacity>}

                    <View style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>
                        <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.8)'}}>请输入充值金额:</Text>
                        <View style={{marginVertical: 20, marginLeft: 5, flexDirection: 'row'}}>
                            <Text style={{
                                fontSize: 25,
                                fontWeight: 'bold',
                                color: 'black',
                                position: 'absolute',
                                left: 0,
                                top: 10,
                            }}>¥</Text>
                            <TextInput
                                keyboardType={'number-pad'}
                                onChangeText={(text) => {
                                    this.rechargeVal = text;
                                }}
                                style={{
                                    fontWeight: 'bold', fontSize: 35, width: width - 40, borderBottomWidth: 1,
                                    borderBottomColor: '#e8e8e8', padding: 0, paddingLeft: 25, paddingBottom: 10,
                                }}
                            />
                        </View>
                        <View style={{paddingVertical: 10}}>
                            <View style={{alignSelf: 'center', flexDirection: 'row'}}>
                                {this.items.map((item, index) => {
                                    return this.genRadio(item, index);
                                })}
                            </View>
                        </View>

                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.sureRecharGe}
                        style={{
                            marginTop: 50,
                            width: wp(80), height: hp(10), alignItems: 'center', backgroundColor: bottomTheme,
                            justifyContent: 'center', alignSelf: 'center', borderRadius: 8,
                        }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>确认充值</Text>
                    </TouchableOpacity>
                    {/*<View style={{marginTop: 30, alignSelf: 'center'}}>*/}
                    {/*    <Text style={{color: bottomTheme, opacity: 0.5, fontSize: 12}}>每天可提现一次,最小提现金额3元</Text>*/}
                    {/*    <Text style={{*/}
                    {/*        color: bottomTheme,*/}
                    {/*        opacity: 0.5,*/}
                    {/*        fontSize: 12,*/}
                    {/*        marginTop: 10,*/}
                    {/*        alignSelf: 'center',*/}
                    {/*    }}>超过10元提现手续费2%</Text>*/}
                    {/*</View>*/}
                    <View style={{marginTop: 20, padding: 10}}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}>充值须知
                        </Text>
                        <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 10}}>1、目前支持支付宝和微信支付充值、后续其他充值方式及时公告通知大家
                        </Text>
                        <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 5}}>2、充值无最低额度限制，请根据发布任务的单价和数量确定充值金额，账户余额可以提现，但会收取一定的费用
                        </Text>
                        <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 5}}>3、目前支持支付宝和微信支付充值、后续其他充值方式及时公告通知大家
                        </Text>
                    </View>
                </ScrollView>

            </SafeAreaViewPlus>
        );
    }

    sureRecharGe = () => {
        // const item = this.items[this.state.activeIndex];
        const rechargeVal = this.rechargeVal;
        if (!this.props.userinfo.login) {
            Toast.show('请登录');
            return;
        }
        if (!rechargeVal || parseFloat(rechargeVal) <= 0) {
            Toast.show('请输入正确的金额哦 ～ ～');
            return;
        }
        //
        if (this.state.activeIndex === 1) {
            const params = {
                subject: '任务币充值',
                body: '任务币充值-RechargePage',
                product_code: 'Recharge-Task-Money',
                platform: Platform.OS,
                total_amount: rechargeVal,
            };
            alipaySignOrder(params, this.props.userinfo.token).then(result => {
                const orderInfo = result.orderInfo;
                console.log(orderInfo);
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
                            // this.props.onGetUserInFoForToken()
                        }, 1000);
                    } else {
                        Toast.show(msg);

                    }
                });
            });
        }

    };
    _radioClick = (item) => {
        if (this.state.activeIndex !== item.id) {
            this.setState({
                activeIndex: item.id,
            });
        }

    };
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
                marginLeft: 10,
                borderWidth: this.state.activeIndex == item.id ? 0.8 : 0.3,
                borderColor: this.state.activeIndex == item.id ? bottomTheme : 'rgba(0,0,0,0.3)',
                height: hp(8), width: wp(37), borderRadius: 7, paddingLeft: 10,

            }}>
            <Image
                source={item.source}
                style={{width: wp(10), height: wp(10), borderRadius: 5}}
            />
            {/*<View>*/}

            {this.state.activeIndex == item.id && <Image
                source={require('../res/img/payType/active.png')}
                style={{
                    width: 20, height: 20, position: 'absolute', right: 0, bottom: 0, borderRadius: 3,
                    borderBottomRightRadius: 5,
                }}
            />}
            {/*</View>*/}
            <Text style={{fontSize: 15, marginLeft: 10, color: 'black'}}>{item.title}</Text>
        </TouchableOpacity>;
    };
    page = {
        pageIndex: 0,
    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onGetUserInFoForToken: (token, callback) => dispatch(actions.onGetUserInFoForToken(token, callback)),
});
const RechargePageRedux = connect(mapStateToProps, mapDispatchToProps)(RechargePage);


export default RechargePageRedux;

