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
    TextInput, TouchableOpacity,Image
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {bottomTheme} from '../appSet';
import menu_right from '../res/svg/menu_right.svg';
import SvgUri from 'react-native-svg-uri';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class WithDrawPage extends PureComponent {
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
    };

    componentDidMount() {
        this.backPress.componentDidMount();
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
        StatusBar.setBarStyle('dark-content', true);
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '提现管理', null, 'white', 'black', 16, null, false, false, '清空', 'black');
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}

                <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                        paddingLeft: 15,
                        backgroundColor: 'white',
                        marginTop:3,
                        alignItems:'center',
                    }}>

                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Image
                                style={{width:50,height:50, borderRadius:25}}
                                source={require('../res/img/payType/alipay.png')}
                            />
                            <View style={{marginLeft:10}}>
                                <Text style={{color:'rgba(0,0,0,1)'}}>支付宝:15061142750</Text>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 12,
                                    opacity: 0.5,
                                    color: 'black',
                                    marginTop: 8,
                                }}>点击可修改提现账户</Text>
                            </View>

                        </View>
                        <SvgUri width={20} height={20} fill={'rgba(0,0,0,0.6)'} svgXmlData={menu_right}/>

                    </TouchableOpacity>

                    <View style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>
                        <Text style={{fontSize: 15,color:'rgba(0,0,0,0.8)'}}>请输入提现金额:</Text>
                        <View style={{marginVertical: 15, marginLeft: 5, flexDirection: 'row'}}>
                            <Text style={{fontSize: 25, color:'black',fontWeight: 'bold', position: 'absolute', left: 0}}>¥</Text>
                            <TextInput
                                style={{
                                    fontWeight: 'bold', fontSize: 25, width: width - 40, borderBottomWidth: 1,
                                    borderBottomColor: '#e8e8e8', padding: 0, paddingLeft: 25, paddingBottom: 5,
                                }}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                            <Text style={{fontSize: 13, color: 'rgba(0,0,0,0.5)'}}>可提现金额1.00元</Text>
                            <Text style={{color: bottomTheme, fontWeight: 'bold'}}>全部提现</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                            marginTop: 50,
                            width: width - 80, height: 60, alignItems: 'center', backgroundColor: bottomTheme,
                            justifyContent: 'center', alignSelf: 'center', borderRadius: 8,
                        }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>确认提现</Text>
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
                        <Text style={{fontWeight: 'bold', fontSize:15}}>提现须知
                        </Text>
                        <Text style={{fontSize:12,color:'rgba(0,0,0,0.5)', marginTop:10}}>1、目前支持支付宝和微信支付提现、后续其他提现方式及时公告通知大家
                        </Text>
                        <Text style={{fontSize:12,color:'rgba(0,0,0,0.5)', marginTop:5}}>2、提现金额需大于1 小于1000元之间的证书，提现时间为工作日9:00 -- 17:00
                        </Text>
                        <Text style={{fontSize:12,color:'rgba(0,0,0,0.5)', marginTop:5}}>3、每天只能提现一次,请知晓
                        </Text>
                    </View>
                </View>

            </SafeAreaViewPlus>
        );
    }

    page = {
        pageIndex: 0,
    };

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
const WithDrawPageRedux = connect(mapStateToProps, mapDispatchToProps)(WithDrawPage);


export default WithDrawPageRedux;

