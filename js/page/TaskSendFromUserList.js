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
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl, StyleSheet, Text,
    View, TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {selectSendFormTaskList, selectSignUpList} from '../util/AppService';
import FastImage from 'react-native-fast-image';
import NavigationUtils from '../navigator/NavigationUtils';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class TaskReleaseMana extends PureComponent {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };

    componentDidMount() {

        this._updatePage(true);
    }

    _updatePage = (isRefresh) => {
        const {status, taskid} = this.params;
        const {userinfo} = this.props;
        if (isRefresh) {
            this.page.pageIndex = 0;
            this.setState({
                isLoading: true,
            });
        } else {
            this.page.pageIndex += 1;

        }
        if (status === 0) {
            selectSignUpList({
                status: 0,
                task_id: taskid,
                pageIndex: this.page.pageIndex,
            }, userinfo.token).then(result => {
                console.log(result);
                if (isRefresh) {
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

            }).catch(msg => {
                console.log(msg);
            });
        } else {
            selectSendFormTaskList({
                status,
                task_id: taskid,
                pageIndex: this.page.pageIndex,
            }, userinfo.token).then(result => {
                if (isRefresh) {
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

            }).catch(msg => {
                console.log(msg);
            });
        }

    };

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
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, this.params.title, null, bottomTheme, 'white', 16, null, false);
        const {taskData, isLoading, hideLoaded} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={bottomTheme}
            >
                {navigationBar}
                {TopColumn}

                <View style={{flex: 1}}>
                    <AnimatedFlatList
                        style={{backgroundColor: '#e8e8e8'}}
                        ListEmptyComponent={<EmptyComponent marginTop={-80} message={'您还没有相关任务'}/>}
                        ref={ref => this.flatList = ref}
                        data={taskData}
                        scrollEventThrottle={1}
                        renderItem={data => this._renderIndexPath(data)}
                        keyExtractor={(item, index) => index + ''}
                        refreshControl={
                            <RefreshControl
                                title={'更新中'}
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
                </View>

            </SafeAreaViewPlus>
        );
    }

    onRefresh = () => {

    };
    _renderIndexPath = ({item, index}) => {
        return <TouchableOpacity
            onPress={() => {
                if (item.task_status == 0) {
                    NavigationUtils.goPage({task_id: this.params.taskid, status: item.task_status}, 'ShopInfoPage');
                } else {
                    NavigationUtils.goPage({task_id: this.params.taskid, status: item.task_status}, 'MyTaskReview');
                }

            }}
            ket={index} style={{
            height: 60, width, paddingHorizontal: 10, justifyContent: 'space-between', alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
        }}>

            <View style={{flexDirection: 'row'}}>
                <FastImage
                    style={[styles.imgStyle]}
                    source={{uri: item.avatar_url}}
                    resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{justifyContent: 'space-around'}}>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Text style={{fontSize: 15}}>{item.username}</Text>
                        <Text style={{marginLeft: 5}}>(ID:{item.userid})</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5, alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 14,
                            color: 'rgba(0,0,0,0.8)',
                        }}>{item.task_status == 1 ? '审核时间' : item.task_status == 0 ? '进行中' : item.task_status == -1 ? '驳回时间' : ''}</Text>
                        <Text style={{fontSize: 14, color: 'rgba(0,0,0,0.8)'}}>{item.send_date1}</Text>
                    </View>
                </View>
            </View>
            <View>
                <Text
                    style={{color: bottomTheme}}>{item.task_status == 1 ? '已完成' : item.task_status == 0 ? '进行中' : item.task_status == -1 ? '已驳回' : ''}</Text>
            </View>
        </TouchableOpacity>;
    };
    page = {
        pageIndex: 0,
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