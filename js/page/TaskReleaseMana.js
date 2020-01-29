/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import TabBar from '../common/TabBar';
import {TabView} from 'react-native-tab-view';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import {
    deleteTaskRelease,
    selectTaskReleaseList, updateNoticeIsReadForType,
    updateTaskUpdateTime,
    userSetTaskRecommend,
    userSetTaskTop,
} from '../util/AppService';
import {connect} from 'react-redux';
import TaskReleaseItem from './TaskReleaseMana/TaskReleaseItem';
import ToastSelect from '../common/ToastSelect';
import Toast from 'react-native-root-toast';
import ToastTaskTopRecommend from './TaskReleaseMana/ToastTaskTopRecommend';
import BackPressComponent from '../common/BackPressComponent';
import EventBus from '../common/EventBus';
import EventTypes from '../util/EventTypes';
import actions from '../action';
import {equalsObj} from '../util/CommonUtils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class TaskReleaseMana extends Component {
    constructor(props) {
        super(props);
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.params = this.props.navigation.state.params;
        this.state = {
            navigationIndex: this.params.navigationIndex || 0,
            navigationRoutes: [
                {key: 'first', title: '进行中', isMsg: props.notice_arr[1]},
                {key: 'second', title: '已暂停', isMsg: props.notice_arr[2]},
                {key: 'second1', title: '待上架', isMsg: props.notice_arr[3]},
            ],
        };
        const type = (this.params.navigationIndex || 0) + 1;
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
                    {key: 'first', title: '进行中', isMsg: nextProps.notice_arr[1]},
                    {key: 'second', title: '已暂停', isMsg: nextProps.notice_arr[2]},
                    {key: 'second1', title: '待上架', isMsg: nextProps.notice_arr[3]},
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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '发布管理', null, bottomTheme, 'white', 16, null, false);
        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <View>
                    <TabBar
                        style={{
                            height: 35,
                            backgroundColor: bottomTheme,
                            paddingLeft: 10,
                        }}
                        position={this.position}
                        contentContainerStyle={{paddingTop: 10}}
                        routes={navigationRoutes}
                        index={0}
                        sidePadding={0}
                        handleIndexChange={this.handleIndexChange}
                        // indicatorStyle={styles.indicator}
                        bounces={true}
                        titleMarginHorizontal={wp(5)}
                        activeStyle={{fontSize: hp(2.1), color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: hp(1.6), color: [255, 255, 255], height: 10}}
                        indicatorStyle={{height: 3, backgroundColor: 'yellow', borderRadius: 3}}
                    />
                    <TouchableOpacity
                        onPress={this._releaseClick}
                        activeOpacity={0.6}
                        style={{position: 'absolute', top: 10, right: 10}}>
                        <Text style={{
                            fontSize: 13,
                            color: 'white',
                        }}>发布任务</Text>
                    </TouchableOpacity>
                </View>
                <TabView
                    ref={ref => this.tabView = ref}
                    indicatorStyle={{backgroundColor: 'white'}}
                    navigationState={{index: navigationIndex, routes: navigationRoutes}}
                    renderScene={this.renderScene}
                    position={this.position}
                    renderTabBar={() => null}
                    onIndexChange={index => {
                        this.setState({
                            navigationIndex: index,
                        });
                    }}

                    initialLayout={{width}}
                    lazy={true}
                />

            </SafeAreaViewPlus>
        );
    }

    clearNotice = (noticeType) => {
        const {onSetNoticeMsgIsRead, userinfo, notice_arr} = this.props;
        notice_arr[noticeType] && onSetNoticeMsgIsRead(noticeType) && updateNoticeIsReadForType({type: noticeType}, userinfo.token);
    };
    _releaseClick = () => {
        NavigationUtils.goPage({}, 'TaskRelease');
    };
    handleIndexChange = (index) => {
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {


        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <FristListComponent clearNotice={this.clearNotice} noticeType={1}
                                           source={require('../res/img/ReleseMana/r1.png')}
                                           task_status={[0]}
                                           userinfo={this.props.userinfo}/>;
            case 'second':
                return <FristListComponent clearNotice={this.clearNotice} noticeType={2}
                                           source={require('../res/img/ReleseMana/r2.png')}
                                           task_status={[2]}
                                           userinfo={this.props.userinfo}/>;
            case 'second1':
                return <FristListComponent clearNotice={this.clearNotice} noticeType={3}
                                           source={require('../res/img/ReleseMana/r3.png')}
                                           task_status={[1, 3]}
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
const TaskReleaseManaRedux = connect(mapStateToProps, mapDispatchToProps)(TaskReleaseMana);

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

        //收到消息刷新任务
        EventBus.getInstance().addListener(EventTypes.update_task_release_mana, this.listener = data => {
            const {userinfo, task_status} = this.props;
            const findIndex = task_status.findIndex(item => item == data.index);
            if (findIndex !== -1) {
                const {noticeType, clearNotice} = this.props;
                clearNotice(noticeType);
                selectTaskReleaseList({
                    task_status: task_status.join(','),
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

    _updateList = (refreshing) => {
        const {noticeType, clearNotice} = this.props;
        clearNotice(noticeType);
        const {userinfo, task_status} = this.props;
        if (refreshing) {
            this.page = {pageIndex: 0};
            this.setState({
                isLoading: true,
            });
        } else {
            this.page = {pageIndex: this.page.pageIndex + 1};

        }
        selectTaskReleaseList({
            task_status: task_status.join(','),
            pageIndex: this.page.pageIndex,
        }, userinfo.token).then(result => {

            if (refreshing) {
                // console.log('我被触发');
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

    _renderIndexPath = ({item, index}) => {
        return <TaskReleaseItem
            setTopClick={() => {
                this.taskTop.show(item);
            }}
            setRecommendClick={() => {
                this.taskRecommend.show(item);
            }}
            deleteTask={() => {
                this.deleteTaskId = item.id;
                this.toastSelect.show();
            }}
            onPress={() => {
                if (item.task_status == 1) {
                    NavigationUtils.goPage({
                        task_id: item.id,
                        updateReleasePage: this._updateList,
                        test: false,
                    }, 'TaskDetails');
                } else {
                    NavigationUtils.goPage({taskid: item.id, updateReleasePage: this._updateList}, 'MyOrderManaPage');

                }
            }}
            updateTaskUpdateTime={() => {
                this._updateTaskUpdateTime(item);
            }}
            task_status={this.props.task_status}
            reViewClick={this._itemClick}
            item={item}
            key={item.id}/>;
    };
    _updateTaskUpdateTime = (item) => {
        updateTaskUpdateTime({task_id: item.id}, this.props.userinfo.token).then(result => {
            Toast.show('刷新成功');
        }).catch(msg => {
            Toast.show(msg);
        });
    };
    _itemClick = (item) => {
        NavigationUtils.goPage({task_id: item.id, status: 0, taskUri: item.task_uri}, 'MyTaskReview');
    };

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.page.pageIndex === 0 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10, opacity: 0.7, fontSize: 13}}>没有更多了哦 ~ ~</Text>
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
                style={{backgroundColor: '#f5f5f5'}}
                ListEmptyComponent={<EmptyComponent source={this.props.source} height={height - 100}
                                                    message={'您还没有相关任务'}/>}
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
                // onScroll={this._onScroll}
                ListFooterComponent={() => this.genIndicator(hideLoaded)}
                onEndReached={() => {
                    //console.log('onEndReached.....');
                    // 等待页面布局完成以后，在让加载更多
                    setTimeout(() => {
                        if (this.canLoadMore && taskData.length >= 10) {
                            this.onLoading();
                            this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                        }
                    }, 100);
                }}
                // onScrollEndDrag={this._onScrollEndDrag}
                windowSize={300}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => {
                    this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                }}
            />
            <ToastSelect
                rightTitle={'确认'}
                sureClick={() => {
                    // console.log(this.deleteTaskId);
                    deleteTaskRelease({task_id: this.deleteTaskId}, this.props.userinfo.token).then(result => {
                        this._updateList(true);
                    }).catch(msg => {
                        //console.log(msg);
                    });
                    this.toastSelect.hide();
                }}
                ref={ref => this.toastSelect = ref}>
                <View style={{
                    height: 30, backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                    paddingTop: 10,

                }}>
                    <Text style={{fontSize: 14, width: width - 80}}>删除后无法恢复,是否确认删除？</Text>
                </View>
            </ToastSelect>
            <ToastTaskTopRecommend
                sureTopClick={(item, topNum) => {
                    userSetTaskTop({
                        top_num: topNum,
                        task_id: item.id,
                    }, this.props.userinfo.token).then(data => {
                        setTimeout(() => {
                            Toast.show(`置顶到期时间:` + data.expTime, 2000);
                            // this._updateList(true);
                        }, 300);

                    }).catch(msg => {
                        setTimeout(() => {
                            Toast.show(msg);
                        }, 300);
                    });
                }}
                title={'置顶任务'} ref={ref => this.taskTop = ref}/>
            <ToastTaskTopRecommend
                type={2}
                sureTopClick={(item, topNum) => {
                    userSetTaskRecommend({
                        recommend_num: topNum,
                        task_id: item.id,
                    }, this.props.userinfo.token).then(data => {
                        setTimeout(() => {
                            Toast.show(`推荐到期时间:` + data.expTime, 2000);
                            // this._updateList(true);
                        }, 300);


                    }).catch(msg => {
                        setTimeout(() => {
                            Toast.show(msg);
                        }, 300);
                    });
                }}
                title={'推荐任务'} ref={ref => this.taskRecommend = ref}/>
        </View>;
    }
}

export default TaskReleaseManaRedux;
