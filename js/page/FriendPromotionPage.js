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
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl, StyleSheet, Text,
    View, TouchableOpacity, StatusBar, Clipboard, ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {selectBillForUserId, selectSendFormTaskList, selectSignUpList} from '../util/AppService';
import FastImage from 'react-native-fast-image';
import NavigationUtils from '../navigator/NavigationUtils';
import copy from '../res/svg/yaoqing/copy.svg';
import SvgUri from 'react-native-svg-uri';
import Toast from '../common/Toast';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class TaskReleaseMana extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    state = {};

    componentDidMount() {

        // this._updatePage(true);
    }


    componentWillUnmount() {

    }

    render() {
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor(theme, true);
        let statusBar = {
            hidden: false,
            backgroundColor: theme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: theme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '邀请送大礼', null, 'white', 'black', 16, null, false);

        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <ScrollView style={{flex: 1, backgroundColor: '#efefef'}}>
                    <View>
                        <FastImage source={require('../res/img/yaoqing/yaoqinghaoyou.png')}
                                   style={{width: width, height: 180}}/>
                    </View>
                    <View style={{backgroundColor: 'white', marginTop: 10}}>
                        <View style={{alignSelf: 'center', paddingTop: 10}}>
                            <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>我的邀请码</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Clipboard.setString('abshkes');
                                    this.toast.show('复制成功');
                                }}
                                style={{marginTop: 15, flexDirection: 'row', alignSelf: 'center'}}>
                                <Text style={{fontWeight: 'bold'}}>abshkes</Text>
                                <SvgUri style={{
                                    marginLeft: 20,
                                }} width={19} height={19} svgXmlData={copy}/>
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
                        <TouchableOpacity style={{
                            paddingHorizontal: 15,
                            paddingVertical: 8,
                            backgroundColor: bottomTheme,
                            borderRadius: 10,
                        }}>
                            <Text style={{color: 'white'}}>推广链接</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            paddingHorizontal: 15,
                            paddingVertical: 8,
                            backgroundColor: bottomTheme,
                            borderRadius: 10,
                        }}>
                            <Text style={{color: 'white'}}>推广二维码</Text>
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

                            <Text style={{color: 'red', fontSize: 16}}>0位</Text>
                            <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: 12, marginTop: 5}}>累计邀请好友</Text>

                        </View>
                        <View style={{height: 40, width: 1, backgroundColor: bottomTheme}}/>
                        <View style={{width: width / 2 - 5, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'red', fontSize: 16}}>0元</Text>
                            <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: 12, marginTop: 5}}>收入分红</Text>
                        </View>
                    </View>
                    <View style={{marginTop:10, paddingHorizontal:10}}>
                        <Text style={{opacity:0.8,marginTop:10}}>
                            1、一级好友(直接推荐的好友)完成任意悬赏都可获得其赏金的8%奖励
                        </Text>
                        <Text style={{opacity:0.8,marginTop:10}}>
                            2、获得一级好友(直接推荐的好友)完成前20个任意悬赏额外奖励其赏金的4%奖励
                        </Text>
                        <Text style={{opacity:0.8,marginTop:10}}>
                            3、为防止恶意邀请(机器注册、注册多账号) 被邀请用户必须有一定活跃度才能正常获得佣金
                        </Text>
                    </View>
                </ScrollView>

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
