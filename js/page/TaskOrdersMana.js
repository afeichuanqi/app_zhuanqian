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
    RefreshControl, StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import NavigationUtils from '../navigator/NavigationUtils';
import {cancelUserSignUp, deleteTaskRelease, selectOrderTasks, selectTaskReleaseList} from '../util/AppService';
import {connect} from 'react-redux';
import ToastSelect from '../common/ToastSelect';
import FastImage from 'react-native-fast-image';
import LabelBigComponent from '../common/LabelBigComponent';
import Toast from '../common/Toast';
import ToastReJection from '../common/ToastReJection';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class TaskOrdersMana extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        navigationIndex: 0,
        navigationRoutes: [
            // {key: 'first', title: '全部'},
            {key: 'second', title: '未提交'},
            {key: 'second1', title: '审核中'},
            {key: 'second2', title: '未通过'},
            {key: 'second3', title: '已通过'},
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
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '接单管理', null, bottomTheme, 'white', 16, null, false);
        const {navigationIndex, navigationRoutes} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
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
                        bounces={true}
                        titleMarginHorizontal={25}
                        activeStyle={{fontSize: 15, color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: 12, color: [255, 255, 255], height: 10}}
                        indicatorStyle={{height: 3, backgroundColor: 'yellow', borderRadius: 3}}
                    />

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

    handleIndexChange = (index) => {
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            // case 'first':
            //     return <FristListComponent status={0}
            //                                userinfo={this.props.userinfo}/>;
            case 'second':
                return <FristListComponent toast={this.toast} status={1}
                                           userinfo={this.props.userinfo}/>;
            case 'second1':
                return <FristListComponent toast={this.toast} status={2}
                                           userinfo={this.props.userinfo}/>;
            case 'second2':
                return <FristListComponent toast={this.toast} status={3}
                                           userinfo={this.props.userinfo}/>;
            case 'second3':
                return <FristListComponent toast={this.toast} status={4}
                                           userinfo={this.props.userinfo}/>;
        }
    };
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({});
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
    }

    componentWillUnmount() {
    }

    _updateList = (refreshing) => {
        const {userinfo, status} = this.props;
        if (refreshing) {
            this.page = {pageIndex: 0};
            this.setState({
                isLoading: true,
            });
        } else {
            this.page = {pageIndex: this.page.pageIndex + 1};
        }
        selectOrderTasks({status, pageIndex: this.page.pageIndex}, userinfo.token).then(result => {

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
        return <OrdersItem
            status={this.props.status}
            key={item.signUpId}
            item={item}
            cancelSignUp={() => {
                this._cancelSignUp(item);
            }}
            showRejection={() => {
                this._showRejection(item);
            }}
            onPress={() => {
                this._itemClick(item);
            }}
        />;
    };
    _showRejection = (item) => {
        console.log(item.rejectionContent);
        if (item.rejectionContent) {
            this.toastReJection.show(JSON.parse(item.rejectionContent));
        }
        //
    };
    _itemClick = (item) => {
        NavigationUtils.goPage({task_id: item.taskId, test: false}, 'TaskDetails');
    };
    _cancelSignUp = (item) => {
        const {userinfo} = this.props;

        cancelUserSignUp({sign_up_id: item.signUpId}, userinfo.token).then(result => {
            this._updateList(true);
        }).catch(msg => {
            this.props.toast.show(msg);
        });
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
                ListEmptyComponent={<EmptyComponent height={height - 100} message={'您还没有相关任务'}/>}
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
                    console.log('onEndReached.....');
                    // 等待页面布局完成以后，在让加载更多
                    if (this.canLoadMore) {
                        this.onLoading();
                        this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                    }
                }}
                windowSize={300}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => {
                    this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                }}
            />
            <ToastReJection
                rightTitle={'确认'}
                title={'驳回详情'}
                sureClick={() => {
                    this.toastSelect.hide();
                }}
                ref={ref => this.toastReJection = ref}/>


        </View>;
    }
}

class OrdersItem extends React.Component {
    render() {
        const {item, status} = this.props;

        return <View style={{
            backgroundColor: 'white', borderBottomWidth: 0.3,
            borderBottomColor: '#e8e8e8',
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
                <View style={{flexDirection: 'row'}}>
                    <FastImage
                        style={[styles.imgStyle]}
                        source={{uri: item.avatar_url}}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                    {status == 1 ? <View style={{marginLeft: 10}}>
                        <Text style={{fontWeight: 'bold'}}>{item.task_title}</Text>
                        <Text style={{fontSize: 13, opacity: 0.7, marginTop: 5}}>到期时间:{item.orderExpTime}</Text>
                        <Text style={{color: 'red', fontSize: 13, marginTop: 5}}>请在{item.orderTimeTitle}内完成</Text>
                    </View> : status == 2 ? <View style={{marginLeft: 10}}>
                        <Text style={{fontWeight: 'bold'}}>{item.task_title}</Text>
                        <Text style={{fontSize: 13, opacity: 0.7, marginTop: 5}}>审核期限:{item.reviewExpTime}</Text>
                        <Text style={{
                            color: 'red',
                            fontSize: 13,
                            marginTop: 5,
                        }}>将在{item.reviewTimeTitle}内完成审核,期限外自动完成</Text>
                    </View> : status == 3 ? <View style={{marginLeft: 10}}>
                        <Text style={{fontWeight: 'bold'}}>{item.task_title}</Text>
                        <Text style={{fontSize: 13, opacity: 0.7, marginTop: 5}}>审核时间:{item.review_time1}</Text>
                        <Text
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={{
                                color: 'red',
                                fontSize: 13,
                                marginTop: 5,
                                width: width - 130,

                            }}>未通过理由:{JSON.parse(item.rejectionContent).turnDownInfo}
                        </Text>

                    </View> : status == 4 ? <View style={{marginLeft: 10}}>
                        <Text style={{fontWeight: 'bold'}}>{item.task_title}</Text>
                        <Text style={{fontSize: 13, opacity: 0.7, marginTop: 5}}>审核时间:{item.review_time1}</Text>
                        <Text
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={{
                                color: 'red',
                                fontSize: 13,
                                marginTop: 5,
                                width: width - 130,

                            }}>恭喜您,已经通过此任务
                        </Text>

                    </View> : null}

                </View>

                <View>
                    <Text style={{fontSize: 17, color: 'red'}}>+{item.reward_price}</Text>
                </View>
            </TouchableOpacity>

            <View style={{alignItems: 'flex-end', paddingHorizontal: 10, paddingBottom: 10}}>
                {status == 1 ?
                    <TouchableOpacity
                        onPress={this.props.cancelSignUp}
                        style={{
                            backgroundColor: bottomTheme, width: 60, height: 25, justifyContent: 'center',
                            alignItems: 'center', borderRadius: 5,
                        }}>
                        <Text style={{color: 'white', fontSize: 12}}>取消报名</Text>
                    </TouchableOpacity>
                    : status == 2 ? <View
                        style={{
                            backgroundColor: 'white', width: 60, height: 25, justifyContent: 'center',
                            alignItems: 'center', borderRadius: 5,
                        }}>
                        <Text style={{color: 'black', opacity: 0.7, fontSize: 12}}>等待审核</Text>
                    </View> : status == 3 ?
                        <View style={{flexDirection: 'row'}}>
                            {item.again_send_status == 1 ? <View

                                style={{
                                    width: 80, height: 25, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 5, marginTop: 5, marginRight: 10,
                                    borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#fafafa',
                                }}>
                                <Text style={{color: bottomTheme, fontSize: 12}}>已重新提交</Text>
                            </View> : item.again_send_status == 2 ? <View

                                style={{
                                    width: 80, height: 25, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 5, marginTop: 5, marginRight: 10,
                                    borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#fafafa',
                                }}>
                                <Text style={{color: bottomTheme, fontSize: 12}}>最终审核</Text>
                            </View> : (item.isSignUpExp == 0 && item.align_num  <= 1) ?//当报名已经过期。且被拒绝次数小于或者等于1
                                <View

                                    style={{
                                        width: 100, height: 25, justifyContent: 'center',
                                        alignItems: 'center', borderRadius: 5, marginTop: 5, marginRight: 10,
                                        borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#fafafa',
                                    }}>
                                    <Text style={{color: bottomTheme, fontSize: 12}}>已放弃重新提交</Text>
                                </View> : (item.isSignUpExp == 1 && parseInt(item.align_num) <= 1) ?//当报名未过期。且被拒绝次数小于或者等于1
                                <TouchableOpacity
                                    onPress={this.props.onPress}
                                    style={{
                                        width: 60, height: 25, justifyContent: 'center',
                                        alignItems: 'center', borderRadius: 5, marginTop: 5, marginRight: 10,
                                        borderWidth: 1, borderColor: '#e8e8e8', backgroundColor: '#fafafa',
                                    }}>
                                    <Text style={{color: bottomTheme, fontSize: 12}}>重新提交</Text>
                                </TouchableOpacity> : null}


                            <TouchableOpacity
                                onPress={this.props.showRejection}
                                style={{
                                    backgroundColor: bottomTheme, width: 60, height: 25, justifyContent: 'center',
                                    alignItems: 'center', borderRadius: 3, marginTop: 5,
                                }}>
                                <Text style={{color: 'white', fontSize: 12}}>具体理由</Text>
                            </TouchableOpacity>
                        </View>
                        : null}
            </View>

        </View>;
    }
}

const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 50,
        height: 50,
        borderRadius: 25,
        // 设置高度
        // height:150
    },
});

export default TaskOrdersManaRedux;
