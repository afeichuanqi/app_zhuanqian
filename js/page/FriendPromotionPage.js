/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {
    Dimensions, StyleSheet, Text,
    View, TouchableOpacity, StatusBar, Clipboard, ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
// import copy from '../res/svg/yaoqing/copy.svg';
// import SvgUri from 'react-native-svg-uri';
import Toast from 'react-native-root-toast';
import BackPressComponent from '../common/BackPressComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import ToastShare from '../common/ToastShare';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class TaskReleaseMana extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    state = {};
    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        this.backPress.componentDidMount();
        // this._updatePage(true);
    }


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '邀请送大礼', null, 'white', 'black', hp(2.4), null, false);

        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <ScrollView style={{flex: 1, backgroundColor: '#f7f7f7'}}>
                    <View>
                        <FastImage
                            resizeMode={FastImage.resizeMode.stretch}
                            source={{uri:'http://images.easy-z.cn/yaoqingsongdali.png'}}
                                   style={{width: width, height: hp(30)}}/>
                    </View>
                    <View style={{backgroundColor: 'white', marginTop: 10}}>
                        <View style={{alignSelf: 'center', paddingTop: 10}}>
                            <Text style={{alignSelf: 'center', fontSize:hp(2.1)}}>我的邀请码</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Clipboard.setString(this.props.userinfo.invite_code);
                                    Toast.show('复制成功', {position: Toast.positions.CENTER});
                                }}
                                style={{marginTop: 8, flexDirection: 'row', alignSelf: 'center'}}>
                                <Text
                                    style={{fontWeight: 'bold', fontSize:hp(2.2)}}>{this.props.userinfo.invite_code ? this.props.userinfo.invite_code : '请先登录'}</Text>
                                {/*<SvgUri style={{*/}
                                {/*    marginLeft: 10,*/}
                                {/*}} width={17} height={17} svgXmlData={copy}/>*/}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingTop: 20,
                        backgroundColor: 'white',
                        paddingBottom: 10,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                // if (this.props.userinfo.token && this.props.userinfo.token.length === 0) {
                                //     Toast.show('请先登录');
                                //     return ;
                                // }
                                this.ToastShare.show({
                                    title: `好友在召唤`,
                                    text: `下载简易赚APP，点击此链接速来助攻好友`,
                                    url: `http://www.easy-z.cn/share?&invitation_id=${this.props.userinfo.invite_code}`,
                                });
                            }}
                            style={{
                                paddingHorizontal: 15,
                                paddingVertical: 12,
                                backgroundColor: bottomTheme,
                                borderRadius: 8,
                                minWidth: wp(20),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{color: 'white', fontSize:hp(1.8)}}>推广链接</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.ToastShare.show({}, 2);
                            }}
                            style={{
                                paddingHorizontal: 15,
                                paddingVertical: 12,
                                backgroundColor: bottomTheme,
                                borderRadius: 8,
                                minWidth: wp(20),
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                            <Text style={{color: 'white',fontSize:hp(1.8)}}>推广二维码</Text>
                        </TouchableOpacity>
                    </View>

                    {/*<View style={{height: 10, backgroundColor: '#eeeeee', width, marginTop: 10}}/>*/}

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        backgroundColor: 'white',
                        marginTop: 10,


                    }}>
                        <View style={{width: width / 2 - 5, justifyContent: 'center', alignItems: 'center'}}>

                            <Text style={{color: 'red', fontSize: hp(2.3)}}>0 位</Text>
                            <Text style={{color: 'rgba(0,0,0,0.8)', fontSize: hp(1.7), marginTop: 5}}>累计邀请好友</Text>

                        </View>
                        <View style={{height: 40, width: 1, backgroundColor: bottomTheme}}/>
                        <View style={{width: width / 2 - 5, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'red', fontSize: hp(2.3)}}>0 元</Text>
                            <Text style={{color: 'rgba(0,0,0,0.8)', fontSize: hp(1.7), marginTop: 5}}>收入分红</Text>
                        </View>
                    </View>
                    <View style={{marginTop: 10, paddingHorizontal: 20}}>
                        <Text style={{marginTop: 10, fontSize: hp(1.6), color: 'rgba(0,0,0,0.5)'}}>
                            1、一级好友(直接推荐的好友)完成任意悬赏都可获得其赏金的8%奖励
                        </Text>
                        <Text style={{marginTop: 10, fontSize: hp(1.6), color: 'rgba(0,0,0,0.5)'}}>
                            2、获得一级好友(直接推荐的好友)完成前20个任意悬赏额外奖励其赏金的4%奖励
                        </Text>
                        <Text style={{ marginTop: 10, fontSize: hp(1.6), color: 'rgba(0,0,0,0.5)'}}>
                            3、为防止恶意邀请(机器注册、注册多账号) 被邀请用户必须有一定活跃度才能正常获得佣金,否则将默认不增加累计邀请好友
                        </Text>
                    </View>
                </ScrollView>
                <ToastShare ref={ref => this.ToastShare = ref}/>
            </SafeAreaViewPlus>
        );
    }

}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const TaskReleaseManaRedux = connect(mapStateToProps, mapDispatchToProps)(TaskReleaseMana);


export default TaskReleaseManaRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 40,
        height: 40,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});
