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
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Platform,
    TouchableOpacity,

} from 'react-native';
import {theme, bottomTheme} from '../appSet';
import NavigationBar from '../common/NavigationBar';
import SearchComponent from '../common/SearchComponent';
import Carousel from '../common/Carousel';
import FastImage from 'react-native-fast-image';
import TaskSumComponent from '../common/TaskSumComponent';
import TabBar from '../common/TabBar';
import {TabView} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import more from '../res/svg/more.svg';
import SvgUri from 'react-native-svg-uri';
import NavigationUtils from '../navigator/NavigationUtils';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const lunboHeight = height / 4;
const topIputHeight = (Platform.OS === 'ios') ? 30 : 30;
const TabBarHeight = 60;

// const FirstRoute = ;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

    render() {
        const {taskData, isLoading, hideLoaded} = this.state;
        return <AnimatedFlatList
            ListHeaderComponent={
                <View style={{height: lunboHeight + TabBarHeight}}/>
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
        />;
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
        this.props.onRefresh(true);
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
            this.props.onRefresh(false);
        }, 1000);
    };
    params = {
        pageIndex: 0,
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

    _renderIndexPath = ({item, index}) => {
        return <TaskSumComponent/>;
    };

}

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        lunboData: [
            {imgUrl: 'http://img2.imgtn.bdimg.com/it/u=3292807210,3869414696&fm=26&gp=0.jpg'},
            {imgUrl: 'http://static.open-open.com/lib/uploadImg/20160101/20160101125439_819.jpg'},
        ],
        navigationIndex: 0,
        navigationRoutes: [
            {key: 'first', title: '优选推荐'},
            {key: 'second', title: '简单悬赏'},
            {key: 'three', title: '高价悬赏'},
        ],

    };

    componentDidMount() {


    }

    position = new Animated.Value(0);
    topBarTop = new Animated.Value(0);
    // FirstRoute = () => {
    //     // const {taskData, isLoading, hideLoaded} = this.state;
    //
    //     return ;
    // };
    // _onScroll = (y) => {
    //     this.topBarTop = y;
    // };

    // SecondRoute = () => (
    //     <View style={[styles.scene, {backgroundColor: '#673ab7'}]}/>
    // );
    onRefresh = (isRefresh) => {
        console.log('isRefresh', isRefresh);
        if (!this.ActivityIndicator) {
            return;
        }
        if (!isRefresh) {
            this.ActivityIndicator.setNativeProps({
                animating: false,
                hidesWhenStopped: false,
                style: {
                    opacity: 0,
                    zIndex: 0,
                    elevation: 0,
                },
            });
        } else {
            this.ActivityIndicator.setNativeProps({
                animating: true,
                hidesWhenStopped: true,
                style: {
                    opacity: 1,
                    zIndex: 3,
                    elevation: 0.3,
                },
            });
        }
    };

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        // console.log('wo被render');
        const {lunboData, navigationRoutes, navigationIndex} = this.state;
        const containerWidth = width - 18;
        const topBarTop = this.topBarTop.interpolate({
            inputRange: [0, lunboHeight, lunboHeight + 1],
            outputRange: [0, -lunboHeight - 5, -lunboHeight - 5],
        });
        let statusBar = {
            hidden: false,
        };

        let navigationBar = <NavigationBar
            hide={true}
            statusBar={statusBar}
        />;

        return (
            <View
                style={{flex: 1}}
            >
                {navigationBar}
                {/*顶部搜索栏样式*/}
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    zIndex: 2,
                    elevation: 0.2,
                    backgroundColor: theme,
                }}>
                    <Text style={{
                        marginRight: 10,
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>简单赚</Text>
                    <SearchComponent
                        height={topIputHeight}
                        onFocus={this.SearchOnFocus}
                    />
                    {/*<View style={{}}>*/}
                    {/*    */}
                    {/*</View>*/}
                </View>

                {/*rn0.6bug多且行且珍惜*/}
                <View style={{flex: 1, overflow: 'hidden'}}>
                    {/*安卓刷新图标*/}

                    <Animated.View
                        style={{

                            position: 'absolute',
                            // top: topBarTop,
                            // left: 10,
                            zIndex: 2,
                            elevation: 0.1,
                            transform: [{translateY: topBarTop}],

                        }}
                    >
                        {/*真实轮播在这*/}

                        <View style={{
                            alignItems: 'center',
                            height: lunboHeight,
                            paddingTop: 10,
                            backgroundColor: theme,
                            width: width,
                            zIndex: -10,

                        }}>
                            {/*轮播图*/}
                            <Carousel
                                // homeNavigation={NavigationUtil.homeNavigation}
                                // navigation={this.props.navigation}
                                style={styles.carousel}
                                timeout={3000}
                                data={lunboData}
                                renderItem={this._renderItem}
                                itemWidth={containerWidth}
                                containerWidth={containerWidth}
                                separatorWidth={0}
                                pagingEnable={true}
                                paginationDefaultColor={'rgba(255,255,255,0.5)'}
                                paginationActiveColor={'rgba(255,255,255,1)'}
                            />

                        </View>

                        <View style={{backgroundColor: theme}}>
                            {/*真实topbar在这*/}
                            {/*topbar*/}
                            <TabBar
                                style={{
                                    height: 60,
                                    width: width - 35,
                                    marginLeft: 10,
                                    // zIndex: 3,
                                    // elevation: 0.3,
                                }}
                                // position={props.position}
                                // titleMarginHorizontal
                                position={this.position}
                                contentContainerStyle={{paddingTop: 24.5}}
                                routes={navigationRoutes}
                                index={navigationIndex}
                                sidePadding={0}
                                handleIndexChange={this.handleIndexChange}
                                // indicatorStyle={styles.indicator}
                                bounces={true}
                                titleMarginHorizontal={25}
                                activeStyle={{fontSize: 18, color: [0, 0, 0]}}
                                inactiveStyle={{fontSize: 14, color: [0, 0, 0], height: 10}}
                                indicatorStyle={{height: 5, backgroundColor: bottomTheme, borderRadius: 3}}
                            />
                            {/*topbar右边图标*/}
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    console.log('我被单机 ');
                                }}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: 25,
                                }}>
                                <SvgUri width={15} height={15} svgXmlData={more}/>
                            </TouchableOpacity>
                        </View>


                    </Animated.View>

                    {/*下部刷新列表tab*/}
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
                        initialLayout={{width: Dimensions.get('window').width}}
                        lazy={true}
                    />
                </View>


            </View>
        );
    }

    renderScene = ({route, jumpTo}) => {
        this.jumpTo = jumpTo;
        switch (route.key) {
            case 'first':
                return <FristListComponent
                    topBarTop={this.topBarTop}
                    onScroll={this._onScroll}
                    onRefresh={this.onRefresh}
                />;
            case 'second':
                return <FristListComponent
                    topBarTop={this.topBarTop}
                    onScroll={this._onScroll}
                    onRefresh={this.onRefresh}
                />;;
        }
    };
    handleIndexChange = (index) => {
        // console.log(index);
        const {navigationRoutes} = this.state;
        this.jumpTo(navigationRoutes[index].key);
    };

    _renderItem = ({item, index}) => {
        return <TouchableOpacity onPress={() => {
            console.log('我被单机FastImage');
        }}>
            <FastImage
                style={[styles.imgStyle, {height: '100%', width: '100%'}]}
                source={{uri: `${item.imgUrl}`}}
                resizeMode={FastImage.stretch}
                key={index}
            />
        </TouchableOpacity>
            ;
    };
    SearchOnFocus = () => {
        console.log('我被触发');
        NavigationUtils.goPage({}, 'SearchPage');
    };
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
export default HomePage;
