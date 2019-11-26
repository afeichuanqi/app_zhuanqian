/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
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
    InteractionManager,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import {deleteTaskRelease, selectTaskReleaseList} from '../util/AppService';
import {connect} from 'react-redux';
import TaskReleaseItem from './TaskReleaseMana/TaskReleaseItem';
import ToastSelect from '../common/ToastSelect';
import Toast from '../common/Toast';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class TaskReleaseMana extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        navigationIndex: 0,
        navigationRoutes: [
            {key: 'first', title: '进行中'},
            {key: 'second', title: '已暂停'},
            {key: 'second1', title: '待上架'},
        ],
    };

    componentDidMount() {


    }

    componentWillUnmount() {

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
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '发布管理', null, bottomTheme, 'white', 16, null, false);
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
                        titleMarginHorizontal={25}
                        activeStyle={{fontSize: 15, color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: 12, color: [255, 255, 255], height: 10}}
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
                return <FristListComponent task_status={0}
                                           userinfo={this.props.userinfo}/>;
            case 'second':
                return <FristListComponent task_status={2}
                                           userinfo={this.props.userinfo}/>;
            case 'second1':
                return <FristListComponent task_status={1}
                                           userinfo={this.props.userinfo}/>;
        }
    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
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

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.navigationIndex == this.props.index) {
    //         this._updateList(true);
    //     }
    //
    // }

    componentDidMount() {
        setTimeout(() => {
            this._updateList(true);
        }, 500);
        // this._didBlurSubscription = this.props.navigation.addListener(
        //     'willFocus',
        //     payload => {
        //         console.debug('didBlur', payload);
        //     }
        // );

    }

    componentWillUnmount() {

        // this._didBlurSubscription && this._didBlurSubscription.remove();
    }

    _updateList = (refreshing) => {
        const {userinfo, task_status} = this.props;
        if (refreshing) {
            this.page = {pageIndex: 0};
            this.setState({
                isLoading: true,
            });
        } else {
            this.page = {pageIndex: this.page.pageIndex + 1};
            // this.setState({
            //     isLoading: true,
            // });
        }
        selectTaskReleaseList({task_status, pageIndex: this.page.pageIndex}, userinfo.token).then(result => {

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

        });
    };

    _renderIndexPath = ({item, index}) => {
        return <TaskReleaseItem
            deleteTask={() => {
                this.deleteTaskId = item.id;
                this.toastSelect.show();

            }}
            onPress={() => {
                if (this.props.task_status == 1) {
                    NavigationUtils.goPage({
                        task_id: item.id,
                        updateReleasePage: this._updateList,
                        test: false,
                    }, 'TaskDetails');
                } else {
                    NavigationUtils.goPage({taskid: item.id, updateReleasePage: this._updateList}, 'MyOrderManaPage');

                }


            }
            }
            task_status={this.props.task_status}
            reViewClick={this._itemClick}
            item={item}
            key={item.id}/>;
    };
    _itemClick = (item) => {
        NavigationUtils.goPage({task_id: item.id, status: 0, taskUri: item.task_uri}, 'MyTaskReview');
    };

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多 ~ ~</Text>
            </View> : this.page.pageIndex === 0 || !this.page.pageIndex ? null : <View
                style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10}}>没有更多了哦 ~ ~</Text>
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
                style={{backgroundColor: '#e8e8e8'}}
                ListEmptyComponent={<EmptyComponent height={height-100}  message={'您还没有相关任务'}/>}
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
                    console.log('onEndReached.....');
                    // 等待页面布局完成以后，在让加载更多
                    if (this.canLoadMore) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
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
                        console.log(msg);
                    });
                    this.toastSelect.hide();
                }}
                ref={ref => this.toastSelect = ref}>
                <View style={{
                    height: 60, backgroundColor: 'white', paddingHorizontal: 18, justifyContent: 'center',
                    paddingTop: 10,

                }}>
                    <Text style={{fontSize: 14, width: width - 80}}>删除后无法恢复,是否确认删除？</Text>
                </View>
            </ToastSelect>

        </View>;
    }
}

export default TaskReleaseManaRedux;
