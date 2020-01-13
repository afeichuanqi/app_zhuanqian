/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions, Text,
    View, StatusBar,
    TouchableOpacity, ImageBackground,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {connect} from 'react-redux';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import {bottomTheme, theme} from '../appSet';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class WithDrawPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        StatusBar.setBarStyle('light-content', true);
        this.backPress.componentDidMount();
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

    render() {
        let statusBar = {
            hidden: false,
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };

        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '提现管理', null, bottomTheme, 'white', 16, () => {
            NavigationUtils.goPage({navigationIndex: 2}, 'UserBillListPage');
        }, false, true, '明细', 'white');
        let {tota_withdrawal, task_currency, income_dividend, share_dividend, game_dividend, login} = this.props.userinfo;
        if (!login) {
            tota_withdrawal = 0;
            task_currency = 0;
            income_dividend = 0;
            share_dividend = 0;
            game_dividend = 0;
        }
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}

                <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
                    <ImageBackground
                        style={{
                            width, height: hp(25), backgroundColor: bottomTheme,
                            alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
                        }}
                        source={require('../res/img/WithDrawBgImg.png')}
                    >
                        {/*<View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                        <View style={{alignItems: 'center', width: width / 2, justifyContent: 'center'}}>
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontWeight: 'bold',
                                    color: 'white',
                                }}>{tota_withdrawal}</Text>
                            <Text style={{color: 'white', marginTop: 5}}>累计提现(元)</Text>
                        </View>

                        <View style={{
                            height: hp(7),
                            width: 0.5,
                            marginHorizontal: 0, backgroundColor: 'white',
                        }}/>
                        <View style={{alignItems: 'center', width: width / 2, justifyContent: 'center'}}>
                            <Text style={{
                                fontSize: 25,
                                fontWeight: 'bold',
                                color: 'white',
                            }}>{task_currency}</Text>
                            <Text style={{color: 'white', marginTop: 5}}>余额(元)</Text>
                        </View>


                        {/*</View>*/}
                    </ImageBackground>

                    <View style={{
                        width: wp(90),
                        height: hp(13),
                        top: -hp(5),
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        borderRadius: 10,
                        shadowColor: '#f1f1f1',
                        shadowRadius: 3,
                        shadowOpacity: 0.7,
                        shadowOffset: {w: 1, h: 1},
                        elevation: 3,//安卓的阴影
                        flexDirection: 'row',

                    }}>
                        <View style={{
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            borderWidth: 10,
                            borderTopColor: '#3a7bc5',//下箭头颜色
                            borderLeftColor: '#3a7bc5',//右箭头颜色
                            borderBottomColor: '#fff',//上箭头颜色
                            borderRightColor: '#3a7bc5',//左箭头颜色
                            position: 'absolute',
                            left: (wp(90) / 2) - 10,
                            top: -20,
                        }}/>

                        {this.renderInfoItem('悬赏收入', income_dividend, bottomTheme)}
                        {this.renderInfoItem('分享收入', share_dividend, '#514ff3')}
                        {this.renderInfoItem('游戏试玩', game_dividend, '#c822f3')}

                    </View>
                    <View style={{width, height: wp(15), flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                NavigationUtils.goPage({type: 1}, 'WithDrawPayPage');
                            }}
                            style={{
                                width: wp(40),
                                height: wp(12),
                                backgroundColor: bottomTheme,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 8,
                            }}>
                            <Text style={{fontSize: 19, color: 'white'}}>支付宝提现</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                NavigationUtils.goPage({type: 2}, 'WithDrawPayPage');
                            }}
                            style={{
                                width: wp(40),
                                height: wp(12),
                                backgroundColor: '#52b831',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 8,
                            }}>
                            <Text style={{fontSize: 19, color: 'white'}}>微信提现</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaViewPlus>
        );
    }

    renderInfoItem = (title = '', num = '', color = bottomTheme) => {
        return <View
            style={{
                height: hp(13), width: wp(90) / 3,
                alignItems: 'center', justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    borderWidth: 3,
                    borderColor: color,
                }}/>
                <Text style={{color: 'rgba(0,0,0,0.3)', marginLeft: 5, fontSize: 13}}>{title}</Text>
            </View>
            <Text style={{color: 'red', fontSize: 20, fontWeight: 'bold', marginTop: 6}}>{num}</Text>
        </View>;
    };
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

