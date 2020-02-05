/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions, Text,
    View, StatusBar,
    TextInput, TouchableOpacity, Image,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {bottomTheme} from '../appSet';
import menu_right from '../res/svg/menu_right.svg';
import SvgUri from 'react-native-svg-uri';
import {getUserWithDrawInfo, userWithDrawMoney} from '../util/AppService';
import actions from '../action';
import Toast from 'react-native-root-toast';
import ToastSelect from '../common/ToastSelectTwo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const width = Dimensions.get('window').width;

class WithDrawPayPage extends React.Component {
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
        info: {},
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        this.backPress.componentDidMount();
        const type = this.params.type;
        getUserWithDrawInfo({type}, this.props.userinfo.token).then(result => {

            const {pay_username, pay_account} = result;
            console.log(pay_username, pay_account, 'pay_username, pay_account');
            this.props.onAddPayAccount(pay_username, pay_account, type);
        });
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '提现管理', null, 'white', 'black', 16, null, false, false, '清空', 'black');
        let pay_name = '';
        let pay_account = '';
        let pay = '';
        let pay_source = null;

        if (this.params.type === 1) {
            pay = '支付宝';
            pay_name = this.props.userinfo.alipay_name;
            pay_account = this.props.userinfo.alipay_account;
            pay_source = require('../res/img/payType/alipay-1.png');

        } else {
            pay = '微信';
            pay_name = this.props.userinfo.wechat_name;
            pay_account = this.props.userinfo.wechat_account;
            pay_source = require('../res/img/payType/wechat-1.png');
        }
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}

                <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                    <TouchableOpacity
                        onPress={() => {

                            NavigationUtils.goPage({type: this.params.type}, 'WithDrawAccount');
                        }}
                        activeOpacity={0.6}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 10,
                            paddingLeft: 15,
                            backgroundColor: 'white',
                            marginTop: 3,
                            alignItems: 'center',
                        }}>
                        {
                            pay_name && pay_name.length > 0 ? <View

                                style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    style={{width: 50, height: 50, borderRadius: 25}}
                                    source={pay_source}
                                />
                                <View style={{height: 50, justifyContent: 'space-around', marginLeft: 10}}>
                                    <Text
                                        style={{color: 'rgba(0,0,0,1)'}}>{pay}:{pay_account}</Text>
                                    <Text style={{
                                        fontSize: 12,
                                        opacity: 0.5,
                                        color: 'black',

                                    }}>点击可修改提现账户</Text>
                                </View>

                            </View> : <View
                                style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    style={{width: 30, height: 30, borderRadius: 15}}
                                    source={require('../res/img/add_account.png')}
                                />
                                <View style={{height: 30, justifyContent: 'space-around', marginLeft: 10}}>
                                    <Text style={{
                                        // fontWeight: 'bold',
                                        fontSize: 12,
                                        opacity: 0.5,
                                        color: 'black',

                                    }}>点击新增提现账户</Text>
                                </View>

                            </View>
                        }

                        <SvgUri width={20} height={20} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>

                    </TouchableOpacity>

                    <View style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>
                        <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.8)'}}>请输入提现金额:</Text>
                        <View style={{marginVertical: 15, marginLeft: 5, flexDirection: 'row'}}>
                            <Text style={{
                                fontSize: 25,
                                color: 'black',
                                fontWeight: 'bold',
                                position: 'absolute',
                                left: 0,
                                top: 7,
                            }}>¥</Text>
                            <InputTextPro
                                value={'0'}
                                ref={ref => this.inputPro = ref}

                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                            <Text style={{
                                fontSize: 13,
                                color: 'rgba(0,0,0,0.5)',
                            }}>可提现金额{this.props.userinfo.task_currency}元</Text>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    this.inputPro.setPrice(this.props.userinfo.task_currency.toString());
                                }}
                            >

                                <Text style={{color: bottomTheme, fontWeight: 'bold'}}>全部提现</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={pay_name ? 0.7 : 1}
                        onPress={() => {
                            if (pay_name) {
                                if (parseFloat(this.inputPro.getPrice()) <= 0) {
                                    Toast.show('请输入正确的提现金额',{position:Toast.positions.CENTER});
                                    return;
                                }
                                this.toastS.show();

                            }
                        }}
                        style={{
                            marginTop: 50,
                            width: width - 80,
                            height: 60,
                            alignItems: 'center',
                            backgroundColor: pay_name ? '#2196F3' : 'rgba(33,150,243,0.5)',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            borderRadius: 8,
                        }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>确认提现</Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 20, padding: 10}}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}>提现须知
                        </Text>
                        <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 10}}>1、目前支持支付宝和微信支付提现、后续其他提现方式及时公告通知大家
                        </Text>
                        <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 5}}>2、提现金额需大于1
                            小于1000元之间的证书，提现时间为工作日9:00 -- 17:00
                        </Text>
                        <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.5)', marginTop: 5}}>3、每天只能提现一次,请知晓
                        </Text>
                    </View>
                </KeyboardAwareScrollView>
                <ToastSelect
                    sureTitle={'确认提现'}
                    sureClick={this.sureClick}
                    ref={ref => this.toastS = ref}/>
            </SafeAreaViewPlus>
        );
    }

    page = {
        pageIndex: 0,
    };
    sureClick=()=>{
        this.toastS.hide();
        userWithDrawMoney({
            withdraw_type: this.params.type,
            money: parseFloat(this.inputPro.getPrice()),
        }, this.props.userinfo.token).then(result => {
            this.props.onGetUserInFoForToken(this.props.userinfo.token, () => {
            });
            Toast.show('提现申请成功',{position:Toast.positions.CENTER});
            setTimeout(() => {
                NavigationUtils.goPage({navigationIndex: 1}, 'UserBillListPage');
            }, 1000);
        }).catch(msg => {
            Toast.show(msg,{position:Toast.positions.CENTER});
        });
    }
}

class InputTextPro extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            price: props.value,
        };
    }

    setPrice = (price) => {
        this.setState({
            price,
        });
    };
    getPrice = () => {
        const int_p = parseFloat(this.state.price);
        if (isNaN(int_p) || int_p <= 0) {
            return '0';
        }
        return int_p.toString();
    };

    render() {
        return <TextInput
            keyboardType={'number-pad'}
            style={{
                fontWeight: 'bold', fontSize: 30, width: width - 40, borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8', padding: 0, paddingLeft: 25, paddingBottom: 5,
            }}
            maxLength={4}
            value={this.state.price}
            onChangeText={(text) => {
                this.setState({
                    price: text,
                });
            }}
            onBlur={() => {
                const int_p = parseFloat(this.state.price);
                if (isNaN(int_p) || int_p <= 0) {
                    this.setState({
                        price: '0',
                    });
                    return;
                }
                this.setState({
                    price: int_p.toString(),
                });
            }}
        />;
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    onAddPayAccount: (name, account, type) => dispatch(actions.onAddPayAccount(name, account, type)),
    onGetUserInFoForToken: (token, callback) => dispatch(actions.onGetUserInFoForToken(token, callback)),
});
const WithDrawPageRedux = connect(mapStateToProps, mapDispatchToProps)(WithDrawPayPage);


export default WithDrawPageRedux;

