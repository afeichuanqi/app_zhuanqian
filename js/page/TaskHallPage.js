/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet, Platform, FlatList, RefreshControl, ActivityIndicator,
} from 'react-native';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import {bottomTheme, theme} from '../appSet';
import SearchComponent from '../common/SearchComponent';
import Animated from 'react-native-reanimated';
import NavigationBar from '../common/NavigationBar';
import NavigationUtils from '../navigator/NavigationUtils';
import LabelBigComponent from '../common/LabelBigComponent';
import TabBar from '../common/TabBar';
import search from '../res/svg/search.svg';
import fabu from '../res/svg/fabu.svg';
import SvgUri from 'react-native-svg-uri';
import {TabView} from 'react-native-tab-view';
import TaskSumComponent from '../common/TaskSumComponent';

const width = Dimensions.get('window').width;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class TaskHallPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        navigationIndex: 0,
        navigationRoutes: [
            {key: 'first', title: '全部'},
            {key: 'second', title: '高价'},
            {key: 'second1', title: '简单'},
        ],
    };

    componentDidMount() {


    }

    position = new Animated.Value(0);
    topBarTop = new Animated.Value(0);

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        const {navigationIndex, navigationRoutes} = this.state;

        let statusBar = {
            backgroundColor: bottomTheme,//安卓手机状态栏背景颜色
            // barStyle: 'light-content',
            // hidden: false,
        };
        let navigationBar = <NavigationBar
            // showStatusBarHeight={true}
            hide={true}
            statusBar={statusBar}
            style={{backgroundColor: bottomTheme}} // 背景颜色
        />;
        return (
            <View
                style={{flex: 1}}

            >
                {navigationBar}
                {/*顶部样式*/}
                <View style={{
                    backgroundColor: bottomTheme,
                    height: 44,
                    width,
                    // flexDirection: 'row',
                    // justifyContent: 'space-around',
                    alignItems: 'center',

                }}>
                    {/*搜索图标*/}
                    <SvgUri style={{
                        position: 'absolute',
                        left: 10,
                        top: 5,

                    }} width={26} height={26} fill={'white'} svgXmlData={search}/>

                    <TabBar
                        style={{
                            height: 35,
                            // width: width - 150,
                            // overflow:'hidden',
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
                        inactiveStyle={{fontSize: 14, color: [255, 255, 255], height: 10}}
                        indicatorStyle={{height: 3, backgroundColor: 'white'}}
                    />
                    {/*发布按钮图标*/}
                    <View style={{
                        position: 'absolute',
                        right: 10,
                        top: 8,
                        width: 70,
                        height: 25,
                        borderRadius: 20,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <SvgUri style={{marginRight: 3}} width={20} height={20} fill={'black'} svgXmlData={fabu}/>
                        <Text style={{
                            color: 'black',
                        }}>发布</Text>
                    </View>
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

            </View>
        );
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
                return <View style={[styles.scene, {backgroundColor: '#673ab7', flex: 1}]}/>;
        }
    };

}

class FristListComponent extends PureComponent {
   state = {
        taskData: [
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5},
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5},
        ],
        isLoading: false,
        hideLoaded: false,
    };
    _renderIndexPath = ({item, index}) => {
        return <TaskSumComponent
            titleFontSize={15}
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
        return <View style={{backgroundColor: '#e8e8e8', alignItems: 'center'}}>
            <View style={{
                width: width - 10,
                // height: 600,
                backgroundColor: 'white',
                marginVertical: 4,
                borderRadius:8,
            }}>
                <AnimatedFlatList
                    ListHeaderComponent={
                        <View style={{height:30, paddingHorizontal:10,marginTop:20, flexDirection:'row',
                            justifyContent:'space-between',
                        }}>
                            <View >
                                <Text style={{
                                    fontSize:16,
                                }}>全部悬赏</Text>
                            </View>
                            <View >
                                <Text style={{
                                    fontSize:16,
                                }}>全部悬赏</Text>
                            </View>
                        </View>

                    }
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
                    onScroll={Animated.event([
                        {
                            nativeEvent: {
                                contentOffset: {y: this.props.topBarTop},
                            },
                        },
                    ])}
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
            </View>

        </View>;
    }
}

const styles = StyleSheet.create({
    carousel: {
        flex: 1,
        // justifyContent:'center'
    },
    imgStyle: {
        // 设置背景颜色
        backgroundColor: '#E8E8E8',
        // 设置宽度
        width: width,
        borderRadius: 5,
        // 设置高度
        // height:150
    },
});
export default TaskHallPage;
