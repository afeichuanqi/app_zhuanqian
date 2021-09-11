/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent, Component} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import TabBar from '../common/TabBar';
import {TabView} from 'react-native-tab-view';
import {
    ActivityIndicator,
    Dimensions,
    FlatList, Platform,
    RefreshControl, StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import {cancelUserSignUp, selectOrderTasks, updateNoticeIsReadForType, userRedoTask} from '../util/AppService';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-root-toast';
import BackPressComponent from '../common/BackPressComponent';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import {equalsObj, renderEmoji} from '../util/CommonUtils';
import actions from '../action';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Global from '../common/Global';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const {timing} = Animated;

class TaskOrdersMana extends Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.params = this.props.navigation.state.params;
        this.state = {
            navigationIndex: this.params.navigationIndex || 0,
            navigationRoutes: [
                {key: 'second', title: '未提交', isMsg: props.notice_arr[4]},
                {key: 'second1', title: '审核中', isMsg: props.notice_arr[5]},
                {key: 'second2', title: '未通过', isMsg: props.notice_arr[6]},
                {key: 'second3', title: '已通过', isMsg: props.notice_arr[7]},
            ],
        };
        const type = (this.params.navigationIndex || 0) + 4;
        const {onSetNoticeMsgIsRead, userinfo} = this.props;
        onSetNoticeMsgIsRead(type) && updateNoticeIsReadForType({type: type}, userinfo.token);
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.navigationIndex !== nextState.navigationIndex
            || !equalsObj(this.props.notice_arr, nextProps.notice_arr)
        ) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (!equalsObj(this.props.notice_arr, nextProps.notice_arr)) {
            this.setState({
                navigationRoutes: [
                    {key: 'second', title: '未提交', isMsg: nextProps.notice_arr[4]},
                    {key: 'second1', title: '审核中', isMsg: nextProps.notice_arr[5]},
                    {key: 'second2', title: '未通过', isMsg: nextProps.notice_arr[6]},
                    {key: 'second3', title: '已通过', isMsg: nextProps.notice_arr[7]},
                ],
            });
        }
    }

    onBackPress = () => {
        NavigationUtils.goBack(this.props.navigation);
        return true;
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
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
        };
        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, ((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) ? '已投递' : '接单管理', null, bottomTheme, 'white', 16, null, false);
        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <View style={{flex: 1}}>
                    {((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) ? null : <TabBar
                        style={{
                            height: hp(5),
                            backgroundColor: bottomTheme,
                            paddingLeft: 10,

                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: hp(1.7)}}
                        routes={navigationRoutes}
                        index={0}
                        sidePadding={0}
                        handleIndexChange={this.handleIndexChange}
                        bounces={true}
                        titleMarginHorizontal={wp(5)}
                        activeStyle={{fontSize: hp(2.3), color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: hp(1.9), color: [255, 255, 255], height: hp(1.2)}}
                        indicatorStyle={{height: 3, backgroundColor: 'yellow', borderRadius: 3}}
                    />}
                    <TabView
                        ref={ref => this.tabView = ref}
                        indicatorStyle={{backgroundColor: 'white'}}
                        navigationState={{index: navigationIndex, routes: navigationRoutes}}
                        renderScene={this.renderScene}
                        position={this.position}
                        renderTabBar={() => null}
                        onIndexChange={index => {
                            // const noticeType = index + 4;
                            // const {onSetNoticeMsgIsRead, userinfo} = this.props;
                            // onSetNoticeMsgIsRead(noticeType) && updateNoticeIsReadForType({type: noticeType}, userinfo.token);
                            this.setState({
                                navigationIndex: index,
                            });
                        }}

                        initialLayout={{width}}
                        lazy={true}
                    />

                </View>


            </SafeAreaViewPlus>
        );
    }

    clearNotice = (noticeType) => {
        const {onSetNoticeMsgIsRead, userinfo, notice_arr} = this.props;
        notice_arr[noticeType] && onSetNoticeMsgIsRead(noticeType) && updateNoticeIsReadForType({type: noticeType}, userinfo.token);
    };
    handleIndexChange = (index) => {
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'second':
                return <FristListComponent clearNotice={this.clearNotice} noticeType={4}
                                           source={require('../res/img/ReleseMana/o1.png')} status={1}
                                           userinfo={this.props.userinfo}/>;
            case 'second1':
                return <FristListComponent clearNotice={this.clearNotice} noticeType={5}
                                           source={require('../res/img/ReleseMana/o2.png')} status={2}
                                           userinfo={this.props.userinfo}/>;
            case 'second2':
                return <FristListComponent clearNotice={this.clearNotice} noticeType={6}
                                           source={require('../res/img/ReleseMana/o3.png')} status={3}
                                           userinfo={this.props.userinfo}/>;
            case 'second3':
                return <FristListComponent clearNotice={this.clearNotice} noticeType={7}
                                           source={require('../res/img/ReleseMana/o4.png')} status={4}
                                           userinfo={this.props.userinfo}/>;
        }
    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
    notice_arr: state.friend.notice_arr,
});
const mapDispatchToProps = dispatch => ({
    onSetNoticeMsgIsRead: (type) => dispatch(actions.onSetNoticeMsgIsRead(type)),
});
const TaskOrdersManaRedux = connect(mapStateToProps, mapDispatchToProps)(TaskOrdersMana);

class FristListComponent extends PureComponent {
    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };
    static defaultProps = {
        task_status: 0,
    };

    constructor(props) {
        super(props);
        this.page = {pageIndex: 0};

    }

    componentDidMount() {

        setTimeout(() => {
            this._updateList(true);
        }, 500);
        EventBus.getInstance().addListener(EventTypes.update_task_orders_mana, this.listener = data => {
            const index = data.indexs.findIndex(item => item == (this.props.status - 1));
            if (index != -1) {
                const {userinfo, status} = this.props;
                const {noticeType, clearNotice} = this.props;
                clearNotice(noticeType);
                selectOrderTasks({
                    status,
                    pageIndex: this.page.pageIndex,
                }, userinfo.token).then(result => {
                    this.setState({
                        taskData: result,
                        isLoading: false,
                        hideLoaded: result.length >= 10 ? false : true,
                    });
                });
            }
        });
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }

    hideItemLength = 0;
    _updateList = (refreshing) => {
        const {noticeType, clearNotice} = this.props;
        clearNotice(noticeType);
        const {userinfo, status} = this.props;
        if (refreshing) {
            this.page = {pageIndex: 0};
            this.setState({
                isLoading: true,
            });
        } else {
            this.page = {pageIndex: this.page.pageIndex + 1};
        }
        selectOrderTasks({
            status,
            pageIndex: this.page.pageIndex,

        }, userinfo.token).then(result => {

            if (refreshing) {
                this.setState({
                    taskData: result,
                    isLoading: false,
                    hideLoaded: result.length >= 10 ? false : true,
                });
            } else {
                const tmpArr = [...this.state.taskData];
                this.setState({
                    taskData: tmpArr.concat(result),
                    hideLoaded: result.length >= 10 ? false : true,
                });
            }

        }).catch(err => {
            this.setState({
                isLoading: false,
                hideLoaded: true,
            });
        });
    };
    _itemPress = (item) => {
        if ((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) {
            NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetailsTmp');
        } else {
            if (this.props.status == 3) {
                NavigationUtils.goPage({
                    sendFormId: item.sendFormId,
                    taskId: item.taskId,
                    fromUserinfo: {
                        avatar_url: item.avatar_url,
                        id: item.userid,
                        username: item.username,
                    },
                    task_uri: item.task_uri,
                }, 'TaskRejectDetailsPage');
            } else {
                NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetails');
            }
        }

    };
    _itemRedoTask = (item) => {
        console.log(item);
        userRedoTask({SendFormTaskId: item.sendFormId}, this.props.userinfo.token).then((result) => {
            EventBus.getInstance().fireEvent(EventTypes.update_task_orders_mana, {indexs: [0, 2]});
            NavigationUtils.goPage({task_id: result.task_id, test: false}, 'TaskDetails');
        }).catch(msg => {
            Toast.show(msg);
        });
    };
    _cancelSignUp = (item, callback) => {
        const {userinfo} = this.props;
        cancelUserSignUp({sign_up_id: item.signUpId}, userinfo.token).then(result => {
            callback(true);
            this.hideItemLength += 1;
            if (this.hideItemLength >= this.state.taskData.length) {
                setTimeout(() => {
                    EventBus.getInstance().fireEvent(EventTypes.update_task_orders_mana, {indexs: [0]});
                }, 300);

            }
        }).catch(msg => {
            callback(false);
            Toast.show(msg);
        });
    };
    _renderIndexPath = ({item, index}) => {
        return <OrdersItem
            status={this.props.status}
            key={item.signUpId}
            item={item}
            cancelSignUp={(callback) => {
                this._cancelSignUp(item, callback);
            }}
            onPress={() => {
                this._itemPress(item);
            }}
            redoTask={() => {
                this._itemRedoTask(item);
            }}
        />;
    };


    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: hp(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10,fontSize:hp(1.7)}}>正在加载更多</Text>
            </View> : this.page.pageIndex === 0 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: hp(1.7)}}>没有更多了哦 ~ ~</Text>
            </View>;
    }

    onLoading = () => {
        this._updateList(false);

    };
    onRefresh = () => {
        this._updateList(true);
    };
    params = {
        pageIndex: 0,
    };


    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        return <View style={{flex: 1}}>
            <AnimatedFlatList
                style={{backgroundColor: '#f7f7f7'}}
                ListEmptyComponent={<EmptyComponent icoW={wp(23)}
                                                    icoH={wp(21)}
                                                    source={this.props.source}
                                                    height={((Global.apple_pay == 1 && Platform.OS === 'ios')||(Global.android_pay == 1 && Platform.OS === 'android')) ? height - 70 : height - 100}
                                                    message={((Global.apple_pay == 1 && Platform.OS === 'ios')||(Global.android_pay == 1 && Platform.OS === 'android')) ? '您还没有投递任何公司' : '您还没有相关任务'}/>}
                ref={ref => this.flatList = ref}
                data={taskData}
                scrollEventThrottle={1}
                renderItem={data => this._renderIndexPath(data)}
                keyExtractor={(item, index) => index + ''}
                refreshControl={
                    <RefreshControl
                        title={'更新任务中'}
                        refreshing={isLoading}
                        onRefresh={this.onRefresh}
                    />
                }
                ListFooterComponent={() => this.genIndicator(hideLoaded)}
                onEndReached={() => {

                    setTimeout(() => {
                        // 等待页面布局完成以后，在让加载更多
                        // this.onLoading();
                        if (this.canLoadMore && taskData.length >= 10) {
                            this.onLoading();
                            this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                        }
                    }, 100);
                }}
                windowSize={300}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => {
                    //console.log('onMomentumScrollBegin');
                    this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                }}
            />


        </View>;
    }
}

class OrdersItem extends React.Component {
    state = {
        hide: false,
    };
    hideAnimated = () => {
        timing(this.animations.scale, {
            duration: 500,
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
        }).start(() => {
            this.setState({
                hide: true,
            });
        });
    };
    animations = {
        scale: new Animated.Value(1),
    };

    render() {
        const {item, status} = this.props;
        const {hide} = this.state;
        if (hide) {
            return null;
        }
        if (!item.taskId) {
            return null;
        }
        let TextTitle = <Text
            numberOfLines={2}
            style={{
                fontWeight: 'bold',
                color: 'black',
                width: wp(55),
            }}>
            {item && renderEmoji(`${item.task_title}`, [], hp(2), 0, 'black').map((item, index) => {
                return item;
            })}
        </Text>;
        if ((Global.apple_pay == 1 && Platform.OS === 'ios') || (Global.android_pay == 1 && Platform.OS === 'android')) {
            return <Animated.View
                style={{
                    backgroundColor: 'white', borderBottomWidth: 0.3,
                    borderBottomColor: '#f0f0f0',
                    opacity: this.animations.scale,
                }}>
                <TouchableOpacity
                    onPress={this.props.onPress}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        paddingVertical: 20,
                        paddingBottom:10,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{marginLeft: 10}}>
                        {TextTitle}
                    </View>

                    <Text style={{fontSize: hp(2.3), color: 'red'}}>{item.reward_price}元/天</Text>
                </TouchableOpacity>
                <View style={{
                    width, justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingRight:10,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.cancelSignUp((bool) => {
                                bool && this.hideAnimated();
                            });
                        }}
                        style={{
                            width:60, height: 30, justifyContent: 'center',
                            // alignItems:'flex-end',
                        }}>
                        <Text style={{color: bottomTheme, fontSize: hp(1.7)}}>取消投递</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>;
        }
        TextTitle = <Text
            numberOfLines={2}
            style={{
                fontWeight: 'bold',
                color: 'black',
                width: wp(55),
            }}>
            {item && renderEmoji(`${item.taskId} - ${item.task_title}`, [], hp(2), 0, 'black').map((item, index) => {
                return item;
            })}
        </Text>;
        return <Animated.View

            style={{
                backgroundColor: 'white', borderBottomWidth: 0.3,
                borderBottomColor: '#f0f0f0',
                opacity: this.animations.scale,
                // transform: [{scale: this.animations.scale}],
            }}>
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingTop: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View style={{flexDirection: 'row',width:wp(60)}}>
                    <FastImage
                        style={[styles.imgStyle]}
                        source={{uri: item.avatar_url}}
                        resizeMode={FastImage.resizeMode.stretch}
                    />

                    {status == 1 ? <View style={{marginLeft: 10}}>
                        {TextTitle}
                        <Text style={{
                            fontSize: hp(1.6),
                            color: 'black',
                            opacity: 0.7,
                            marginTop: hp(0.5),
                        }}>到期时间:{item.orderExpTime}</Text>
                        <Text style={{color: 'red', fontSize: hp(1.6), marginTop: 5}}>请在{item.orderTimeTitle}内完成</Text>
                    </View> : status == 2 ? <View style={{marginLeft: 10}}>
                        {TextTitle}
                        <Text style={{
                            fontSize: hp(1.7),
                            color: 'black',
                            opacity: 0.7,
                            marginTop: hp(0.5),
                        }}>审核期限:{item.reviewExpTime}</Text>
                        <Text style={{
                            color: 'red',
                            fontSize: hp(1.7),
                            marginTop: hp(0.5),
                        }}>将在{item.reviewTimeTitle}内完成审核,期限外自动完成</Text>
                    </View> : status == 3 ? <View style={{marginLeft: 10}}>
                        {TextTitle}
                        <Text style={{
                            fontSize: hp(1.7),
                            opacity: 0.7,
                            marginTop: hp(0.5),
                            color: 'black',
                        }}>审核时间:{item.review_time1}</Text>
                        {(item.isSignUpExp == 1 && parseInt(item.align_num) <= 1) &&
                        <Text style={{fontSize: 13, marginTop: 5, color: 'red'}}>
                            请于 {item.orderExpTime} 之前重新提交
                        </Text>}

                        <Text
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={{
                                color: 'red',
                                fontSize: hp(1.7),
                                marginTop: hp(0.5),
                                width: width - 130,

                            }}>驳回理由:
                            {item.rejectionContent && JSON.parse(item.rejectionContent).turnDownInfo}
                        </Text>


                    </View> : status == 4 ? <View style={{marginLeft: 10}}>
                        {TextTitle}
                        <Text style={{
                            fontSize: hp(1.7),
                            opacity: 0.7,
                            marginTop: hp(0.5),
                            color: 'black',
                        }}>审核时间:{item.review_time1}</Text>
                        <Text
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={{
                                color: 'red',
                                fontSize: hp(1.7),
                                marginTop: hp(0.5),
                                width: width - 130,

                            }}>恭喜您,已经通过此任务
                        </Text>

                    </View> : null}

                </View>

                <View style={{height: hp(5.5), alignItems: 'flex-start'}}>
                    <Text style={{fontSize: hp(2.3), color: 'red'}}>+{item.reward_price}元</Text>
                </View>
            </TouchableOpacity>

            <View style={{alignItems: 'flex-end', paddingHorizontal: 10, paddingBottom: 10}}>
                {status == 1 ?
                    <TouchableOpacity
                        onPress={() => {
                            this.props.cancelSignUp((bool) => {
                                bool && this.hideAnimated();
                                // console.log(bool);
                            });
                        }}
                        style={{
                             height: hp(2), justifyContent: 'center',
                            alignItems: 'center', borderRadius: 5,
                        }}>
                        <Text style={{color: bottomTheme, fontSize: hp(1.7)}}>取消报名</Text>
                    </TouchableOpacity>
                    : status == 2 ? <View
                        style={{
                            backgroundColor: 'white',  height: hp(3), justifyContent: 'center',
                            alignItems: 'center', borderRadius: 5,
                        }}>
                        <Text style={{color: 'black', opacity: 0.7, fontSize: hp(1.7)}}>等待审核</Text>
                    </View> : status == 3 ?
                        <TouchableOpacity
                            onPress={this.props.redoTask}
                            style={{
                                 height: hp(3), justifyContent: 'center',
                                alignItems: 'center', borderRadius: 3,
                            }}>
                            <Text style={{color: bottomTheme, fontSize: hp(1.7)}}>重新提交</Text>
                        </TouchableOpacity>
                        : null}
            </View>

        </Animated.View>;
    }
}

const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: hp(6),
        height: hp(6),
        borderRadius:  hp(3),
        // 设置高度
        // height:150
    },
});

export default TaskOrdersManaRedux;
