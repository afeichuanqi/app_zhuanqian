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
    TextInput, TouchableOpacity, Image,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {bottomTheme} from '../appSet';
import Toast from '../common/Toast';

const height = Dimensions.get('window').height;
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
        StatusBar.setBarStyle('dark-content', true);
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
                <Toast
                    ref={ref => this.toast = ref}
                />
                <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                    <View style={{backgroundColor: 'white', padding: 10, marginTop: 3}}>
                        <Text style={{fontSize: 15, color: 'rgba(0,0,0,0.8)'}}>请输入充值金额:</Text>
                        <View style={{marginVertical: 20, marginLeft: 5, flexDirection: 'row'}}>
                            <Text style={{fontSize: 25, fontWeight: 'bold',color:'black', position: 'absolute', left: 0}}>¥</Text>
                            <TextInput
                                keyboardType={'number-pad'}
                                onChangeText={(text) => {
                                    this.rechargeVal = text;
                                }}
                                style={{
                                    fontWeight: 'bold', fontSize: 25, width: width - 40, borderBottomWidth: 1,
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
                            width: width - 80, height: 60, alignItems: 'center', backgroundColor: bottomTheme,
                            justifyContent: 'center', alignSelf: 'center', borderRadius: 8,
                        }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>确认充值</Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 30, alignSelf: 'center'}}>
                        <Text style={{color: bottomTheme, opacity: 0.5, fontSize: 12}}>每天可提现一次,最小提现金额3元</Text>
                        <Text style={{
                            color: bottomTheme,
                            opacity: 0.5,
                            fontSize: 12,
                            marginTop: 10,
                            alignSelf: 'center',
                        }}>超过10元提现手续费2%</Text>
                    </View>
                    <View style={{marginTop: 20, padding: 10}}>
                        <Text style={{fontWeight: 'bold'}}>温馨提示:
                            提现：周日只2
                        </Text>
                    </View>
                </View>

            </SafeAreaViewPlus>
        );
    }

    sureRecharGe = () => {
        const item = this.items[this.state.activeIndex];
        const rechargeVal = this.rechargeVal;
        if (!rechargeVal || parseFloat(rechargeVal) <= 0) {
            this.toast.show('请输入正确的金额哦 ～ ～');
        }
        console.log(item, rechargeVal);

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
                height: 47, width: 125, borderRadius: 5, paddingLeft: 10,

            }}>
            <Image
                source={item.source}
                style={{width: 30, height: 30, borderRadius: 3}}
            />
            {/*<View>*/}

            {this.state.activeIndex == item.id && <Image
                source={require('../res/img/payType/active.png')}
                style={{width: 20, height: 20, position: 'absolute', right: 0, bottom: 0}}
            />}
            {/*</View>*/}
            <Text style={{fontSize: 14, marginLeft: 10, color: 'black'}}>{item.title}</Text>
        </TouchableOpacity>;
    };
    page = {
        pageIndex: 0,
    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
const RechargePageRedux = connect(mapStateToProps, mapDispatchToProps)(RechargePage);


export default RechargePageRedux;

