/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {theme, bottomTheme} from '../appSet';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import TabBar from '../common/TabBar';
import {TabView} from 'react-native-tab-view';
import {ActivityIndicator, Dimensions,TouchableOpacity, FlatList, RefreshControl, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';
import TaskSumComponent from '../common/TaskSumComponent';
import EmptyComponent from '../common/EmptyComponent';
import NavigationUtils from '../navigator/NavigationUtils';

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
        let TopColumn = ViewUtil.getTopColumn(this._goBackClick, '发布管理', null, bottomTheme, 'white', 16);
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
                        activeStyle={{fontSize: 18, color: [255, 255, 255]}}
                        inactiveStyle={{fontSize: 13, color: [255, 255, 255], height: 10}}
                        indicatorStyle={{height: 5, backgroundColor: 'yellow', borderRadius: 3}}
                    />
                    <TouchableOpacity
                        onPress={this._releaseClick}
                        activeOpacity={0.6}
                        style={{position:'absolute',top:10,right:10}}>
                        <Text style={{
                            fontSize:13,
                            color:'white'
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
                    onIndexChange={index => this.setState({
                        navigationIndex: index,
                    })}

                    initialLayout={{width}}
                    lazy={true}
                />

            </SafeAreaViewPlus>
        );
    }
    _releaseClick=()=>{
        NavigationUtils.goPage({},'TaskRelease')
    }
    handleIndexChange = (index) => {
        // console.log(index);
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };
    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <FristListComponent/>;
            case 'second':
                return <View style={[{backgroundColor: '#673ab7', flex: 1}]}/>;
        }
    };
}

class FristListComponent extends PureComponent {
    state = {
        taskData: [],
        isLoading: false,
        hideLoaded: true,
    };
    _renderIndexPath = ({item, index}) => {
        return <TaskSumComponent
            titleFontSize={15}
            marginHorizontal={15}
        />;
    };

    genIndicator(hideLoaded) {
        return !hideLoaded ?
            <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                    style={{color: 'red'}}
                />
                <Text style={{marginLeft: 10}}>正在加载更多</Text>
            </View> : this.params.pageIndex === 0 || !this.params.pageIndex ? null : <View
                style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{marginLeft: 10}}>没有更多了哦</Text>
            </View>;
    }

    onLoading = () => {
        console.log('onLoading触发中');
        this.setState({
            hideLoaded: false,
        });
        const data = [...this.state.taskData];
        // data.push([...data]);
        let tmpData = [];
        for (let i = 0; i < 10; i++) {
            console.log(i);
            tmpData.push({
                id: i,
            });
        }
        setTimeout(() => {
            this.setState({
                taskData: data.concat(tmpData),
            }, () => {
                // this
                // this.setState({
                //     hideLoaded: true,
                // });
            });
        }, 2000);

    };
    onRefresh = () => {
        this.setState({
            isLoading: true,
        });
        // this.props.onRefresh(true);
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
            // this.props.onRefresh(false);
        }, 1000);
    };
    params = {
        pageIndex: 0,
    };


    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        return <View style={{flex: 1}}>
            <AnimatedFlatList

                ListEmptyComponent={<EmptyComponent marginTop={-80} message={'您还没有相关任务'}/>}
                ref={ref => this.flatList = ref}
                data={taskData}
                scrollEventThrottle={1}
                renderItem={data => this._renderIndexPath(data)}
                keyExtractor={(item, index) => index + ''}
                refreshControl={
                    <RefreshControl
                        title={'更新任务中'}
                        refreshing={isLoading}
                        onRefresh={() => this.onRefresh()}
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
                    console.log('我被触发');
                    this.canLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
                }}
            />


        </View>;
    }
}

export default TaskReleaseMana;
