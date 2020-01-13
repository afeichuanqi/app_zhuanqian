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
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl, Text,
    View, StatusBar, TouchableOpacity, StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyComponent from '../common/EmptyComponent';
import {connect} from 'react-redux';
import {getAllViewHistorys, deleteViewHistory} from '../util/AppService';
import NavigationUtils from '../navigator/NavigationUtils';
import BackPressComponent from '../common/BackPressComponent';
import Toast from '../common/Toast';
import {formatData} from '../util/CommonUtils';
import TaskEasyInfoComponent from '../common/TaskEasyInfoComponent';

const height = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyViewHistoryPage extends PureComponent {
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
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };

    componentDidMount() {
        StatusBar.setBarStyle('dark-content', true);
        this.backPress.componentDidMount();
        this._updatePage(true);
    }

    _updatePage = (isRefresh) => {
        const {userinfo} = this.props;
        if (isRefresh) {
            this.page.pageIndex = 0;
            this.setState({
                isLoading: true,
            });
        } else {
            this.page.pageIndex += 1;
        }

        getAllViewHistorys({
            pageIndex: this.page.pageIndex,
        }, userinfo.token).then(result => {
            if (isRefresh) {
                const newData = formatData([], result, 'viewDate1');
                //console.log(newData);
                this.setState({
                    taskData: newData,
                    isLoading: false,
                    hideLoaded: result.length < 10,
                });
            } else {

                // const tmpArr = [...this.state.taskData];
                const newData = formatData(this.state.taskData, result, 'viewDate1');
                //console.log(newData);
                this.setState({
                    taskData: newData,
                    hideLoaded: result.length < 10,
                });
            }

        }).catch(msg => {
            this.setState({
                isLoading: false,
                hideLoaded: false,
            });
        });

    };


    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    position = new Animated.Value(0);

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
        let TopColumn = ViewUtil.getTopColumn(this.onBackPress, '我的浏览历史', null, 'white', 'black', 16, () => {
            deleteViewHistory({}, this.props.userinfo.token).then(result => {
                this._updatePage(true);
                this.toast.show('清空浏览历史成功');
            });
        }, false, true, '清空', 'black');
        const {taskData, isLoading, hideLoaded} = this.state;
        return (
            <SafeAreaViewPlus
                topColor={theme}
            >
                {navigationBar}
                {TopColumn}
                <Toast
                    ref={ref => this.toast = ref}
                />
                <View style={{flex: 1}}>
                    <AnimatedFlatList
                        style={{backgroundColor: '#f5f5f5', paddingTop: 3}}
                        ListEmptyComponent={<EmptyComponent type={1} height={height - 80} message={'您还没有浏览过任何任务'}/>}
                        ref={ref => this.flatList = ref}
                        data={taskData}
                        scrollEventThrottle={1}
                        renderItem={data => this._renderIndexPath(data)}
                        keyExtractor={(item, index) => index + ''}
                        refreshControl={
                            <RefreshControl
                                title={'加载中'}
                                refreshing={isLoading}
                                onRefresh={this.onRefresh}
                            />
                        }
                        ListFooterComponent={() => this.genIndicator(hideLoaded)}
                        onEndReached={() => {
                            // 等待页面布局完成以后，在让加载更多
                            setTimeout(() => {
                                if (this.canLoadMore && taskData.length >= 10) {
                                    this.onLoading();
                                    this.canLoadMore = false; // 加载更多时，不让再次的加载更多
                                }
                            }, 100);
                        }}
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
        this._updatePage(true);
    };
    onLoading = () => {
        this._updatePage(false);
    };

    _renderIndexPath = ({item, index}) => {

        const tmpItem = {
            time: item.time,
            taskTitle: item.taskTitle,
            imageUrl: item.avatarUrl,
            rewardPrice: item.rewardPrice,
            leftTopText: `${parseInt(item.taskPassNum)}人已完成`,
            leftBottomText: `剩余:${parseInt(item.rewardNum) - parseInt(item.taskSignUpNum)}`,
            taskId:item.taskid,
        };
        return <TaskEasyInfoComponent
            item={tmpItem}
            key={index}
            showTime={true}
        />;

    };

    page = {
        pageIndex: 0,
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
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
});
const mapDispatchToProps = dispatch => ({
    // onSetTaskReleaseInfo: (data) => dispatch(actions.onSetTaskReleaseInfo(data)),
});
const MyViewHistoryPageRedux = connect(mapStateToProps, mapDispatchToProps)(MyViewHistoryPage);


export default MyViewHistoryPageRedux;
const styles = StyleSheet.create({
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: 40,
        height: 40,
        borderRadius: 3,
        // 设置高度
        // height:150
    },
});


